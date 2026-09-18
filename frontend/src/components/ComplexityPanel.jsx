

function Cell({ label, value, accent }) {
  return (
    <div className="rounded-md border border-white/10 bg-ink/60 px-3 py-2">
      <p className="font-mono text-[9px] uppercase tracking-[.16em] text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-sm font-bold ${accent ? "text-neon" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function ComplexityPanel({ meta, stats }) {
  if (!meta?.name) return null;
  const timeEntries = Object.entries(meta.time ?? {});

  return (
    <section className="mt-4 rounded-lg border border-white/10 bg-panel/80 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{meta.name}</h3>
        <div className="flex gap-2 font-mono text-[10px] uppercase tracking-[.16em]">
          {meta.stable !== null && meta.stable !== undefined && (
            <span
              className={`rounded border px-2 py-0.5 ${
                meta.stable
                  ? "border-emerald-400/40 text-emerald-300"
                  : "border-amber-400/40 text-amber-300"
              }`}
            >
              {meta.stable ? "Stable" : "Unstable"}
            </span>
          )}
          {meta.in_place && (
            <span className="rounded border border-white/15 px-2 py-0.5 text-zinc-400">
              In place
            </span>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {meta.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {timeEntries.map(([label, value]) => (
          <Cell key={label} label={label} value={value} />
        ))}
        <Cell label="Space" value={meta.space} accent />
      </div>

      {stats && (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries(stats).map(([label, value]) => (
            <Cell key={label} label={`${label} (this run)`} value={value} />
          ))}
        </div>
      )}

      {meta.notes && (
        <p className="mt-3 border-l-2 border-neon/60 pl-3 text-xs leading-relaxed text-zinc-500">
          {meta.notes}
        </p>
      )}
    </section>
  );
}
