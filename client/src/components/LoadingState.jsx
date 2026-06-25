export default function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-5 py-16">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-sm bg-[var(--color-accent)] animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="label-mono text-[var(--color-muted)]">Pulling dig crate…</p>
    </div>
  );
}
