import { useEffect, useRef, useState } from 'react';
import { usePreviewContext } from '../context/PreviewContext';

const PREVIEW_DURATION = 30;

export default function SpotifyPreview({ previewUrl, title, onPreviewPlay, compact = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { registerPlay, registerStop } = usePreviewContext();
  const previewId = `spotify-${previewUrl}`;

  useEffect(() => {
    const handleStop = (e) => {
      if (e.detail?.trackId === previewId) {
        audioRef.current?.pause();
        setPlaying(false);
        setProgress(0);
      }
    };

    window.addEventListener('tastemaker:preview-stop', handleStop);
    return () => {
      window.removeEventListener('tastemaker:preview-stop', handleStop);
      audioRef.current?.pause();
      registerStop(previewId);
    };
  }, [previewId, registerStop]);

  const stopPlayback = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setProgress(0);
    registerStop(previewId);
  };

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      stopPlayback();
      return;
    }

    setError(null);
    registerPlay(previewId, stopPlayback);

    if (!audio.src) {
      audio.src = previewUrl;
    }

    try {
      await audio.play();
      setPlaying(true);
      onPreviewPlay?.();
    } catch {
      setError('Preview unavailable for this track.');
      setPlaying(false);
      registerStop(previewId);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const pct = Math.min((audio.currentTime / PREVIEW_DURATION) * 100, 100);
    setProgress(pct);

    if (audio.currentTime >= PREVIEW_DURATION) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      setProgress(0);
      registerStop(previewId);
    }
  };

  return (
    <div className={compact ? 'dig-card-preview' : 'space-y-2'}>
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          registerStop(previewId);
        }}
        onError={() => {
          setError('Preview unavailable for this track.');
          setPlaying(false);
          registerStop(previewId);
        }}
      />

      <button
        type="button"
        onClick={handlePlay}
        className={
          compact
            ? 'dig-card-play text-[var(--color-spotify)]'
            : 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-spotify)]/40 bg-[var(--color-spotify)]/10 px-4 py-2.5 text-sm font-medium text-[var(--color-spotify)] transition-colors hover:bg-[var(--color-spotify)]/20'
        }
      >
        {playing ? 'Stop' : compact ? `▶ 30s` : `▶ Preview (${PREVIEW_DURATION}s)`}
      </button>

      {(playing || progress > 0) && (
        <div className={`overflow-hidden rounded-full bg-white/10 ${compact ? 'h-px' : 'h-1'}`}>
          <div
            className="h-full bg-[var(--color-spotify)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {!compact && (
        <p className="text-[10px] text-[var(--color-muted)]">
          Preview via Spotify · {title} · 30s clip when available · Not their private likes
        </p>
      )}

      {error && <p className="text-xs text-amber-300/80">{error}</p>}
    </div>
  );
}
