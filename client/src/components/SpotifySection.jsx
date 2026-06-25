import CollapsibleSection from './CollapsibleSection';
import TrackCard from './TrackCard';
import SpotifyPlaylistCard from './SpotifyPlaylistCard';

export default function SpotifySection({
  playlistTracks,
  playlists,
  artistName,
  message,
  startIndex = 0,
  onOutboundClick,
  onPreviewPlay,
}) {
  const hasTracks = playlistTracks?.length > 0;
  const hasPlaylists = playlists?.length > 0;

  if (!hasTracks && !hasPlaylists) return null;

  const badge = [
    hasTracks && `${playlistTracks.length} tracks`,
    hasPlaylists && `${playlists.length} playlists`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <CollapsibleSection
      title="Spotify playlists"
      subtitle={`Public playlists linked to ${artistName}. Not their private liked songs.`}
      badge={badge}
      defaultOpen={false}
    >
      {message && (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs text-amber-200/80">
          {message}
        </p>
      )}

      {hasTracks && (
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            From playlists · {playlistTracks.length} {playlistTracks.length === 1 ? 'track' : 'tracks'}
          </p>
          <div className="dig-card-grid">
            {playlistTracks.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                index={startIndex + i}
                onOutboundClick={onOutboundClick}
                onPreviewPlay={onPreviewPlay}
                showSpotifyDisclaimer
              />
            ))}
          </div>
        </section>
      )}

      {hasPlaylists && (
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            {hasTracks ? 'More playlists' : 'Browse playlists'} · {playlists.length}
          </p>
          <p className="text-xs text-[var(--color-muted)]/80">
            Spotify limits third party apps from listing playlist tracks. Use the embedded player to dig
            in, or open on Spotify.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            {playlists.map((playlist, i) => (
              <SpotifyPlaylistCard
                key={playlist.id}
                playlist={playlist}
                index={startIndex + (playlistTracks?.length ?? 0) + i}
                onOutboundClick={onOutboundClick}
              />
            ))}
          </div>
        </section>
      )}
    </CollapsibleSection>
  );
}
