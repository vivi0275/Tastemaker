import { Router } from 'express';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { getSoundCloudPreviewStream } from '../services/soundcloud.js';

const router = Router();

router.get('/', async (req, res) => {
  const trackId = req.query.trackId?.trim();

  if (!trackId) {
    return res.status(400).json({ error: 'trackId is required.' });
  }

  try {
    const { response, track, maxDuration } = await getSoundCloudPreviewStream(trackId);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('X-Preview-Max-Duration', String(maxDuration));
    res.setHeader('X-Attribution-Uploader', track.user?.username ?? 'Unknown');
    res.setHeader('X-Attribution-Source', 'SoundCloud');

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body);
      await pipeline(nodeStream, res);
      return;
    }

    res.status(502).json({ error: 'Preview stream unavailable.' });
  } catch (err) {
    res.status(err.message.includes('not available') ? 403 : 500).json({
      error: err.message || 'Preview failed.',
    });
  }
});

export default router;
