"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, MessageSquareQuote, Paperclip, Plus, Trash2, X } from "lucide-react";
import { getCrmSnapshot } from "@/lib/crm/data";
import type { Note } from "@/lib/crm/types";

export default function NotesTimeline() {
  const initialSnapshot = getCrmSnapshot();
  const [notes, setNotes] = useState<Note[]>(initialSnapshot.notes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mentions, setMentions] = useState("@IndiranagarHub, @Legal");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      leadId: "lead-1",
      mentions: mentions.split(",").map((m) => m.trim()).filter(Boolean),
      attachments: ["docket_reference.pdf"],
      createdAt: "Just now",
    };

    setNotes((prev) => [newNote, ...prev]);
    setIsModalOpen(false);
    setTitle("");
    setBody("");
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Notes & Audit Trail</p>
          <h2 className="mt-1 text-xl font-bold text-white">Dispute notes, mentions, and evidence annotations</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95"
          >
            <Plus size={13} /> Add Note
          </button>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-300">
            <FileText size={18} />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="rounded-2xl border border-white/10 bg-[#11141c] p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-white text-xs sm:text-sm">{note.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500">{note.createdAt}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-zinc-500 hover:text-rose-400 p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{note.body}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-zinc-400 font-mono">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#08090d] px-2.5 py-0.5 text-zinc-300">
                <MessageSquareQuote size={11} className="text-[#a78bfa]" /> Mentions: {note.mentions.join(", ")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#08090d] px-2.5 py-0.5 text-zinc-300">
                <Paperclip size={11} className="text-emerald-400" /> Attachments: {note.attachments.join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NOTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0d1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Add Dispute Note / Annotation</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="mt-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Note Title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spoke with Indiranagar Delhivery Hub Supervisor"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Note Content *</label>
                <textarea
                  required
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="e.g. Confirmed false NDR re-attempt was triggered without phone call. Awaiting re-schedule..."
                  className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-2.5 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Mentions / Tags</label>
                <input
                  value={mentions}
                  onChange={(e) => setMentions(e.target.value)}
                  placeholder="@IndiranagarHub, @NodalDesk"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#8b5cf6] px-4 py-2 font-extrabold text-white shadow hover:bg-[#7c3aed] active:scale-95"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
