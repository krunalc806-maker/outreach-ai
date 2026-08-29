import type { ChatAttachment, ChatConversation } from "@/types/chat";

export interface ChatStreamEventPayload {
  event: string;
  payload: unknown;
}

export async function streamChatMessage(input: {
  content: string;
  attachments: ChatAttachment[];
  conversationId: string;
  model: string;
  regenerate?: boolean;
  messageId?: string;
  assistantMessageId?: string;
  signal?: AbortSignal;
  onEvent: (event: ChatStreamEventPayload) => void;
}) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: input.content,
      attachments: input.attachments,
      conversationId: input.conversationId,
      model: input.model,
      regenerate: input.regenerate,
      messageId: input.messageId,
      assistantMessageId: input.assistantMessageId,
    }),
    signal: input.signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("The chat request could not be started.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const chunk = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);
      boundary = buffer.indexOf("\n\n");

      if (!chunk.startsWith("event:")) {
        continue;
      }

      const lines = chunk.split("\n");
      const eventName = lines[0].replace(/^event:\s*/, "").trim();
      const dataLine = lines.find((line) => line.startsWith("data:"))?.replace(/^data:\s*/, "").trim();

      if (!dataLine) {
        continue;
      }

      try {
        input.onEvent({ event: eventName, payload: JSON.parse(dataLine) });
      } catch {
        input.onEvent({ event: eventName, payload: dataLine });
      }
    }
  }

  const tail = buffer.trim();
  if (tail) {
    const lines = tail.split("\n");
    const eventName = lines[0].replace(/^event:\s*/, "").trim();
    const dataLine = lines.find((line) => line.startsWith("data:"))?.replace(/^data:\s*/, "").trim();
    if (dataLine) {
      try {
        input.onEvent({ event: eventName, payload: JSON.parse(dataLine) });
      } catch {
        input.onEvent({ event: eventName, payload: dataLine });
      }
    }
  }
}

export async function fetchConversations() {
  const response = await fetch("/api/chat", { method: "GET" });
  if (!response.ok) {
    throw new Error("Unable to load conversations.");
  }
  const data = (await response.json()) as { conversations?: ChatConversation[] };
  return data.conversations ?? [];
}

export async function renameConversation(id: string, title: string) {
  const response = await fetch("/api/chat", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId: id, title }),
  });
  if (!response.ok) {
    throw new Error("Unable to rename conversation.");
  }
  return (await response.json()) as { conversation?: ChatConversation };
}

export async function toggleConversationPin(id: string, pinned: boolean) {
  const response = await fetch("/api/chat", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId: id, pinned }),
  });
  if (!response.ok) {
    throw new Error("Unable to update conversation.");
  }
  return (await response.json()) as { conversation?: ChatConversation };
}

export async function deleteConversation(id: string) {
  const response = await fetch(`/api/chat?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Unable to delete conversation.");
  }
}
