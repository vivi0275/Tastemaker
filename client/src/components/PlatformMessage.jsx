export default function PlatformMessage({ platform, result }) {
  if (!result) return null;

  // Spotify info messages render inside SpotifySection when playlists are shown
  if (platform === 'Spotify' && result.playlists?.length > 0 && result.message) return null;

  const isError = result.status === 'error' || result.status === 'not_found';
  const hasResults = result.tracks?.length > 0 || result.playlists?.length > 0 || result.mixes?.length > 0;
  const isInfo = hasResults && result.message;

  if (hasResults && !result.message) return null;
  if (!hasResults && !result.message && !isError) return null;

  const color =
    platform === 'SoundCloud'
      ? 'text-[var(--color-accent)]'
      : platform === 'YouTube'
        ? 'text-[var(--color-youtube)]'
        : 'text-[var(--color-spotify)]';

  return (
    <div
      className={`panel px-4 py-3 text-sm ${
        isError ? 'text-[var(--color-muted)]' : isInfo ? 'text-[var(--color-muted)]' : ''
      }`}
    >
      <span className={`label-mono ${color}`}>{platform}</span>
      <span className="mt-1 block text-sm">{result.message || `No results found on ${platform}.`}</span>
    </div>
  );
}
