import CollapsibleSection from './CollapsibleSection';
import TrackCard from './TrackCard';

export default function SoundCloudTracksSection({
  title,
  subtitle,
  badge,
  tracks,
  startIndex = 0,
  defaultOpen = false,
  onOutboundClick,
  onPreviewPlay,
}) {
  if (!tracks?.length) return null;

  return (
    <CollapsibleSection title={title} subtitle={subtitle} badge={badge} defaultOpen={defaultOpen}>
      <div className="dig-card-grid">
        {tracks.map((track, i) => (
          <TrackCard
            key={track.id}
            track={track}
            index={startIndex + i}
            onOutboundClick={onOutboundClick}
            onPreviewPlay={onPreviewPlay}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
}
