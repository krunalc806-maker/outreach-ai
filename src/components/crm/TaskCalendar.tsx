"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock3, Plus, Trash2, X } from "lucide-react";
import { getCrmSnapshot } from "@/lib/crm/data";
import type { Task } from "@/lib/crm/types";

export default function TaskCalendar() {
  const initialSnapshot = getCrmSnapshot();
  const [tasks, setTasks] = useState<Task[]>(initialSnapshot.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("Agent Autopilot");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
  const [dueDate, setDueDate] = useState("Tomorrow");

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "Done" ? "In Progress" : "Done" } : t
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      leadId: "lead-1",
      assignee: assignee.trim(),
      dueDate,
      priority,
      status: "In Progress",
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);
    setTitle("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Task & SLA Pipeline</p>
          <h2 className="mt-1 text-xl font-bold text-white">Assign, track, and schedule work</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95"
          >
            <Plus size={13} /> Add Task
          </button>
          <div className="rounded-2xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-2 text-[#a78bfa]">
            <CalendarDays size={18} />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleToggleTask(task.id)}
            className="cursor-pointer rounded-2xl border border-white/10 bg-[#11141c] p-4 transition hover:border-[#8b5cf6]/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {task.status === "Done" ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <Clock3 size={16} className="text-amber-400" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-semibold text-xs sm:text-sm text-white ${
                      task.status === "Done" ? "line-through text-zinc-500" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Assigned to <span className="text-zinc-200">{task.assignee}</span> • Due{" "}
                    <span className="text-[#a78bfa]">{task.dueDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase font-mono ${
                    task.status === "Done"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {task.status}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  className="rounded-lg p-1 text-zinc-500 hover:text-rose-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="rounded-full border border-white/10 bg-[#08090d] px-2.5 py-0.5 text-[10px] font-mono">
                Priority: {task.priority}
              </span>
              <span className="rounded-full border border-white/10 bg-[#08090d] px-2.5 py-0.5 text-[10px] font-mono">
                Assignee: {task.assignee}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0d1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Create Operational Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="mt-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Task Description *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Audit Delhivery Indiranagar NDR scan logs"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Assignee</label>
                  <input
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="e.g. Agent Autopilot"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Due Timeline</label>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Today / 24 Hours"
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
