const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

let tokenCache = { token: null, expiresAt: 0 };

function getCredentials() {
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  };
}

function notConfigured() {
  return {
    status: 'error',
    tracks: [],
    artists: [],
    message: 'Spotify API not configured. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your .env file.',
  };
}

async function getAccessToken() {
  const { clientId, clientSecret } = getCredentials();
  if (!clientId || !clientSecret) return null;

  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (response.status === 429) {
    throw new Error('Spotify rate limit reached. Please try again in a moment.');
  }

  if (!response.ok) {
    throw new Error('Spotify authentication failed. Check your credentials.');
  }

  const data = await response.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

async function spotifyFetch(path, params = {}) {
  const token = await getAccessToken();
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 429) {
    throw new Error('Spotify rate limit reached. Please try again in a moment.');
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let message = `Spotify API error (${response.status})`;
    try {
      const parsed = JSON.parse(text);
      if (parsed.error?.message) message = parsed.error.message;
    } catch {
      if (text) message += `: ${text.slice(0, 120)}`;
    }
    throw new Error(message);
  }

  return response.json();
}

async function getAllPlaylistTracks(playlistId) {
  const tracks = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const data = await spotifyFetch(`/playlists/${playlistId}/tracks`, { limit, offset });
    const items = data.items ?? [];

    for (const item of items) {
      const track = item.track;
      if (!track || track.type !== 'track' || track.is_local) continue;
      tracks.push(track);
    }

    if (items.length < limit) break;
    offset += limit;
    if (offset >= 500) break;
  }

  return tracks;
}

function normalizeTrack(track, playlistName) {
  const artists = track.artists?.map((a) => a.name).join(', ') || 'Unknown artist';

  return {
    id: `sp-${track.id}-${playlistName}`,
    title: track.name,
    artist: artists,
    source: 'Spotify',
    url: track.external_urls?.spotify,
    meta: `From playlist: ${playlistName}`,
    attribution: artists,
  };
}

function namesMatch(a, b) {
  const left = a.toLowerCase().trim();
  const right = b.toLowerCase().trim();
  return left === right || left.includes(right) || right.includes(left);
}

async function findArtistPlaylists(artistName) {
  const seen = new Set();
  const playlists = [];

  const queries = [artistName, `${artistName} official`, `artist:${artistName}`];

  for (const query of queries) {
    const searchResult = await spotifyFetch('/search', {
      q: query,
      type: 'playlist',
      limit: 10,
    });

    for (const playlist of searchResult.playlists?.items ?? []) {
      if (!playlist?.id || seen.has(playlist.id)) continue;

      const ownerName = playlist.owner?.display_name ?? '';
      const ownerMatches = namesMatch(ownerName, artistName);
      const playlistMatches = namesMatch(playlist.name ?? '', artistName);

      if (ownerMatches || playlistMatches) {
        seen.add(playlist.id);
        playlists.push(playlist);
      }
    }

    if (playlists.length >= 5) break;
  }

  return playlists;
}

export async function searchSpotify(artistName, artistId = null) {
  const { clientId, clientSecret } = getCredentials();
  if (!clientId || !clientSecret) return notConfigured();

  try {
    let selectedArtist;

    if (artistId) {
      selectedArtist = await spotifyFetch(`/artists/${artistId}`);
    } else {
      const searchResult = await spotifyFetch('/search', {
        q: artistName,
        type: 'artist',
        limit: 5,
      });

      const artists = searchResult.artists?.items ?? [];

      if (artists.length === 0) {
        return {
          status: 'not_found',
          tracks: [],
          artists: [],
          message: `No Spotify artist found for "${artistName}".`,
        };
      }

      if (artists.length > 1) {
        return {
          status: 'ambiguous',
          tracks: [],
          artists: artists.map((a) => ({
            id: a.id,
            name: a.name,
            followers: a.followers?.total ?? 0,
            genres: a.genres?.slice(0, 3) ?? [],
            imageUrl: a.images?.[0]?.url,
          })),
          message: `Multiple Spotify artists match "${artistName}". Pick the right profile.`,
        };
      }

      selectedArtist = artists[0];
    }

    const publicPlaylists = await findArtistPlaylists(selectedArtist.name);

    if (publicPlaylists.length === 0) {
      return {
        status: 'success',
        tracks: [],
        artists: [],
        artistName: selectedArtist.name,
        message: `No public playlists found for ${selectedArtist.name} on Spotify. Liked songs are private — only public playlists are accessible.`,
      };
    }

    const playlistResults = await Promise.all(
      publicPlaylists.slice(0, 10).map(async (playlist) => {
        try {
          const tracks = await getAllPlaylistTracks(playlist.id);
          return tracks.map((t) => normalizeTrack(t, playlist.name));
        } catch {
          return [];
        }
      })
    );

    const seen = new Set();
    const tracks = playlistResults.flat().filter((t) => {
      if (!t.url || seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });

    if (tracks.length === 0) {
      return {
        status: 'success',
        tracks: [],
        artists: [],
        artistName: selectedArtist.name,
        message: `Public playlists for ${selectedArtist.name} contain no tracks.`,
      };
    }

    return {
      status: 'success',
      tracks,
      artists: [],
      artistName: selectedArtist.name,
      message: null,
    };
  } catch (err) {
    return {
      status: 'error',
      tracks: [],
      artists: [],
      message: err.message || 'Failed to fetch Spotify data.',
    };
  }
}
