import { NextRequest } from "next/server";
import { z } from "zod";

import { isRateLimited } from "@/lib/chat/rate-limit";
import { streamAiCompletion } from "@/lib/chat/provider";
import { deleteConversation, getConversationById, listConversations, saveConversation, searchConversations } from "@/lib/chat/storage";
import type { ChatAttachment, ChatConversation, ChatMessage } from "@/types/chat";

const messageSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  attachments: z.array(z.object({ id: z.string().optional(), name: z.string().trim().max(200), type: z.string().trim().max(200), size: z.number().max(10_000_000), kind: z.enum(["file", "image"]).optional() })).max(10).optional(),
  conversationId: z.string().trim().min(1).optional(),
  model: z.string().trim().max(64).optional(),
  regenerate: z.boolean().optional(),
});

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildConversationTitle(content: string) {
  const title = content.replace(/\s+/g, " ").trim();
  return title.length > 60 ? `${title.slice(0, 57)}…` : title || "New conversation";
}

function createConversation(content: string): ChatConversation {
  const now = new Date().toISOString();
  return {
    id: createId(),
    title: buildConversationTitle(content),
    createdAt: now,
    updatedAt: now,
    pinned: false,
    messages: [],
  };
}

function createMessage(role: ChatMessage["role"], content: string, attachments: ChatAttachment[] = []): ChatMessage {
  return {
    id: createId(),
    role,
    content,
    createdAt: new Date().toISOString(),
    attachments,
    status: role === "assistant" ? "streaming" : "complete",
  };
}

function toSseEvent(eventName: string, payload: unknown) {
  return `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
}

async function handleSend(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(payload);
  if (!parsed.success) {
    return new Response(
      toSseEvent("error", { message: "Invalid request payload." }),
      { headers: { "Content-Type": "text/event-stream; charset=utf-8" } }
    );
  }

  const { content, attachments = [], conversationId, regenerate = false, model } = parsed.data;
  const forwardedFor = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(forwardedFor)) {
    return new Response(
      toSseEvent("error", { message: "Too many requests. Please wait a moment and try again." }),
      { headers: { "Content-Type": "text/event-stream; charset=utf-8" } }
    );
  }

  const requestAbort = new AbortController();
  req.signal.addEventListener("abort", () => requestAbort.abort(), { once: true });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const sendEvent = (eventName: string, payload: unknown) => {
        controller.enqueue(encoder.encode(toSseEvent(eventName, payload)));
      };

      try {
        const existingConversation = conversationId ? await getConversationById(conversationId) : null;
        const conversation = existingConversation ?? createConversation(content);
        const normalizedConversationId = conversation.id;
        const trimmedContent = content.trim();
        const baseMessages = regenerate && conversation.messages.length ? conversation.messages.filter((message, index, items) => !(message.role === "assistant" && index === items.length - 1)) : conversation.messages;
        const userMessage = createMessage("user", trimmedContent, attachments as ChatAttachment[]);
        const assistantMessage = createMessage("assistant", "");
        const pendingMessages = [...baseMessages, userMessage, assistantMessage];
        const updatedConversation: ChatConversation = {
          ...conversation,
          title: conversation.messages.length === 0 ? buildConversationTitle(trimmedContent) : conversation.title,
          updatedAt: new Date().toISOString(),
          messages: pendingMessages,
        };

        await saveConversation({ ...updatedConversation, id: normalizedConversationId });
        sendEvent("conversation_ready", { conversationId: normalizedConversationId, title: updatedConversation.title });

        let assistantContent = "";
        let usage: { promptTokens?: number; completionTokens?: number; totalTokens?: number } | undefined;
        try {
          const providerChoice: "nvidia" | "openrouter" | "gemini" =
            model === "fast" ? "gemini" : model === "reasoning" ? "openrouter" : "nvidia";

          for await (const chunk of streamAiCompletion({
            prompt: trimmedContent,
            attachments: attachments.map((attachment) => ({ name: attachment.name, kind: attachment.kind ?? "file" })),
            model,
            provider: providerChoice,
            signal: requestAbort.signal,
          })) {
            if (requestAbort.signal.aborted) {
              throw new Error("Stream cancelled");
            }
            if (chunk.type === "delta" && chunk.delta) {
              assistantContent += chunk.delta;
              sendEvent("assistant_delta", { messageId: assistantMessage.id, delta: chunk.delta });
            }
            if (chunk.type === "done" && chunk.usage) {
              usage = chunk.usage;
            }
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "The AI response could not be completed.";
          const failureConversation: ChatConversation = {
            ...updatedConversation,
            updatedAt: new Date().toISOString(),
            messages: updatedConversation.messages.map((message) => message.id === assistantMessage.id ? { ...message, content: assistantContent || "", status: "error" } : message),
          };
          await saveConversation({ ...failureConversation, id: normalizedConversationId });
          sendEvent("error", { message, conversationId: normalizedConversationId });
          controller.close();
          return;
        }

        const finalConversation: ChatConversation = {
          ...updatedConversation,
          title: conversation.messages.length === 0 ? buildConversationTitle(trimmedContent) : conversation.title,
          updatedAt: new Date().toISOString(),
          messages: updatedConversation.messages.map((message) => message.id === assistantMessage.id ? { ...message, content: assistantContent, status: "complete", usage } : message),
        };
        await saveConversation({ ...finalConversation, id: normalizedConversationId });
        sendEvent("assistant_complete", { conversation: finalConversation, usage });
        controller.close();
      } catch (error) {
        const message = error instanceof Error ? error.message : "The AI request could not be completed.";
        sendEvent("error", { message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

async function handleList(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search")?.trim();
  const conversations = search ? await searchConversations(search) : await listConversations();
  return Response.json({ conversations });
}

async function handleDelete(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return Response.json({ error: "Conversation id is required." }, { status: 400 });
  }
  await deleteConversation(id);
  return Response.json({ success: true });
}

async function handlePatch(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  const id = payload?.conversationId?.trim();
  const title = typeof payload?.title === "string" ? payload.title.trim() : null;
  const pinned = typeof payload?.pinned === "boolean" ? payload.pinned : null;
  if (!id) {
    return Response.json({ error: "Conversation id is required." }, { status: 400 });
  }
  const conversation = await getConversationById(id);
  if (!conversation) {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }
  const updated = {
    ...conversation,
    title: title ?? conversation.title,
    pinned: pinned ?? conversation.pinned,
    updatedAt: new Date().toISOString(),
  };
  await saveConversation(updated);
  return Response.json({ conversation: updated });
}

export async function GET(req: NextRequest) {
  return handleList(req);
}

export async function POST(req: NextRequest) {
  return handleSend(req);
}

export async function PATCH(req: NextRequest) {
  return handlePatch(req);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req);
}
