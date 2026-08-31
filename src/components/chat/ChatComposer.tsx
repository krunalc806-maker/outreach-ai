"use client";

import { KeyboardEvent, RefObject, useState } from "react";
import { ImagePlus, Paperclip, Send, Square, X } from "lucide-react";

import type { ChatAttachment, ChatModel, ChatStatus } from "@/types/chat";

interface ChatComposerProps {
  models: ChatModel[];
  status: ChatStatus;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onSend: (content: string, attachments: ChatAttachment[], model: string) => void;
  onStop: () => void;
}

export default function ChatComposer({ models, status, inputRef, onSend, onStop }: ChatComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [model, setModel] = useState(models[0]?.id ?? "default");
  const isBusy = status === "loading" || status === "streaming";

  function submit() {
    const trimmedContent = content.trim();
    if (!trimmedContent || isBusy) return;
    onSend(trimmedContent, attachments, model);
    setContent("");
    setAttachments([]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-white/10 bg-[#08090d] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl sm:px-6">
      <div className="mx-auto max-w-3xl">
        {attachments.length ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {attachments.map((attachment) => (
              <span key={attachment.id} className="inline-flex max-w-full items-center gap-1.5 rounded-xl border border-white/10 bg-[#11141c] px-2.5 py-1 text-xs text-zinc-300">
                <span className="truncate">{attachment.name}</span>
                <button type="button" onClick={() => setAttachments((items) => items.filter((item) => item.id !== attachment.id))} aria-label={`Remove ${attachment.name}`} className="text-zinc-500 hover:text-white">
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-2 shadow-xl transition focus-within:border-[#8b5cf6]/60 focus-within:ring-1 focus-within:ring-[#8b5cf6]/20">
          <textarea ref={inputRef} value={content} onChange={(event) => setContent(event.target.value)} onKeyDown={handleKeyDown} rows={2} placeholder="Message OutreachAI..." aria-label="Chat message" className="max-h-44 min-h-12 w-full resize-none bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white outline-none placeholder:text-zinc-500" />
          <div className="flex items-center justify-between gap-2 px-1 pb-1">
            <div className="flex items-center gap-1">
              <button type="button" disabled title="Document context becomes available after document processing is configured." aria-label="Document attachments unavailable" className="rounded-lg p-1.5 text-zinc-600 disabled:cursor-not-allowed"><Paperclip size={16} /></button>
              <button type="button" disabled title="Vision processing is not configured for chat yet." aria-label="Image analysis unavailable" className="rounded-lg p-1.5 text-zinc-600 disabled:cursor-not-allowed"><ImagePlus size={16} /></button>
              <label className="sr-only" htmlFor="chat-model">Model</label>
              <select id="chat-model" value={model} onChange={(event) => setModel(event.target.value)} className="max-w-32 rounded-lg bg-transparent px-2 py-1 text-xs font-semibold text-zinc-300 outline-none hover:bg-white/5">
                {models.map((item) => <option key={item.id} value={item.id} className="bg-zinc-900 text-white">{item.label}</option>)}
              </select>
            </div>
            {isBusy ? (
              <button type="button" onClick={onStop} className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-zinc-700 px-3 text-xs font-semibold text-white transition hover:bg-zinc-600">
                <Square size={12} fill="currentColor" />Stop
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={!content.trim()} aria-label="Send message" className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40">
                <Send size={15} />
              </button>
            )}
          </div>
        </div>
        <p className="px-2 pt-1.5 text-center text-[10px] text-zinc-500">Enter to send · Shift + Enter for a new line</p>
      </div>
    </div>
  );
}
