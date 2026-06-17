import { API_BASE_URL } from "../../config/api";
import type { ContentBlock } from "../../app/chat/pages/chat.type";

export type ChatStreamStep = {
  type: string;
  content: string;
};

export type ChatStreamChunk = {
  type: "stream";
  steps: ChatStreamStep[];
  final: ChatStreamStep[];
};

export type ChatStreamHandlers = {
  onChunk: (chunk: ChatStreamChunk) => void;
  onError?: (error: Error) => void;
};

const CHAT_STREAM_URL = `${API_BASE_URL}/api/v1/chat/stream`;

export async function streamChat(
  message: string,
  threadId: string,
  handlers: ChatStreamHandlers
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(CHAT_STREAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, thread_id: threadId }),
    });
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error("Failed to reach chat API");
    handlers.onError?.(err);
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Chat request failed (${response.status})`);
    handlers.onError?.(err);
    throw err;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    const err = new Error("Chat response has no body");
    handlers.onError?.(err);
    throw err;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  /**
   * Extract complete JSON objects from a growing stream buffer.
   * Some servers flush without newline delimiters; relying on "\n" causes
   * tool steps to appear late. This makes parsing boundary-independent.
   */
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

    // Keep any trailing incomplete object (or noise) for the next chunk.
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
      const chunk = JSON.parse(trimmed) as ChatStreamChunk;
      handlers.onChunk(chunk);
    } catch {
      // ignore malformed / incomplete JSON fragments
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { objects, rest } = extractJsonObjects(buffer);
    buffer = rest;
    for (const obj of objects) processJsonText(obj);
  }

  buffer += decoder.decode();
  // Final flush: attempt object extraction first, then fallback to a single parse.
  const { objects, rest } = extractJsonObjects(buffer);
  for (const obj of objects) processJsonText(obj);
  if (rest.trim()) processJsonText(rest);
}

export function formatToolName(toolName: string): string {
  const label = toolName.replace(/_tool$/, "").replace(/_/g, " ");
  return `Using ${label}`;
}

export function streamStepToContentBlock(step: ChatStreamStep): ContentBlock | null {
  if (step.type === "markdown") {
    return { type: "markdown", content: step.content };
  }

  if (step.type === "text") {
    return { type: "text", text: step.content };
  }

  return null;
}
