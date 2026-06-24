const API_BASE = 'https://api.soundcloud.com';
const TOKEN_URL = 'https://secure.soundcloud.com/oauth/token';

let tokenCache = { token: null, refreshToken: null, expiresAt: 0 };

function getCredentials() {
  return {
    clientId: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
  };
}

function notConfigured() {
  return {
    status: 'error',
    tracks: [],
    artists: [],
    message:
      'SoundCloud API not configured. Add SOUNDCLOUD_CLIENT_ID and SOUNDCLOUD_CLIENT_SECRET to your environment variables.',
  };
}

function storeToken(data) {
  tokenCache = {
    token: data.access_token,
    refreshToken: data.refresh_token ?? tokenCache.refreshToken,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return data.access_token;
}

async function requestToken(body, clientId, clientSecret) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body,
  });

  if (response.status === 429) {
    throw new Error('SoundCloud authentication rate limit reached. Please try again in a few minutes.');
  }

  if (!response.ok) {
    throw new Error('SoundCloud authentication failed. Check your client ID and secret.');
  }

  return response.json();
}

async function getAccessToken() {
  const { clientId, clientSecret } = getCredentials();
  if (!clientId || !clientSecret) return null;

  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  if (tokenCache.refreshToken) {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokenCache.refreshToken,
      });
      const data = await requestToken(params.toString(), clientId, clientSecret);
      return storeToken(data);
    } catch {
      tokenCache.refreshToken = null;
    }
  }

  const data = await requestToken('grant_type=client_credentials', clientId, clientSecret);
  return storeToken(data);
}

async function scFetch(path, params = {}, attempt = 0) {
  const token = await getAccessToken();
  if (!token) throw new Error('SoundCloud authentication unavailable.');

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('linked_partitioning', 'true');
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `OAuth ${token}`,
    },
  });

  if (response.status === 429 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    return scFetch(path, params, attempt + 1);
  }

  if (response.status === 429) {
    throw new Error('SoundCloud rate limit reached. Please try again in a moment.');
  }

  if (response.status === 401 && attempt === 0) {
    tokenCache.token = null;
    tokenCache.expiresAt = 0;
    return scFetch(path, params, attempt + 1);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`SoundCloud API error (${response.status})${text ? `: ${text.slice(0, 120)}` : ''}`);
  }

  return response.json();
}

function extractCollection(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.collection)) return data.collection;
  return [];
}

async function fetchAllPages(path, params = {}, maxItems = 50) {
  const items = [];
  let nextPath = path;
  let nextParams = { ...params, limit: Math.min(params.limit ?? 50, 50) };

  while (items.length < maxItems) {
    const data = await scFetch(nextPath, nextParams);
    const batch = extractCollection(data);
    items.push(...batch);

    const nextHref = data?.next_href;
    if (!nextHref || batch.length === 0) break;

    const nextUrl = new URL(nextHref);
    nextPath = nextUrl.pathname;
    nextParams = Object.fromEntries(nextUrl.searchParams);
    delete nextParams.linked_partitioning;
  }

  return items.slice(0, maxItems);
}

function normalizeLikeTrack(item) {
  const track = item.track ?? item;
  if (!track || track.title == null) return null;

  const uploader = track.user?.username ?? track.user?.full_name ?? 'Unknown uploader';

  return {
    id: `sc-${track.id}`,
    title: track.title,
    artist: uploader,
    source: 'SoundCloud',
    url: track.permalink_url ?? track.uri?.replace('soundcloud:tracks:', 'https://soundcloud.com/tracks/'),
    meta: 'Liked on SoundCloud',
    attribution: uploader,
  };
}

function normalizeRepostTrack(item) {
  const track = item.track ?? item;
  if (!track || track.title == null) return null;

  const uploader = track.user?.username ?? track.user?.full_name ?? 'Unknown uploader';

  return {
    id: `sc-repost-${track.id}`,
    title: track.title,
    artist: uploader,
    source: 'SoundCloud',
    url: track.permalink_url ?? track.uri?.replace('soundcloud:tracks:', 'https://soundcloud.com/tracks/'),
    meta: 'Reposted on SoundCloud',
    attribution: uploader,
  };
}

async function searchUsers(artistName) {
  try {
    const data = await scFetch('/users', { q: artistName, limit: 3 });
    return extractCollection(data);
  } catch {
    const data = await scFetch('/search/users', { q: artistName, limit: 3 });
    return extractCollection(data);
  }
}

export async function searchSoundCloud(artistName, userId = null) {
  const { clientId, clientSecret } = getCredentials();
  if (!clientId || !clientSecret) return notConfigured();

  try {
    let selectedUser;

    if (userId) {
      selectedUser = await scFetch(`/users/${userId}`);
    } else {
      const users = await searchUsers(artistName);

      if (!users || users.length === 0) {
        return {
          status: 'not_found',
          tracks: [],
          artists: [],
          message: `No SoundCloud user found for "${artistName}".`,
        };
      }

      if (users.length > 1) {
        return {
          status: 'ambiguous',
          tracks: [],
          artists: users.map((u) => ({
            id: u.id,
            name: u.full_name || u.username,
            username: u.username,
            avatarUrl: u.avatar_url,
            trackCount: u.track_count,
            followers: u.followers_count,
          })),
          message: `Multiple SoundCloud users match "${artistName}". Pick the right profile.`,
        };
      }

      selectedUser = users[0];
    }

    const likes = await fetchAllPages(`/users/${selectedUser.id}/likes/tracks`, { limit: 50 }).catch(() => []);

    let repostTracks = [];
    try {
      const reposts = await fetchAllPages(`/users/${selectedUser.id}/reposts/tracks`, { limit: 50 });
      repostTracks = reposts.map(normalizeRepostTrack).filter(Boolean);
    } catch {
      // Reposts endpoint may not be available for all apps yet
    }

    const likeTracks = likes.map(normalizeLikeTrack).filter(Boolean);

    const seen = new Set();
    const tracks = [...likeTracks, ...repostTracks].filter((t) => {
      if (!t.url || seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });

    const displayName = selectedUser.full_name || selectedUser.username;

    if (tracks.length === 0) {
      return {
        status: 'success',
        tracks: [],
        artists: [],
        artistName: displayName,
        message: `No public likes or reposts found for ${displayName} on SoundCloud.`,
      };
    }

    return {
      status: 'success',
      tracks,
      artists: [],
      artistName: displayName,
      message: null,
    };
  } catch (err) {
    return {
      status: 'error',
      tracks: [],
      artists: [],
      message: err.message || 'Failed to fetch SoundCloud data.',
    };
  }
}
