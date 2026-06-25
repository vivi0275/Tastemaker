import { useState } from 'react';

export default function CollapsibleSection({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
  className = '',
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`panel w-full ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 rounded-t-[0.75rem] px-4 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-5"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="section-title text-lg text-white sm:text-xl">{title}</h2>
            {badge != null && <span className="badge-mono">{badge}</span>}
          </div>
          {subtitle && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">{subtitle}</p>}
        </div>
        <span
          className={`label-mono mt-0.5 shrink-0 text-[var(--color-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && <div className="space-y-6 border-t border-[var(--color-border-subtle)] px-4 py-5 sm:px-5">{children}</div>}
    </section>
  );
}
