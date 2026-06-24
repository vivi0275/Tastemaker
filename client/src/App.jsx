import { useCallback, useEffect, useState } from 'react';
import { searchArtist, checkHealth } from './api';
import SearchBar from './components/SearchBar';
import TrackCard from './components/TrackCard';
import LoadingState from './components/LoadingState';
import PlatformMessage from './components/PlatformMessage';
import ArtistPicker from './components/ArtistPicker';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [selection, setSelection] = useState({ soundcloudUserId: null, spotifyArtistId: null });

  useEffect(() => {
    checkHealth().then(setApiStatus).catch(() => null);
  }, []);

  const runSearch = useCallback(
    async (artist, overrides = {}) => {
      setLoading(true);
      setError(null);

      const opts = {
        soundcloudUserId: overrides.soundcloudUserId ?? selection.soundcloudUserId,
        spotifyArtistId: overrides.spotifyArtistId ?? selection.spotifyArtistId,
      };

      try {
        const data = await searchArtist(artist, opts);
        setResults(data);

        if (data.soundcloud.status !== 'ambiguous') {
          setSelection((s) => ({ ...s, soundcloudUserId: opts.soundcloudUserId }));
        }
        if (data.spotify.status !== 'ambiguous') {
          setSelection((s) => ({ ...s, spotifyArtistId: opts.spotifyArtistId }));
        }
      } catch (err) {
        setError(err.message);
        setResults(null);
      } finally {
        setLoading(false);
      }
    },
    [selection.soundcloudUserId, selection.spotifyArtistId]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSelection({ soundcloudUserId: null, spotifyArtistId: null });
    runSearch(trimmed, { soundcloudUserId: null, spotifyArtistId: null });
  };

  const handleSoundCloudPick = (userId) => {
    setSelection((s) => ({ ...s, soundcloudUserId: userId }));
    runSearch(results.query, { soundcloudUserId: userId });
  };

  const handleSpotifyPick = (artistId) => {
    setSelection((s) => ({ ...s, spotifyArtistId: artistId }));
    runSearch(results.query, { spotifyArtistId: artistId });
  };

  const allTracks = results
    ? [...(results.soundcloud.tracks ?? []), ...(results.spotify.tracks ?? [])]
    : [];

  const hasAmbiguous =
    results?.soundcloud?.status === 'ambiguous' || results?.spotify?.status === 'ambiguous';

  const showResults = results && !loading;

  return (
    <div className="relative min-h-screen">
      <div className="grain" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(255,85,0,0.06),transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(29,185,84,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <header className={`text-center transition-all ${showResults ? 'mb-10' : 'mb-16'}`}>
          <h1
            className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-white sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tastemaker
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
            Discover what artists publicly like and curate — aggregated from SoundCloud and Spotify.
          </p>

          {apiStatus && (!apiStatus.soundcloud || !apiStatus.spotify) && (
            <p className="mx-auto mt-4 max-w-lg rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs text-amber-200/80">
              {!apiStatus.soundcloud && !apiStatus.spotify
                ? 'API keys not configured yet — add them to your environment variables.'
                : !apiStatus.soundcloud
                  ? 'SoundCloud credentials missing — add SOUNDCLOUD_CLIENT_ID and SOUNDCLOUD_CLIENT_SECRET.'
                  : 'Spotify API credentials missing — Spotify results will be unavailable.'}
            </p>
          )}
        </header>

        <div className={`flex justify-center ${showResults ? 'mb-10' : 'mb-8'}`}>
          <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} loading={loading} />
        </div>

        {loading && <LoadingState />}

        {error && (
          <div className="mx-auto max-w-xl rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {showResults && (
          <div className="space-y-8">
            {hasAmbiguous && (
              <div className="grid gap-4 md:grid-cols-2">
                {results.soundcloud.status === 'ambiguous' && (
                  <ArtistPicker
                    platform="soundcloud"
                    artists={results.soundcloud.artists}
                    onSelect={handleSoundCloudPick}
                  />
                )}
                {results.spotify.status === 'ambiguous' && (
                  <ArtistPicker
                    platform="spotify"
                    artists={results.spotify.artists}
                    onSelect={handleSpotifyPick}
                  />
                )}
              </div>
            )}

            {!hasAmbiguous && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PlatformMessage platform="SoundCloud" result={results.soundcloud} />
                  <PlatformMessage platform="Spotify" result={results.spotify} />
                </div>

                {(results.soundcloud.artistName || results.spotify.artistName) && (
                  <p className="text-center text-sm text-[var(--color-muted)]">
                    Showing curated music for{' '}
                    <span className="text-white">
                      {results.soundcloud.artistName || results.spotify.artistName}
                    </span>
                  </p>
                )}

                {allTracks.length > 0 ? (
                  <>
                    <p className="text-center text-xs uppercase tracking-widest text-[var(--color-muted)]">
                      {allTracks.length} track{allTracks.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {allTracks.map((track, i) => (
                        <TrackCard key={track.id} track={track} index={i} />
                      ))}
                    </div>
                  </>
                ) : (
                  !results.soundcloud.message &&
                  !results.spotify.message && (
                    <p className="py-12 text-center text-[var(--color-muted)]">
                      No curated tracks found for this artist on either platform.
                    </p>
                  )
                )}
              </>
            )}
          </div>
        )}

        {!showResults && !loading && (
          <p className="text-center text-xs text-[var(--color-muted)]/60">
            No audio playback · Links open on the original platform
          </p>
        )}
      </div>
    </div>
  );
}
