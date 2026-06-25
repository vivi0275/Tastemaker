const PREFIX = 'tm_search_v2_';
const TTL_MS = 60 * 60 * 1000;

function cacheKey(artist, soundcloudUserId, spotifyArtistId) {
  return `${PREFIX}${artist.toLowerCase()}::${soundcloudUserId ?? ''}::${spotifyArtistId ?? ''}`;
}

function isStalePayload(data) {
  const tracks = data?.soundcloud?.tracks ?? [];
  if (!tracks.length) return false;
  return tracks.some((t) => t.source === 'SoundCloud' && t.soundcloudTrackId && !t.artworkUrl);
}

export function getCachedSearch(artist, soundcloudUserId, spotifyArtistId) {
  try {
    const raw = sessionStorage.getItem(cacheKey(artist, soundcloudUserId, spotifyArtistId));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL_MS || isStalePayload(data)) {
      sessionStorage.removeItem(cacheKey(artist, soundcloudUserId, spotifyArtistId));
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCachedSearch(artist, soundcloudUserId, spotifyArtistId, data) {
  try {
    sessionStorage.setItem(
      cacheKey(artist, soundcloudUserId, spotifyArtistId),
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    // quota exceeded — ignore
  }
}
