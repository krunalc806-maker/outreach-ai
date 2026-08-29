"use client";

import { FormEvent, useMemo, useState } from "react";
import { Pencil, Pin, Plus, Search, Trash2, X } from "lucide-react";

import type { ChatConversation } from "@/types/chat";

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onClose?: () => void;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

function groupForDate(value: string) {
  const date = new Date(value);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const daysAgo = Math.floor((startOfToday - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) / 86_400_000);
  if (daysAgo <= 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo <= 7) return "Last 7 Days";
  return "Last 30 Days";
}

export default function ChatSidebar({ conversations, activeConversationId, onClose, onCreate, onSelect, onRename, onDelete, onTogglePin }: ChatSidebarProps) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const filteredConversations = useMemo(() => conversations.filter((conversation) => conversation.title.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()), [conversations, query]);
  const groups = useMemo(() => ["Today", "Yesterday", "Last 7 Days", "Last 30 Days"].map((label) => [label, filteredConversations.filter((conversation) => groupForDate(conversation.updatedAt) === label)] as const).filter(([, items]) => items.length), [filteredConversations]);

  function saveRename(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    if (draftTitle.trim()) onRename(id, draftTitle.trim());
    setEditingId(null);
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#08090d] p-3">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCreate} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#8b5cf6] px-3 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95">
          <Plus size={15} />New chat
        </button>
        {onClose ? <button type="button" onClick={onClose} aria-label="Close chat sidebar" className="rounded-xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"><X size={16} /></button> : null}
      </div>
      <label className="relative mt-2.5 block">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sessions" aria-label="Search chats" className="h-9 w-full rounded-xl border border-white/10 bg-[#11141c] pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-[#8b5cf6]" />
      </label>
      <div className="mt-3.5 min-h-0 flex-1 overflow-y-auto pr-1">
        {groups.length ? groups.map(([label, items]) => (
          <section key={label} className="mb-4">
            <h2 className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">{label}</h2>
            <div className="mt-1.5 space-y-1">
              {items.map((conversation) => (
                <div key={conversation.id} className={`group flex items-center gap-1 rounded-xl transition ${activeConversationId === conversation.id ? "bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-white" : "hover:bg-white/[0.04] text-zinc-400"}`}>
                  {editingId === conversation.id ? (
                    <form onSubmit={(event) => saveRename(event, conversation.id)} className="flex flex-1 p-1">
                      <input autoFocus value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} onBlur={() => setEditingId(null)} className="h-7 w-full rounded-lg bg-zinc-900 px-2 text-xs text-white outline-none border border-[#8b5cf6]" />
                    </form>
                  ) : (
                    <button type="button" onClick={() => onSelect(conversation.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left text-xs">
                      <span className="truncate font-medium">{conversation.title}</span>
                      {conversation.pinned ? <Pin size={11} className="shrink-0 text-[#a78bfa]" /> : null}
                    </button>
                  )}
                  <div className="hidden pr-1 group-hover:flex group-focus-within:flex">
                    <button type="button" onClick={() => { setEditingId(conversation.id); setDraftTitle(conversation.title); }} aria-label={`Rename ${conversation.title}`} className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"><Pencil size={12} /></button>
                    <button type="button" onClick={() => onTogglePin(conversation.id)} aria-label={`${conversation.pinned ? "Unpin" : "Pin"} ${conversation.title}`} className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"><Pin size={12} /></button>
                    <button type="button" onClick={() => onDelete(conversation.id)} aria-label={`Delete ${conversation.title}`} className="rounded-lg p-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )) : <p className="px-2 py-6 text-center text-xs text-zinc-500">No sessions found.</p>}
      </div>
    </aside>
  );
}
