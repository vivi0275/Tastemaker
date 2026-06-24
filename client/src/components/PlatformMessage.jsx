export default function PlatformMessage({ platform, result }) {
  if (!result) return null;

  const isError = result.status === 'error' || result.status === 'not_found';
  const hasTracks = result.tracks?.length > 0;

  if (hasTracks && !result.message) return null;

  const color =
    platform === 'SoundCloud' ? 'text-[var(--color-soundcloud)]' : 'text-[var(--color-spotify)]';

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        isError
          ? 'border-white/10 bg-white/5 text-[var(--color-muted)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-muted)]'
      }`}
    >
      <span className={`font-medium ${color}`}>{platform}: </span>
      {result.message || `No results found on ${platform}.`}
    </div>
  );
}
