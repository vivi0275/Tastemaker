import { searchYouTubeMixes } from '../../server/services/youtube.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const artist = req.query.artist?.trim();

  if (!artist) {
    return res.status(400).json({ error: 'Artist name is required.' });
  }

  const result = await searchYouTubeMixes(artist);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
}
