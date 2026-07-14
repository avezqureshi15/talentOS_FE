import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAIChatPanelStore } from "@/store/ai-chat-panel.store";
import { AI_CHAT_PANEL } from "@/layouts/protected-layouts/components/ai-chat-panel/ai-chat-panel.constants";
import type { ChatMessage, PanelState } from "@/layouts/protected-layouts/components/ai-chat-panel/ai-chat-panel.types";
import { ROUTES } from "@/constants/routes";
import { PAGINATION } from "@/constants/api-endpoints";
import { KEYBOARD_SHORTCUTS } from "@/constants/keyboard-shortcuts";
import { AI_SCAN_ANIMATION } from "@/constants/constants";
import { fetchChats } from "@/services/chat/chat-history";
import { useChatStore } from "@/store/chat.store";

let _msgId = 0;

function nextId(): string {
  _msgId += 1;
  return `ai-msg-${_msgId}-${Date.now()}`;
}

export function useAIChatPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openPanel, closePanel } = useAIChatPanelStore();
  const resetChat = useChatStore((s) => s.reset);

  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [floatingInput, setFloatingInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sidebarInput, setSidebarInput] = useState("");

  const [tooltip, setTooltip] = useState<{ lines: string[]; rect: DOMRect } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [scanning, setScanning] = useState(false);

  const floatingInputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const sidebarInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyBtnRef = useRef<HTMLButtonElement>(null);
  const historyPopupRef = useRef<HTMLDivElement>(null);

  const isChatDetailPage = AI_CHAT_PANEL.CHAT_DETAIL_REGEX.test(location.pathname);
  const shouldRender = !isChatDetailPage;

  const { data: recentChats } = useQuery({
    queryKey: ["ai-panel-chat-history"],
    queryFn: () => fetchChats(0, PAGINATION.DEFAULT_CHATS_PAGE_SIZE),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (panelState === "panel") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, panelState]);

  useEffect(() => {
    if (panelState === "input") {
      floatingInputRef.current?.focus();
    }
  }, [panelState]);

  useEffect(() => {
    if (panelState !== "input") return;
    const handler = (e: MouseEvent) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(e.target as Node)) {
        setPanelState("idle");
        setFloatingInput("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panelState]);

  useEffect(() => {
    if (!historyOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        historyPopupRef.current &&
        !historyPopupRef.current.contains(e.target as Node) &&
        historyBtnRef.current &&
        !historyBtnRef.current.contains(e.target as Node)
      ) {
        setHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [historyOpen]);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { id: nextId(), role, content, timestamp: Date.now() }]);
  }, []);

  const handleAIPillClick = useCallback(() => {
    setPanelState("input");
    setFloatingInput("");
    setTooltip(null);
  }, []);

  const handleFloatingSend = useCallback(() => {
    const text = floatingInput.trim();
    if (!text) return;
    addMessage("user", text);
    setFloatingInput("");
    if (AI_SCAN_ANIMATION) {
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        openPanel();
        setPanelState("panel");
      }, 1600);
    } else {
      openPanel();
      setPanelState("panel");
    }
  }, [floatingInput, addMessage, openPanel]);

  const handleClose = useCallback(() => {
    closePanel();
    setPanelState("idle");
    setSidebarInput("");
    setHistoryOpen(false);
    setTooltip(null);
  }, [closePanel]);

  const handleNewChat = useCallback(() => {
    resetChat();
    navigate(ROUTES.CHAT);
    handleClose();
  }, [resetChat, navigate, handleClose]);

  const handleZoomToChat = useCallback(() => {
    navigate(ROUTES.CHAT);
    handleClose();
  }, [navigate, handleClose]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      navigate(`${ROUTES.CHAT}/${chatId}`);
      handleClose();
    },
    [navigate, handleClose],
  );

  const handleFloatingKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleFloatingSend();
      }
    },
    [handleFloatingSend],
  );

  const handleSidebarSend = useCallback(() => {
    const text = sidebarInput.trim();
    if (!text) return;
    addMessage("user", text);
    setSidebarInput("");
  }, [sidebarInput, addMessage]);

  const handleSidebarKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSidebarSend();
      }
    },
    [handleSidebarSend],
  );

  const handlePillMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      lines: [AI_CHAT_PANEL.AI_PILL_TOOLTIP_TITLE, AI_CHAT_PANEL.AI_PILL_TOOLTIP_LINE],
      rect,
    });
  }, []);

  const handlePillMouseLeave = useCallback(() => setTooltip(null), []);

  const toggleHistory = useCallback(() => {
    setHistoryOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!shouldRender) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.code === KEYBOARD_SHORTCUTS.ASK_AI.code) {
        e.preventDefault();
        if (panelState === "idle") {
          setPanelState("input");
          setTooltip(null);
        } else if (panelState === "panel") {
          handleClose();
        }
      }
      if (e.key === "Escape") {
        if (historyOpen) {
          setHistoryOpen(false);
          return;
        }
        if (panelState === "input") {
          setPanelState("idle");
          setFloatingInput("");
        } else if (panelState === "panel") {
          handleClose();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [panelState, shouldRender, handleClose, historyOpen]);

  return {
    shouldRender,
    panelState,
    floatingInput,
    setFloatingInput,
    floatingInputRef,
    inputContainerRef,
    sidebarInput,
    setSidebarInput,
    sidebarInputRef,
    messages,
    messagesEndRef,
    tooltip,
    historyOpen,
    historyBtnRef,
    historyPopupRef,
    scanning,
    recentChats: recentChats?.data ?? [],
    handleAIPillClick,
    handlePillMouseEnter,
    handlePillMouseLeave,
    handleFloatingSend,
    handleFloatingKeyDown,
    handleSidebarSend,
    handleSidebarKeyDown,
    handleClose,
    handleNewChat,
    handleZoomToChat,
    handleSelectChat,
    toggleHistory,
  };
}
