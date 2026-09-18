import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function TextField({
  label,
  type = "text",
  error,
  isPassword = false,
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-muted">{label}</span>
      <div className="relative">
        <input
          type={inputType}
          className={`w-full rounded-xl border bg-surface-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors
            ${error ? "border-red-500/70" : "border-surface-border focus:border-accent"}
            ${isPassword ? "pr-11" : ""} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
