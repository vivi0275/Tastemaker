import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'tm_session_crate';

function loadCrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCrateTrackId(track) {
  if (track.crateId) return track.crateId;
  const id = track.soundcloudTrackId ?? track.spotifyId ?? track.url;
  return `${track.source ?? 'unknown'}:${id}`;
}

export function useSessionCrate() {
  const [tracks, setTracks] = useState(loadCrate);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  }, [tracks]);

  const isSaved = useCallback(
    (track) => tracks.some((t) => getCrateTrackId(t) === getCrateTrackId(track)),
    [tracks]
  );

  const saveTrack = useCallback((track, context = {}) => {
    const entry = {
      crateId: getCrateTrackId(track),
      title: track.title ?? track.parsedTitle,
      artist: track.artist ?? track.parsedArtist ?? track.attribution,
      url: track.url,
      source: track.source ?? 'SoundCloud',
      signal: track.signal ?? context.signal ?? 'saved',
      soundcloudTrackId: track.soundcloudTrackId ?? null,
      previewable: track.previewable ?? false,
      previewMaxDuration: track.previewMaxDuration ?? 60,
      attribution: track.attribution ?? track.artist,
      savedAt: new Date().toISOString(),
      contextArtist: context.contextArtist ?? null,
      viaArtist: context.viaArtist ?? null,
    };

    setTracks((prev) => {
      if (prev.some((t) => t.crateId === entry.crateId)) return prev;
      return [entry, ...prev];
    });

    return entry;
  }, []);

  const removeTrack = useCallback((crateId) => {
    setTracks((prev) => prev.filter((t) => t.crateId !== crateId));
  }, []);

  const clearCrate = useCallback(() => {
    setTracks([]);
  }, []);

  const exportUrls = useCallback(() => {
    return tracks.map((t) => t.url).filter(Boolean).join('\n');
  }, [tracks]);

  return {
    tracks,
    count: tracks.length,
    isSaved,
    saveTrack,
    removeTrack,
    clearCrate,
    exportUrls,
  };
}
