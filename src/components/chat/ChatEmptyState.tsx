import { MessageSquarePlus, Sparkles } from "lucide-react";

export default function ChatEmptyState({ onFocusComposer }: { onFocusComposer: () => void }) {
  return (
    <div className="flex min-h-[22rem] flex-1 items-center justify-center px-5 py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-500/10"><Sparkles size={25} /></div>
        <h2 className="mt-6 text-2xl font-semibold text-white">Start a new conversation</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Ask a question, add context with an attachment, and choose the model you want to use when a provider is connected.</p>
        <button type="button" onClick={onFocusComposer} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-violet-400/40 hover:bg-violet-500/10"><MessageSquarePlus size={17} />Write a message</button>
      </div>
    </div>
  );
}
