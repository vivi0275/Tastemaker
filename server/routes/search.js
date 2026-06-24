import { Router } from 'express';
import { searchSoundCloud } from '../services/soundcloud.js';
import { searchSpotify } from '../services/spotify.js';

const router = Router();

router.get('/', async (req, res) => {
  const artist = req.query.artist?.trim();
  const soundcloudUserId = req.query.soundcloudUserId || null;
  const spotifyArtistId = req.query.spotifyArtistId || null;

  if (!artist) {
    return res.status(400).json({ error: 'Artist name is required.' });
  }

  const [soundcloud, spotify] = await Promise.all([
    searchSoundCloud(artist, soundcloudUserId),
    searchSpotify(artist, spotifyArtistId),
  ]);

  res.json({
    query: artist,
    soundcloud,
    spotify,
  });
});

export default router;
