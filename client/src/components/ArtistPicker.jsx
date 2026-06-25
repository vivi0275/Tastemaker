export default function ArtistPicker({ platform, artists, onSelect, onDismiss, onSkip }) {
  const isSoundCloud = platform === 'soundcloud';

  return (
    <div className="animate-fade-up panel p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="section-title text-base text-white">
            {isSoundCloud ? 'Pick the right SoundCloud profile' : 'Spotify profile (optional)'}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {isSoundCloud
              ? 'Multiple users match. Select the DJ or producer you mean.'
              : 'Bonus context only. Skip if this artist has no Spotify or you only need SoundCloud.'}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 text-sm text-[var(--color-muted)] hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {artists.map((artist) => (
          <li key={artist.id}>
            <button
              onClick={() => onSelect(artist.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:border-white/15 hover:bg-white/5"
            >
              {(artist.avatarUrl || artist.imageUrl) && (
                <img
                  src={artist.avatarUrl || artist.imageUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{artist.name}</p>
                <p className="truncate text-xs text-[var(--color-muted)]">
                  {isSoundCloud
                    ? `@${artist.username}${artist.followers != null ? ` · ${artist.followers.toLocaleString()} followers` : ''}`
                    : artist.subtitle || (artist.genres?.length ? artist.genres.join(', ') : 'Spotify artist profile')}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {!isSoundCloud && onSkip && (
        <button type="button" onClick={onSkip} className="btn-ghost mt-4 w-full py-2.5">
          Skip Spotify. SoundCloud only
        </button>
      )}
    </div>
  );
}
