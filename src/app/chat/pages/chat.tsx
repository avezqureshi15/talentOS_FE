import { useState, useEffect } from "react";
import "./chat.css";

import { Icon } from "@/components/ui/icons";
import ChatArea from "@/app/chat/components/chat-area/chat-area";
import ChatInput from "@/components/ui/chat-input/chat-input";
import Waveform from "@/assets/wave-form/wave-form";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";

import { useChatStream } from "@/app/chat/hooks/use-chat-stream";

import { useChatStore } from "@/store/chat.store";

export default function Chat() {
  const [input, setInput] = useState("");

  const { hasStarted, setStarted, isProcessing } = useChatStore();

  const chatStream = useChatStream();

  const handleSend = (text: string) => {
    chatStream.mutate({ text });
  };


  useEffect(() => {
    setStarted();
  }, []);

  return (
    <ErrorBoundary>
      <ChatArea onSend={handleSend} />

      {hasStarted && (
        <ChatInput
          mounted={false}
          input={input}
          setInput={setInput}
          onSend={() => {
            if (!input.trim() || isProcessing) return;

            handleSend(input);
            setInput("");
          }}
          Icon={Icon}
          Waveform={Waveform}
        />
      )}
    </ErrorBoundary>
  );
}