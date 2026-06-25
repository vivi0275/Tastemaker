import CollapsibleSection from './CollapsibleSection';

export default function ScDiscoverySection({
  discoveries,
  sourceArtist,
  onDiscoverArtist,
  discoveringArtist,
}) {
  if (!discoveries?.length) return null;

  return (
    <CollapsibleSection
      title="Discovery reposts"
      subtitle={`Artists ${sourceArtist} reposted. One click to dig their crate.`}
      badge={`${discoveries.length} ${discoveries.length === 1 ? 'artist' : 'artists'}`}
      defaultOpen={false}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {discoveries.map((item, i) => (
          <article
            key={item.name}
            className="animate-fade-up track-card track-card-discovery flex flex-col p-4"
            style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
          >
            <p className="label-mono mb-2 text-[var(--color-discovery)]">via {sourceArtist}</p>
            <h3 className="text-sm font-medium text-white">{item.name}</h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">e.g. {item.exampleTrack}</p>
            <button
              type="button"
              onClick={() => onDiscoverArtist(item.name)}
              disabled={discoveringArtist === item.name}
              className="btn-ghost mt-4 w-full py-2.5 text-[var(--color-accent)] disabled:opacity-50"
            >
              {discoveringArtist === item.name ? 'Digging…' : 'Dig their crate →'}
            </button>
          </article>
        ))}
      </div>
    </CollapsibleSection>
  );
}
