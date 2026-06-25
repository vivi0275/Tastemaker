export default function DiscoveryTrail({ trail, onSelect }) {
  if (!trail || trail.length === 0) return null;

  return (
    <nav aria-label="Discovery path" className="panel flex flex-wrap items-center justify-center gap-2 px-4 py-3">
      <span className="label-mono text-[var(--color-muted)]">Rabbit hole</span>
      {trail.map((name, i) => {
        const isLast = i === trail.length - 1;

        return (
          <span key={`${name}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span className="label-mono text-[var(--color-muted)]/30">→</span>}
            {isLast ? (
              <span className="tab-pill tab-pill-active cursor-default">{name}</span>
            ) : (
              <button type="button" onClick={() => onSelect(name, i)} className="tab-pill">
                {name}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
