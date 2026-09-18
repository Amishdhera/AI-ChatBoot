import { useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

const MAX_CHARS = 4000;

export default function ChatInput({ value, onChange, onSend, isGenerating, onStop }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    onSend(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-surface-border bg-surface px-4 lg:px-0 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl border border-surface-border bg-surface-panel focus-within:border-accent/60 transition-colors shadow-soft">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message Nova… (Shift + Enter for a new line)"
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-9 text-sm text-ink placeholder:text-ink-faint outline-none max-h-[200px]"
          />

          <div className="absolute left-4 bottom-2.5 text-[11px] text-ink-faint">
            {value.length}/{MAX_CHARS}
          </div>

          <div className="absolute right-2.5 bottom-2.5">
            {isGenerating ? (
              <button
                onClick={onStop}
                className="flex items-center gap-1.5 rounded-lg bg-surface-raised border border-surface-border px-3 py-1.5 text-xs font-medium text-ink hover:border-red-400/50 hover:text-red-400 transition-colors"
              >
                <Square size={12} className="fill-current" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!value.trim()}
                className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-[11px] text-ink-faint mt-2">
          Nova can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
