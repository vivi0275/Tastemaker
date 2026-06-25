import MixTracklist from './MixTracklist';

export default function MixCard({
  mix,
  index,
  digLoading,
  digError,
  digData,
  artistName,
  onDig,
  onOutboundClick,
  onPreviewPlay,
}) {
  const embedUrl = `https://www.youtube.com/embed/${mix.videoId}?rel=0`;

  const handleOutboundClick = () => {
    onOutboundClick?.({
      platform: 'YouTube',
      signal: 'mix',
      destination: mix.url,
    });
  };

  return (
    <article
      className="animate-fade-up track-card overflow-hidden"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className="border-b border-[var(--color-border-subtle)] p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium leading-snug text-white">{mix.title}</h3>
          <span className="badge-mono border-[var(--color-youtube)]/30 bg-[var(--color-youtube)]/10 text-[var(--color-youtube)]">
            YouTube
          </span>
        </div>
        <p className="text-xs text-[var(--color-muted)]">{mix.channelTitle}</p>
      </div>

      <div className="aspect-video bg-black/30">
        <iframe
          title={`YouTube: ${mix.title}`}
          src={embedUrl}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>

      <div className="space-y-3 p-4">
        {!digData && (
          <button
            type="button"
            onClick={onDig}
            disabled={digLoading}
            className="btn-accent w-full py-2.5 disabled:opacity-50"
          >
            {digLoading ? 'Digging tracklist…' : 'Dig tracklist → SoundCloud'}
          </button>
        )}

        {digError && (
          <p className="text-center text-sm text-red-300">{digError}</p>
        )}

        {digData && (
          <MixTracklist
            digData={digData}
            artistName={artistName}
            onOutboundClick={onOutboundClick}
            onPreviewPlay={onPreviewPlay}
          />
        )}

        <a
          href={mix.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOutboundClick}
          className="btn-ghost mt-2 w-full py-2 text-[var(--color-youtube)]"
        >
          Open on YouTube
        </a>
      </div>
    </article>
  );
}
