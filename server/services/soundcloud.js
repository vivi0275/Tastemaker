const BASE_URL = 'https://api.soundcloud.com';

function getClientId() {
  return process.env.SOUNDCLOUD_CLIENT_ID;
}

function notConfigured() {
  return {
    status: 'error',
    tracks: [],
    artists: [],
    message: 'SoundCloud API not configured. Add SOUNDCLOUD_CLIENT_ID to your .env file.',
  };
}

async function scFetch(path, params = {}) {
  const clientId = getClientId();
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('client_id', clientId);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString());

  if (response.status === 429) {
    throw new Error('SoundCloud rate limit reached. Please try again in a moment.');
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`SoundCloud API error (${response.status})${text ? `: ${text.slice(0, 120)}` : ''}`);
  }

  return response.json();
}

function normalizeTrack(item, type) {
  const track = item.track ?? item;
  if (!track || track.kind !== 'track' || track.title == null) return null;

  const uploader = track.user?.username ?? track.user?.full_name ?? 'Unknown uploader';

  return {
    id: `sc-${track.id}`,
    title: track.title,
    artist: uploader,
    source: 'SoundCloud',
    url: track.permalink_url,
    meta: type === 'repost' ? 'Reposted on SoundCloud' : 'Liked on SoundCloud',
    attribution: uploader,
  };
}

export async function searchSoundCloud(artistName, userId = null) {
  if (!getClientId()) return notConfigured();

  try {
    let selectedUser;

    if (userId) {
      selectedUser = await scFetch(`/users/${userId}`);
    } else {
      const users = await scFetch('/users', { q: artistName, limit: 3 });

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

    const [likes, reposts] = await Promise.all([
      scFetch(`/users/${selectedUser.id}/likes`, { limit: 50 }).catch(() => []),
      scFetch(`/users/${selectedUser.id}/reposts`, { limit: 50 }).catch(() => []),
    ]);

    const likeTracks = (Array.isArray(likes) ? likes : [])
      .map((item) => normalizeTrack(item, 'like'))
      .filter(Boolean);

    const repostTracks = (Array.isArray(reposts) ? reposts : [])
      .map((item) => normalizeTrack(item, 'repost'))
      .filter(Boolean);

    const seen = new Set();
    const tracks = [...likeTracks, ...repostTracks].filter((t) => {
      if (seen.has(t.id)) return false;
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
