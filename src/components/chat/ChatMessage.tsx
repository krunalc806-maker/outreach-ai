"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw, UserRound, Bot } from "lucide-react";

import MarkdownRenderer from "./MarkdownRenderer";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  onRegenerate?: (messageId: string) => void;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }).format(new Date(value));
}

export default function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className={`group mx-auto flex w-full max-w-3xl gap-2.5 px-4 py-4 sm:px-6 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div aria-hidden="true" className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d4ff32] text-black font-bold">
          <Bot size={15} />
        </div>
      )}
      <div className={`min-w-0 max-w-[min(100%,40rem)] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${isUser ? "bg-[#18181f] text-white border border-white/10 shadow-lg" : "border border-white/10 bg-[#0d0d12]"}`}>
        {isUser ? <p className="whitespace-pre-wrap leading-6">{message.content}</p> : <MarkdownRenderer content={message.content} />}
        {message.attachments?.length ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.attachments.map((attachment) => (
              <span key={attachment.id} className="rounded-lg border border-white/10 bg-black/30 px-2 py-0.5 text-xs text-inherit">
                {attachment.name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-500 font-mono">
          <span>{formatTimestamp(message.createdAt)}</span>
          {message.usage?.totalTokens ? <span>{message.usage.totalTokens} tokens</span> : null}
        </div>
        <div className={`mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100 ${isUser ? "justify-end" : "justify-start"}`}>
          <button type="button" onClick={copyMessage} aria-label="Copy message" className="rounded-lg p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white">
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          {!isUser && onRegenerate ? (
            <button type="button" onClick={() => onRegenerate(message.id)} aria-label="Regenerate response" className="rounded-lg p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white">
              <RefreshCw size={13} />
            </button>
          ) : null}
        </div>
      </div>
      {isUser && (
        <div aria-hidden="true" className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
          <UserRound size={14} />
        </div>
      )}
    </article>
  );
}
