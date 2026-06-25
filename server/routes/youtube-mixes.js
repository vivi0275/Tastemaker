import { Router } from 'express';
import { searchYouTubeMixes } from '../services/youtube.js';

const router = Router();

router.get('/', async (req, res) => {
  const artist = req.query.artist?.trim();

  if (!artist) {
    return res.status(400).json({ error: 'Artist name is required.' });
  }

  const result = await searchYouTubeMixes(artist);
  res.json(result);
});

export default router;
