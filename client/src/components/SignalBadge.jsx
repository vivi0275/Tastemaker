const SIGNAL_STYLES = {
  liked: { label: 'Liked', className: 'badge-accent' },
  reposted: {
    label: 'Repost',
    className: 'border-[var(--color-discovery)]/30 bg-[var(--color-discovery)]/10 text-[var(--color-discovery)]',
  },
  catalog: {
    label: 'Catalog',
    className: 'border-[var(--color-spotify)]/30 bg-[var(--color-spotify)]/10 text-[var(--color-spotify)]',
  },
  release: {
    label: 'Release',
    className: 'border-[var(--color-spotify)]/30 bg-[var(--color-spotify)]/10 text-[var(--color-spotify)]',
  },
  popular: {
    label: 'Popular',
    className: 'border-[var(--color-spotify)]/30 bg-[var(--color-spotify)]/10 text-[var(--color-spotify)]',
  },
  playlist: {
    label: 'Playlist',
    className: 'border-[var(--color-spotify)]/30 bg-[var(--color-spotify)]/10 text-[var(--color-spotify)]',
  },
  playlist_track: {
    label: 'Playlist',
    className: 'border-[var(--color-spotify)]/30 bg-[var(--color-spotify)]/10 text-[var(--color-spotify)]',
  },
  similar: {
    label: 'Similar',
    className: 'border-[var(--color-lastfm)]/30 bg-[var(--color-lastfm)]/10 text-[var(--color-lastfm)]',
  },
  from_mix: {
    label: 'From mix',
    className: 'border-[var(--color-youtube)]/30 bg-[var(--color-youtube)]/10 text-[var(--color-youtube)]',
  },
};

export default function SignalBadge({ signal }) {
  const style = SIGNAL_STYLES[signal];
  if (!style) return null;

  return <span className={`badge-mono ${style.className}`}>{style.label}</span>;
}
