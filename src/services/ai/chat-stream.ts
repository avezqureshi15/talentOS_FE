import { API_BASE_URL, CHAT_STREAM_ENDPOINT } from "@/constants/constants";
import type { ChatStreamCallbacks, StreamChunk } from "./chat-stream.types";

export const streamChat = async (
  message: string,
  threadId: string,
  callbacks: ChatStreamCallbacks,
): Promise<void> => {
  const url = `${API_BASE_URL}${CHAT_STREAM_ENDPOINT}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/x-ndjson",
    },
    body: JSON.stringify({
      message,
      thread_id: threadId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat stream failed: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  const processLines = (text: string) => {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const chunk: StreamChunk = JSON.parse(line);
        processChunk(chunk, callbacks);
      } catch {
        // skip malformed lines
      }
    }
    return lines[lines.length - 1] ?? "";
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      buffer = processLines(buffer);
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      processLines(buffer + "\n");
    }

    callbacks.onComplete?.();
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Stream reading failed");
    callbacks.onError?.(error);
    throw error;
  }
};

const processChunk = (chunk: StreamChunk, callbacks: ChatStreamCallbacks) => {
  if (chunk.steps?.length) {
    for (const step of chunk.steps) {
      callbacks.onStep?.(step);
    }
  }

  if (chunk.final?.length) {
    for (const block of chunk.final) {
      callbacks.onFinal?.(block);
    }
  }
};
