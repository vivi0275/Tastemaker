export default function SpotifyPlaylistCard({ playlist, index, onOutboundClick }) {
  const embedUrl = playlist.spotifyPlaylistId
    ? `https://open.spotify.com/embed/playlist/${playlist.spotifyPlaylistId}?utm_source=generator&theme=0`
    : null;

  const handleOutboundClick = () => {
    onOutboundClick?.({
      platform: 'Spotify',
      signal: 'playlist',
      destination: playlist.url,
    });
  };

  return (
    <article
      className="animate-fade-up overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-colors hover:border-white/10"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className="border-b border-[var(--color-border)] p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-medium leading-snug text-white">{playlist.title}</h3>
          <span className="shrink-0 rounded-full border border-[var(--color-spotify)]/25 bg-[var(--color-spotify)]/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--color-spotify)]">
            Playlist
          </span>
        </div>
        <p className="text-sm text-[var(--color-muted)]">{playlist.artist}</p>
        {playlist.meta && (
          <p className="mt-1 text-xs text-[var(--color-muted)]/70">{playlist.meta}</p>
        )}
      </div>

      {embedUrl && (
        <div className="bg-black/20">
          <iframe
            title={`Spotify playlist: ${playlist.title}`}
            src={embedUrl}
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-0"
          />
        </div>
      )}

      <div className="p-4">
        <a
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOutboundClick}
          className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-spotify)]/30 px-4 py-2.5 text-sm font-medium text-[var(--color-spotify)] transition-colors hover:bg-[var(--color-spotify)]/10"
        >
          Open playlist on Spotify
        </a>
      </div>
    </article>
  );
}
