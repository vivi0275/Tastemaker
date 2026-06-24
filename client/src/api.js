const API_BASE = '/api';

export async function searchArtist(artist, options = {}) {
  const params = new URLSearchParams({ artist });
  if (options.soundcloudUserId) params.set('soundcloudUserId', options.soundcloudUserId);
  if (options.spotifyArtistId) params.set('spotifyArtistId', options.spotifyArtistId);

  const response = await fetch(`${API_BASE}/search?${params}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Search failed. Please try again.');
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) return null;
  return response.json();
}
