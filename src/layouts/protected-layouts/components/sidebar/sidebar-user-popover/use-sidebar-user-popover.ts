import { useState, useRef, useEffect } from "react";

type ActiveModal = "profile" | "logout" | null;

export const useSidebarUserPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Explanation: closes the popover when clicking outside the component
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    // Explanation: closes the popover when pressing Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const onToggle = () => setIsOpen((prev) => !prev);
  const onClose = () => setIsOpen(false);
  const forceOpen = () => setIsOpen(true);

  const openModal = (modal: NonNullable<ActiveModal>) => {
    setIsOpen(false);
    setActiveModal(modal);
  };

  const closeModal = () => setActiveModal(null);

  return {
    isOpen,
    onToggle,
    onClose,
    forceOpen,
    popoverRef,
    activeModal,
    openModal,
    closeModal,
  };
};
