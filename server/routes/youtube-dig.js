import { Router } from 'express';
import { digYouTubeMix } from '../services/youtube.js';

const router = Router();

router.get('/', async (req, res) => {
  const videoId = req.query.videoId?.trim();

  if (!videoId) {
    return res.status(400).json({ error: 'videoId is required.' });
  }

  const result = await digYouTubeMix(videoId);
  res.json(result);
});

export default router;
