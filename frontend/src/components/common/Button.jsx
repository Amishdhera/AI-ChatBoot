import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-ink-muted hover:bg-surface-raised hover:text-ink",
  danger:
    "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30",
  outline:
    "bg-transparent border border-surface-border text-ink hover:bg-surface-raised",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
