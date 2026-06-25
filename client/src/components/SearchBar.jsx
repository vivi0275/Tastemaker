export default function SearchBar({ value, onChange, onSubmit, loading, compact = false }) {
  return (
    <form onSubmit={onSubmit} className={`panel w-full max-w-xl ${compact ? 'p-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]' : 'p-1.5'}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={compact ? 'Dig another artist…' : 'Search a DJ or producer…'}
          disabled={loading}
          autoFocus={!compact}
          className={`input-field w-full pr-24 disabled:opacity-50 ${compact ? 'px-3.5 py-2.5 text-sm' : 'px-4 py-3.5 text-base'}`}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="btn-accent absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2"
        >
          {loading ? '…' : 'Dig'}
        </button>
      </div>
    </form>
  );
}
