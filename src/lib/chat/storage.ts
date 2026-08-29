import { promises as fs } from "node:fs";
import path from "node:path";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { ChatConversation, ChatMessage } from "@/types/chat";

const storagePath = path.join(process.cwd(), ".chat-data.json");

interface ChatStoreSnapshot {
  conversations: ChatConversation[];
}

function sortConversations(conversations: ChatConversation[]) {
  return [...conversations].sort((left, right) => Number(right.pinned) - Number(left.pinned) || new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function readSnapshot(): Promise<ChatStoreSnapshot> {
  try {
    const raw = await fs.readFile(storagePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<ChatStoreSnapshot>;
    return {
      conversations: Array.isArray(parsed.conversations) ? (parsed.conversations as ChatConversation[]) : [],
    };
  } catch {
    return { conversations: [] };
  }
}

async function writeSnapshot(snapshot: ChatStoreSnapshot) {
  await fs.writeFile(storagePath, JSON.stringify(snapshot, null, 2), "utf8");
}

async function listConversationsFromSupabase() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
  }

  const { data, error } = await supabase
    .from("chat_conversations")
    .select("id,title,created_at,updated_at,pinned")
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  const conversationIds = (data ?? []).map((item) => item.id as string);
  const { data: messagesData, error: messagesError } = await supabase
    .from("chat_messages")
    .select("conversation_id,role,content,created_at,attachments,status,usage")
    .in("conversation_id", conversationIds);

  if (messagesError) {
    throw messagesError;
  }

  const messagesByConversation = new Map<string, ChatMessage[]>();
  for (const message of messagesData ?? []) {
    const conversationId = message.conversation_id as string;
    const existing = messagesByConversation.get(conversationId) ?? [];
    existing.push({
      id: `${conversationId}-${existing.length}`,
      role: message.role as ChatMessage["role"],
      content: message.content as string,
      createdAt: message.created_at as string,
      attachments: Array.isArray(message.attachments) ? (message.attachments as ChatMessage["attachments"]) : [],
      status: (message.status as ChatMessage["status"]) ?? "complete",
      usage: message.usage as ChatMessage["usage"],
    });
    messagesByConversation.set(conversationId, existing);
  }

  return sortConversations(
    (data ?? []).map((item) => ({
      id: item.id as string,
      title: item.title as string,
      createdAt: item.created_at as string,
      updatedAt: item.updated_at as string,
      pinned: Boolean(item.pinned),
      messages: messagesByConversation.get(item.id as string) ?? [],
    }))
  );
}

export async function listConversations() {
  try {
    return await listConversationsFromSupabase();
  } catch {
    const snapshot = await readSnapshot();
    return sortConversations(snapshot.conversations);
  }
}

export async function getConversationById(id: string) {
  const conversations = await listConversations();
  return conversations.find((conversation) => conversation.id === id) ?? null;
}

export async function saveConversation(conversation: ChatConversation) {
  const supabase = getSupabaseServiceClient();
  if (supabase) {
    const { error: conversationError } = await supabase.from("chat_conversations").upsert(
      {
        id: conversation.id,
        title: conversation.title,
        created_at: conversation.createdAt,
        updated_at: conversation.updatedAt,
        pinned: conversation.pinned,
      },
      { onConflict: "id" }
    );

    if (conversationError) {
      throw conversationError;
    }

    await supabase.from("chat_messages").delete().eq("conversation_id", conversation.id);
    const { error: messageError } = await supabase.from("chat_messages").insert(
      conversation.messages.map((message) => ({
        id: message.id,
        conversation_id: conversation.id,
        role: message.role,
        content: message.content,
        created_at: message.createdAt,
        attachments: message.attachments ?? [],
        status: message.status ?? "complete",
        usage: message.usage ?? null,
      }))
    );

    if (messageError) {
      throw messageError;
    }
    return conversation;
  }

  const snapshot = await readSnapshot();
  const nextConversations = sortConversations([
    conversation,
    ...snapshot.conversations.filter((item) => item.id !== conversation.id),
  ]);
  await writeSnapshot({ conversations: nextConversations });
  return conversation;
}

export async function deleteConversation(id: string) {
  const supabase = getSupabaseServiceClient();
  if (supabase) {
    await supabase.from("chat_conversations").delete().eq("id", id);
    await supabase.from("chat_messages").delete().eq("conversation_id", id);
    return;
  }

  const snapshot = await readSnapshot();
  const nextConversations = snapshot.conversations.filter((item) => item.id !== id);
  await writeSnapshot({ conversations: nextConversations });
}

export async function searchConversations(query: string) {
  const conversations = await listConversations();
  const term = query.trim().toLowerCase();
  if (!term) return conversations;
  return conversations.filter((conversation) => conversation.title.toLowerCase().includes(term) || conversation.messages.some((message) => message.content.toLowerCase().includes(term)));
}
