export default function DigSummary({
  artist,
  likedCount = 0,
  repostedCount = 0,
  discoveryCount = 0,
}) {
  if (!artist) return null;

  const hasCrate = likedCount + repostedCount > 0;

  return (
    <section className="panel-hero animate-fade-up px-4 py-5 sm:px-6">
      <p className="label-mono text-[var(--color-accent)]">Dig crate</p>
      <h2 className="display-title mt-1 text-3xl text-white sm:text-4xl">{artist}</h2>

      {hasCrate ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
          Public SoundCloud taste. Preview tracks, then dig artists they reposted.
        </p>
      ) : (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
          No public likes or reposts yet. Check discovery reposts below or try another profile.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {likedCount > 0 && (
          <span className="stat-pill stat-pill-accent">
            {likedCount} {likedCount === 1 ? 'like' : 'likes'}
          </span>
        )}
        {repostedCount > 0 && (
          <span className="stat-pill">{repostedCount} {repostedCount === 1 ? 'repost' : 'reposts'}</span>
        )}
        {discoveryCount > 0 && (
          <span className="stat-pill stat-pill-discovery">
            {discoveryCount} {discoveryCount === 1 ? 'artist' : 'artists'} to explore
          </span>
        )}
      </div>
    </section>
  );
}
