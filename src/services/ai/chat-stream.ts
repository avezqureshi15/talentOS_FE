import { API_BASE_URL, CHAT_STREAM_ENDPOINT } from "@/constants/constants";
import type { ChatStreamCallbacks, StreamChunk } from "./chat-stream.types";

export const streamChat = async (
  message: string,
  chatId: string | null,
  visitorId: string,
  callbacks: ChatStreamCallbacks,
): Promise<string | null> => {
  const url = `${API_BASE_URL}${CHAT_STREAM_ENDPOINT}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      chat_id: chatId,
      visitor_id: visitorId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat stream failed: ${response.status} ${response.statusText}`);
  }

  const resolvedChatId = response.headers.get("X-Chat-Id");
  if (resolvedChatId) {
    callbacks.onChatId?.(resolvedChatId);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  const extractJsonObjects = (input: string): { objects: string[]; rest: string } => {
    const objects: string[] = [];

    let startIdx = -1;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === "\"") {
          inString = false;
        }
        continue;
      }

      if (ch === "\"") {
        inString = true;
        continue;
      }

      if (ch === "{") {
        if (depth === 0) startIdx = i;
        depth += 1;
        continue;
      }

      if (ch === "}") {
        if (depth > 0) depth -= 1;
        if (depth === 0 && startIdx !== -1) {
          objects.push(input.slice(startIdx, i + 1));
          startIdx = -1;
        }
      }
    }

    const rest =
      depth === 0
        ? ""
        : startIdx !== -1
          ? input.slice(startIdx)
          : input;

    return { objects, rest };
  };

  const processJsonText = (jsonText: string) => {
    const trimmed = jsonText.trim();
    if (!trimmed) return;
    try {
      const chunk = JSON.parse(trimmed) as StreamChunk;
      processChunk(chunk, callbacks);
    } catch {
      // skip malformed / incomplete JSON fragments
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const { objects, rest } = extractJsonObjects(buffer);
      buffer = rest;
      for (const obj of objects) processJsonText(obj);
    }

    buffer += decoder.decode();
    const { objects, rest } = extractJsonObjects(buffer);
    for (const obj of objects) processJsonText(obj);
    if (rest.trim()) processJsonText(rest);

    callbacks.onComplete?.();
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Stream reading failed");
    callbacks.onError?.(error);
    throw error;
  }

  return resolvedChatId;
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
