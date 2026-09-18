export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-surface">
      <div className="flex items-center gap-3 text-ink-muted">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
        </span>
        <span className="font-display text-sm tracking-wide">Loading Nova…</span>
      </div>
    </div>
  );
}
