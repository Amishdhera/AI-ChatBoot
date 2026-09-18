import { Menu, Circle, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function TopNavbar({ title, isGenerating, onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 shrink-0 border-b border-surface-border bg-surface/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-ink-muted hover:text-ink"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-sm font-semibold text-ink truncate max-w-[50vw]">
          {title || "New chat"}
        </h1>
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-ink-faint">
          <Circle
            size={7}
            className={isGenerating ? "fill-amber-400 text-amber-400" : "fill-emerald-400 text-emerald-400"}
          />
          {isGenerating ? "Responding…" : "Online"}
        </span>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-ink-muted hover:bg-surface-raised hover:text-ink transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
