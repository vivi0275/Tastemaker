const EMOJI_TIMESTAMP_LINE =
  /^[\u2705\u274c\uFE0F\s]*(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*(.+)$/i;

const TIMESTAMP_LINE =
  /^(?:\[)?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*[-–—]?\s*(.+)$/i;

const TRACKLIST_HEADER = /^(?:track\s*list|set\s*list|tracklist|setlist)\s*:?\s*$/i;

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isIdTrack(artist, title) {
  const a = normalizeText(artist);
  const t = normalizeText(title);
  return a === 'id' && t === 'id';
}

function splitArtistTitle(rest) {
  const cleaned = rest.trim().replace(/\s+/g, ' ');
  if (!cleaned) return { artist: null, title: null };

  const byMatch = cleaned.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (byMatch) {
    return { artist: byMatch[1].trim(), title: byMatch[2].trim() };
  }

  const featMatch = cleaned.match(/^(.+?)\s+(?:feat\.?|ft\.?)\s+(.+)$/i);
  if (featMatch) {
    return { artist: featMatch[1].trim(), title: cleaned };
  }

  return { artist: null, title: cleaned };
}

export function cleanTrackForSearch(title, artist) {
  const stripTags = (value) =>
    String(value ?? '')
      .replace(/\s*\((?:unreleased|extended(?:\s+ver\.?|\s+mix)?|original\s+mix|acapella|a\s+capella|id)\)\s*/gi, ' ')
      .replace(/\s*\[(?:unreleased|extended(?:\s+mix)?|original\s+mix|acapella|id)\]\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  return {
    title: stripTags(title),
    artist: stripTags(artist),
  };
}

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('http')) return null;

  const emojiMatch = trimmed.match(EMOJI_TIMESTAMP_LINE);
  if (emojiMatch) {
    const { artist, title } = splitArtistTitle(emojiMatch[2]);
    if (!title || isIdTrack(artist, title)) return null;
    return {
      timestamp: emojiMatch[1],
      artist: artist ?? 'Unknown artist',
      title,
      rawLine: trimmed,
    };
  }

  const tsMatch = trimmed.match(TIMESTAMP_LINE);
  if (tsMatch) {
    const { artist, title } = splitArtistTitle(tsMatch[2]);
    if (!title || isIdTrack(artist, title)) return null;
    return {
      timestamp: tsMatch[1],
      artist: artist ?? 'Unknown artist',
      title,
      rawLine: trimmed,
    };
  }

  const plain = splitArtistTitle(trimmed);
  if (!plain.title || plain.title.length < 2) return null;
  if (isIdTrack(plain.artist, plain.title)) return null;
  if (/^(subscribe|follow|instagram|spotify|soundcloud)/i.test(plain.title)) return null;

  return {
    timestamp: null,
    artist: plain.artist ?? 'Unknown artist',
    title: plain.title,
    rawLine: trimmed,
  };
}

export function parseTracklistText(text) {
  if (!text?.trim()) return [];

  const lines = text.split(/\r?\n/);
  const tracks = [];
  let inTracklistBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (TRACKLIST_HEADER.test(trimmed)) {
      inTracklistBlock = true;
      continue;
    }

    const hasTimestamp = /^\[?\d{1,2}:\d{2}/.test(trimmed) || /^[\u2705\u274c]/.test(trimmed);
    const parsed = parseLine(trimmed);

    if (parsed) {
      if (hasTimestamp || inTracklistBlock || parsed.timestamp) {
        tracks.push(parsed);
      }
    } else if (inTracklistBlock && tracks.length > 0 && !hasTimestamp) {
      inTracklistBlock = false;
    }
  }

  const seen = new Set();
  return tracks.filter((t) => {
    const key = `${normalizeText(t.artist)}|${normalizeText(t.title)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function scoreCommentAsTracklist(text, likeCount = 0) {
  if (!text?.trim()) return 0;

  const lower = text.toLowerCase();
  let score = 0;

  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (/^\[?\d{1,2}:\d{2}/.test(line.trim()) || /^[\u2705\u274c]/.test(line.trim())) score += 10;
  }

  if (/track\s*list|set\s*list|tracklist|setlist/i.test(lower)) score += 5;
  score += Math.min(likeCount, 50);

  const parsed = parseTracklistText(text);
  score += parsed.length * 2;

  return score;
}

export function extractTracklistFromComments(comments) {
  if (!comments?.length) return { source: null, tracks: [] };

  let best = { score: 0, text: '', tracks: [] };

  for (const comment of comments) {
    const text = comment.text ?? comment;
    const likes = comment.likeCount ?? 0;
    const tracks = parseTracklistText(text);
    const score = scoreCommentAsTracklist(text, likes);

    if (score > best.score && tracks.length >= 3) {
      best = { score, text, tracks };
    }
  }

  if (best.tracks.length >= 3) {
    return { source: 'comment', tracks: best.tracks };
  }

  return { source: null, tracks: [] };
}

export function extractTracklist(description, comments = []) {
  const fromDescription = parseTracklistText(description);
  if (fromDescription.length >= 3) {
    return { source: 'description', tracks: fromDescription };
  }

  const fromComments = extractTracklistFromComments(comments);
  if (fromComments.tracks.length >= 3) {
    return fromComments;
  }

  if (fromDescription.length > 0) {
    return { source: 'description', tracks: fromDescription };
  }

  return { source: null, tracks: [] };
}
