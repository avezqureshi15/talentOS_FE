export type StreamChunkStep = {
  type: string;
  content: string;
};

export type StreamChunk = {
  type: "stream";
  steps: StreamChunkStep[];
  final: Array<{
    type: string;
    content: string;
    ui?: string;
  }>;
};

export type ChatStreamCallbacks = {
  onStep?: (step: StreamChunkStep) => void;
  onFinal?: (block: { type: string; content: string; ui?: string }) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  onChatId?: (chatId: string) => void;
};
