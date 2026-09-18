export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2" aria-label="AI is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-ink-faint animate-pulseDot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
