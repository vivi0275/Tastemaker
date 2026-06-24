export default function SearchBar({ value, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl">
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search an artist…"
          disabled={loading}
          autoFocus
          className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-5 py-4 pr-28 text-base text-white placeholder:text-[var(--color-muted)] outline-none transition-all focus:border-white/20 focus:ring-2 focus:ring-white/5 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Searching…' : 'Discover'}
        </button>
      </div>
    </form>
  );
}
