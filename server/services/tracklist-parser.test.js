import { parseTracklistText, extractTracklist } from './tracklist-parser.js';
import assert from 'node:assert';

const sampleDescription = `
Pegassi live at DGTL Amsterdam 2025

Tracklist:
00:00 Pegassi - Spectral Bells
03:45 Siimon - Lost Souls
08:12 Noimage - Breathing Out
12:30 mischluft - Entertain Me
`;

const tracks = parseTracklistText(sampleDescription);
assert.equal(tracks.length, 4, 'should parse 4 timestamped tracks');
assert.equal(tracks[0].title, 'Spectral Bells');
assert.equal(tracks[1].artist, 'Siimon');

const fromComments = extractTracklist('Short description', [
  { text: 'great set!', likeCount: 2 },
  {
    text: `Tracklist:
00:00 Artist A - Track One
05:00 Artist B - Track Two
10:00 Artist C - Track Three`,
    likeCount: 42,
  },
]);

assert.equal(fromComments.source, 'comment');
assert.equal(fromComments.tracks.length, 3);

const emojiComment = parseTracklistText(`Set List:

✅ 0:00 - Pegassi - Spectral Bells
✅ 1:31 - 6 SENSE - No Joke !
✅ 4:31 - Céleste - Don't You Ever Look Back (Unreleased)`);

assert.equal(emojiComment.length, 3);
assert.equal(emojiComment[0].artist, 'Pegassi');
assert.equal(emojiComment[0].title, 'Spectral Bells');
assert.equal(emojiComment[0].timestamp, '0:00');

console.log('tracklist-parser tests passed');
