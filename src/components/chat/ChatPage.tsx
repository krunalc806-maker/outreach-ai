"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageSquare, Sparkles } from "lucide-react";

import ChatComposer from "./ChatComposer";
import ChatEmptyState from "./ChatEmptyState";
import ChatMessageBubble from "./ChatMessage";
import ChatSidebar from "./ChatSidebar";
import ChatSkeleton from "./ChatSkeleton";
import AiThinkingIndicator from "./AiThinkingIndicator";
import { deleteConversation as deleteConversationRequest, fetchConversations, renameConversation as renameConversationRequest, streamChatMessage, toggleConversationPin as togglePinRequest } from "@/lib/chat/client";
import type { ChatAttachment, ChatConversation, ChatMessage as ChatMessageType, ChatModel, ChatStatus } from "@/types/chat";

const models: ChatModel[] = [
  { id: "default", label: "NVIDIA NIM", description: "Meta Llama 3.1 8B Instruct" },
  { id: "fast", label: "Gemini 1.5", description: "Google Gemini 1.5 Flash" },
  { id: "reasoning", label: "OpenRouter", description: "Llama 3.3 70B Instruct" },
];

function createId() {
  return crypto.randomUUID();
}

function createConversation(): ChatConversation {
  const now = new Date().toISOString();
  return { id: createId(), title: "New conversation", createdAt: now, updatedAt: now, pinned: false, messages: [] };
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeConversation = useMemo(() => conversations.find((conversation) => conversation.id === activeConversationId) ?? null, [activeConversationId, conversations]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: status === "streaming" ? "auto" : "smooth" });
  }, [activeConversation?.messages.length, status]);

  useEffect(() => {
    let isCancelled = false;

    async function loadConversations() {
      try {
        const nextConversations = await fetchConversations();
        if (!isCancelled) {
          setConversations(nextConversations);
          if (!activeConversationId && nextConversations[0]) {
            setActiveConversationId(nextConversations[0].id);
          }
          setIsHydrated(true);
        }
      } catch {
        if (!isCancelled) {
          setError("Unable to load previous conversations.");
          setIsHydrated(true);
        }
      }
    }

    void loadConversations();

    return () => {
      isCancelled = true;
    };
  }, [activeConversationId]);

  function handleCreateConversation() {
    const conversation = createConversation();
    setConversations((items) => [conversation, ...items]);
    setActiveConversationId(conversation.id);
    setError(null);
    setSidebarOpen(false);
    window.setTimeout(() => composerRef.current?.focus(), 0);
  }

  async function handleSend(content: string, attachments: ChatAttachment[], model: string) {
    const targetConversation = activeConversation ?? createConversation();
    const optimisticUserMessage: ChatMessageType = { id: createId(), role: "user", content, attachments, createdAt: new Date().toISOString(), status: "complete" };
    const assistantMessage: ChatMessageType = { id: createId(), role: "assistant", content: "", createdAt: new Date().toISOString(), status: "streaming" };
    const optimisticConversation: ChatConversation = {
      ...targetConversation,
      title: targetConversation.messages.length === 0 ? content.slice(0, 52) || "New conversation" : targetConversation.title,
      updatedAt: new Date().toISOString(),
      messages: [...targetConversation.messages, optimisticUserMessage, assistantMessage],
    };

    setConversations((items) => activeConversation ? items.map((item) => item.id === optimisticConversation.id ? optimisticConversation : item) : [optimisticConversation, ...items]);
    setActiveConversationId(optimisticConversation.id);
    setStatus("streaming");
    setError(null);

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      await streamChatMessage({
        content,
        attachments,
        conversationId: optimisticConversation.id,
        model,
        signal: abortController.signal,
        onEvent: ({ event, payload }) => {
          if (event === "assistant_delta" && payload && typeof payload === "object") {
            const nextPayload = payload as { messageId?: string; delta?: string };
            if (!nextPayload.messageId || !nextPayload.delta) return;
            setConversations((items) => items.map((item) => item.id === optimisticConversation.id ? {
              ...item,
              messages: item.messages.map((message) => message.id === nextPayload.messageId ? { ...message, content: `${message.content}${nextPayload.delta ?? ""}` } : message),
            } : item));
          }

          if (event === "assistant_complete" && payload && typeof payload === "object") {
            const nextPayload = payload as { conversation?: ChatConversation; usage?: unknown };
            if (nextPayload.conversation) {
              setConversations((items) => items.map((item) => item.id === optimisticConversation.id ? nextPayload.conversation! : item));
              setStatus("idle");
            }
          }

          if (event === "conversation_ready" && payload && typeof payload === "object") {
            const nextPayload = payload as { conversationId?: string; title?: string };
            setConversations((items) => items.map((item) => item.id === optimisticConversation.id ? { ...item, id: nextPayload.conversationId ?? item.id, title: nextPayload.title ?? item.title } : item));
            setActiveConversationId(nextPayload.conversationId ?? optimisticConversation.id);
          }

          if (event === "error" && payload && typeof payload === "object") {
            const nextPayload = payload as { message?: string };
            setStatus("error");
            setError(nextPayload.message ?? "The chat request failed.");
          }
        },
      });
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      const message = requestError instanceof Error ? requestError.message : "The chat request failed.";
      setStatus("error");
      setError(message);
    } finally { abortControllerRef.current = null; }
  }

  function handleStop() {
    abortControllerRef.current?.abort();
    setStatus("idle");
  }

  const sidebar = <ChatSidebar conversations={conversations} activeConversationId={activeConversationId} onClose={() => setSidebarOpen(false)} onCreate={handleCreateConversation} onSelect={(id) => { setActiveConversationId(id); setSidebarOpen(false); setError(null); }} onRename={async (id, title) => { try { const response = await renameConversationRequest(id, title); if (response.conversation) setConversations((items) => items.map((item) => item.id === id ? response.conversation! : item)); } catch { setError("Unable to rename conversation."); } }} onDelete={async (id) => { try { await deleteConversationRequest(id); setConversations((items) => items.filter((item) => item.id !== id)); if (activeConversationId === id) setActiveConversationId(null); } catch { setError("Unable to delete the conversation."); } }} onTogglePin={async (id) => { const target = conversations.find((item) => item.id === id); if (!target) return; try { const response = await togglePinRequest(id, !target.pinned); if (response.conversation) setConversations((items) => items.map((item) => item.id === id ? response.conversation! : item)); } catch { setError("Unable to update the conversation."); } }} />;

  return (
    <div className="relative -m-5 flex h-[calc(100dvh-4.5rem)] overflow-hidden sm:-m-6 lg:-m-8">
      <div className="hidden w-64 shrink-0 lg:block">{sidebar}</div>
      <AnimatePresence>{sidebarOpen ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 bg-black/60 lg:hidden"><motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", stiffness: 320, damping: 30 }} className="h-full w-[min(18rem,88vw)]">{sidebar}</motion.div><button type="button" aria-label="Close chat sidebar" onClick={() => setSidebarOpen(false)} className="absolute inset-y-0 right-0 w-[12vw]" /></motion.div> : null}</AnimatePresence>
      <section className="relative flex min-w-0 flex-1 flex-col bg-[#08090d]">
        <header className="flex min-h-14 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open chat sidebar" className="rounded-xl p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"><Menu size={18} /></button>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#a78bfa]"><MessageSquare size={16} /></div>
            <div><h1 className="font-bold text-xs sm:text-sm text-white">AI Multi-Provider Console</h1><p className="text-[10px] text-zinc-500 font-mono">NVIDIA NIM • Gemini • OpenRouter</p></div>
          </div>
          <button type="button" onClick={handleCreateConversation} className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/15 hover:text-white sm:inline-flex active:scale-95"><Sparkles size={13} className="text-[#a78bfa]" />New session</button>
        </header>
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {!isHydrated ? <ChatSkeleton /> : activeConversation?.messages.length ? (
            <>
              {activeConversation.messages.map((message) => <ChatMessageBubble key={message.id} message={message} onRegenerate={() => setError("Connect a provider adapter to regenerate responses.")} />)}
              {status === "streaming" ? (
                <AiThinkingIndicator />
              ) : null}
            </>
          ) : <ChatEmptyState onFocusComposer={() => composerRef.current?.focus()} />}
        </div>
        {error ? <div role="alert" className="mx-auto mb-2 w-[calc(100%-1.5rem)] max-w-3xl rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs text-amber-100 sm:w-[calc(100%-3rem)]"><span>{error}</span><button type="button" onClick={() => { setError(null); setStatus("idle"); }} className="ml-3 font-medium text-amber-200 underline underline-offset-4">Dismiss</button></div> : null}
        <ChatComposer models={models} status={status} inputRef={composerRef} onSend={handleSend} onStop={handleStop} />
      </section>
    </div>
  );
}
