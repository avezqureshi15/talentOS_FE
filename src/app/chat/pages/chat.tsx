import { useState, useEffect } from "react";
import "./chat.css";

import { Icon } from "../../../components/ui/icons";
import ChatArea from "../components/chat-area/chat-area";
import ChatInput from "../../../components/ui/chat-input/chat-input";

import { processUserMessage } from "../engine/chat-engine";

import { useChatStore } from "../../../store/chat.store";

export default function Chat() {
  const [input, setInput] = useState("");

  const { messages, hasStarted, isStreaming, setStarted } = useChatStore();

  useEffect(() => {
    setStarted();
  }, [setStarted]);

  const handleSend = async (text: string, depth: number) => {
    if (isStreaming) return;
    await processUserMessage(text, depth);
  };

  return (
    <>
      <ChatArea onSend={handleSend} />

      {hasStarted && (
        <ChatInput
          mounted={false}
          input={input}
          setInput={setInput}
          onSend={() => {
            if (!input.trim() || isStreaming) return;

            handleSend(input, messages.length);
            setInput("");
          }}
          Icon={Icon}
        />
      )}
    </>
  );
}
