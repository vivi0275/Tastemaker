export default function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-white/60 animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-[var(--color-muted)]">Fetching likes, reposts &amp; playlists…</p>
    </div>
  );
}
