import { Fragment } from "react";

function renderInline(value: string) {
  const parts = value.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-violet-200">{part.slice(1, -1)}</code>;
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const safeHref = href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:") || href.startsWith("/");
      return safeHref ? <a key={index} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="text-violet-300 underline decoration-violet-400/40 underline-offset-4 hover:text-violet-200">{label}</a> : <Fragment key={index}>{part}</Fragment>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

function highlightCode(code: string, language?: string) {
  const tokenPattern = /(\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:const|let|var|function|return|if|else|for|while|async|await|import|from|export|class|def|print|true|false|null|None)\b|\b\d+(?:\.\d+)?\b)/gm;
  const tokens = code.split(tokenPattern);

  return tokens.map((token, index) => {
    const className = token.startsWith("//") || token.startsWith("#")
      ? "text-zinc-500"
      : token.startsWith("\"") || token.startsWith("'")
        ? "text-emerald-300"
        : /^(const|let|var|function|return|if|else|for|while|async|await|import|from|export|class|def|print|true|false|null|None)$/.test(token)
          ? "text-fuchsia-300"
          : /^\d/.test(token)
            ? "text-amber-300"
            : "text-zinc-200";
    return <span key={`${language ?? "plain"}-${index}`} className={className}>{token}</span>;
  });
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const blocks = content.split(/(```[\s\S]*?```)/g).filter(Boolean);

  return (
    <div className="space-y-4 break-words text-[0.9375rem] leading-7 text-zinc-200">
      {blocks.map((block, blockIndex) => {
        const codeMatch = block.match(/^```(\w+)?\n?([\s\S]*?)```$/);
        if (codeMatch) {
          const [, language, code] = codeMatch;
          return <pre key={blockIndex} className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6"><code>{highlightCode(code.trim(), language)}</code></pre>;
        }

        return block.split(/\n\n+/).filter(Boolean).map((paragraph, paragraphIndex) => {
          const isHeading = paragraph.startsWith("### ") || paragraph.startsWith("## ") || paragraph.startsWith("# ");
          const isList = paragraph.split("\n").every((line) => /^[-*] /.test(line));

          if (isHeading) {
            return <h3 key={`${blockIndex}-${paragraphIndex}`} className="text-lg font-semibold text-white">{renderInline(paragraph.replace(/^#{1,3} /, ""))}</h3>;
          }

          if (isList) {
            return <ul key={`${blockIndex}-${paragraphIndex}`} className="space-y-1 pl-5 marker:text-violet-400">{paragraph.split("\n").map((line, index) => <li key={index}>{renderInline(line.replace(/^[-*] /, ""))}</li>)}</ul>;
          }

          return <p key={`${blockIndex}-${paragraphIndex}`} className="whitespace-pre-wrap">{renderInline(paragraph)}</p>;
        });
      })}
    </div>
  );
}
