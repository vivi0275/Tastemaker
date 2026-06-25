import { Router } from 'express';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { streamTrackArtwork } from '../services/soundcloud.js';

const router = Router();

router.get('/', async (req, res) => {
  const trackId = req.query.trackId?.trim();
  const trackUrl = req.query.url?.trim() || null;

  if (!trackId && !trackUrl) {
    return res.status(400).json({ error: 'trackId or url is required.' });
  }

  try {
    const stream = await streamTrackArtwork(trackId, trackUrl);
    if (!stream) {
      return res.status(404).json({ error: 'No artwork for this track.' });
    }

    res.setHeader('Content-Type', stream.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    if (stream.response.body) {
      const nodeStream = Readable.fromWeb(stream.response.body);
      await pipeline(nodeStream, res);
      return;
    }

    return res.status(502).json({ error: 'Artwork stream unavailable.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Artwork lookup failed.' });
  }
});

export default router;
