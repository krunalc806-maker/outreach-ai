export type ChatRole = "user" | "assistant" | "system";

export type ChatStatus = "idle" | "loading" | "streaming" | "error";

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  kind: "file" | "image";
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  attachments?: ChatAttachment[];
  status?: "complete" | "streaming" | "error";
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  messages: ChatMessage[];
}

export interface ChatModel {
  id: string;
  label: string;
  description: string;
}

export interface ChatStreamEvent {
  type: "text-delta" | "message-complete" | "error";
  delta?: string;
  error?: string;
}

export interface ChatProviderAdapter {
  stream(input: {
    conversation: ChatConversation;
    message: ChatMessage;
    model: string;
  }): AsyncIterable<ChatStreamEvent>;
  stop?(conversationId: string): Promise<void>;
}
