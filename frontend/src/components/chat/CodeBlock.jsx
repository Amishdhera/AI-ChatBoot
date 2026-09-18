import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");
  const language = /language-(\w+)/.exec(className || "")?.[1] || "text";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group/code">
      <div className="flex items-center justify-between px-4 pt-3 pb-1 text-xs text-ink-faint">
        <span className="font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-ink-faint hover:text-ink transition-colors opacity-0 group-hover/code:opacity-100"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="!mt-0 !pt-0">
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
}
