/**
 * ArrayVisualizer
 * ===============
 *
 * The fix for the teleporting bars lives here.
 *
 * Previously each bar was keyed by `${index}-${value}`. When an element moved,
 * its key changed, so React unmounted the old node and mounted a new one. A
 * freshly mounted node has no previous position to animate from, so it just
 * appeared at its destination.
 *
 * Now every bar is keyed by the stable `id` the backend sends with each step,
 * and the DOM order never changes — bars are sorted by id and positioned purely
 * with `translateX`. When the backend moves an element from slot 3 to slot 2,
 * the same DOM node stays mounted and its transform changes, so the browser
 * animates it across. No element ever teleports, and no delay is faked: the
 * transition duration is derived from the playback speed.
 */

const ROLE_STYLES = {
  base: {
    bar: "bg-crimson/70",
    text: "text-zinc-400",
    glow: "",
  },
  compare: {
    bar: "bg-amber-400",
    text: "text-amber-300",
    glow: "shadow-[0_0_16px_rgba(251,191,36,.55)]",
  },
  swap: {
    bar: "bg-neon",
    text: "text-neon",
    glow: "shadow-[0_0_20px_rgba(255,23,68,.7)]",
  },
  shift: {
    bar: "bg-orange-400",
    text: "text-orange-300",
    glow: "shadow-[0_0_18px_rgba(251,146,60,.6)]",
  },
  key: {
    bar: "bg-white",
    text: "text-white",
    glow: "shadow-[0_0_22px_rgba(255,255,255,.55)]",
  },
  sorted: {
    bar: "bg-emerald-400/85",
    text: "text-emerald-300",
    glow: "",
  },
};

/** Decide how a single slot should look for the current step. */
function roleFor(slot, step) {
  const isSorted = step.sorted?.includes(slot);
  const touched = step.indices?.includes(slot);
  const isActive = step.active === slot;

  // Sorted always wins over compare/shift/key.
  if (isSorted) return "sorted";

  if (isActive && (step.type === "select" || step.type === "insert")) {
    return "key";
  }

  if (touched) {
    if (step.type === "swap") return "swap";
    if (step.type === "shift") return isActive ? "key" : "shift";
    if (step.type === "compare") return isActive ? "key" : "compare";
  }

  if (isActive) return "key";

  return "base";
}

const TYPE_LABEL = {
  compare: "Compare",
  swap: "Swap",
  shift: "Shift",
  insert: "Insert",
  select: "Select",
  sorted: "Sorted",
  done: "Done",
};

export default function ArrayVisualizer({ step, transitionMs = 240 }) {
  const values = step.array ?? [];
  const ids = step.ids ?? values.map((_, index) => index);
  const count = values.length || 1;
  const max = Math.max(...values, 1);

  // Sort by id so the DOM order is fixed for the whole run. Position comes from
  // the slot index, applied as a transform.
  const bars = ids
    .map((id, slot) => ({ id, slot, value: values[slot] }))
    .sort((a, b) => a.id - b.id);

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="rounded border border-neon/40 bg-neon/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.18em] text-neon">
          {TYPE_LABEL[step.type] ?? step.type}
        </span>
        <p className="truncate text-sm text-zinc-300">{step.message}</p>
      </div>

      <div
        className="relative mt-5 h-72 border-b border-white/10"
        aria-label="Array visualization"
        role="img"
      >
        {bars.map(({ id, slot, value }) => (
          <div
            key={id}
            className="absolute bottom-0 top-0 px-[3px]"
            style={{
              width: `${100 / count}%`,
              transform: `translateX(${slot * 100}%)`,
              transition: `transform ${transitionMs}ms cubic-bezier(.4,0,.2,1)`,
            }}
          >
            <Bar
              value={value}
              slot={slot}
              heightPct={(value / max) * 100}
              role={roleFor(slot, step)}
              transitionMs={transitionMs}
            />
          </div>
        ))}
      </div>

      <Legend />
    </div>
  );
}

function Bar({ value, slot, heightPct, role, transitionMs }) {
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.base;
  return (
    <div className="flex h-full flex-col justify-end">
      <span
        className={`mb-2 text-center font-mono text-xs transition-colors ${style.text}`}
      >
        {value}
      </span>
      <div
        style={{
          height: `${heightPct}%`,
          transition: `height ${transitionMs}ms cubic-bezier(.4,0,.2,1), background-color 160ms, box-shadow 160ms`,
        }}
        className={`min-h-3 rounded-t-sm ${style.bar} ${style.glow}`}
      />
      <span className="mt-2 text-center font-mono text-[10px] text-zinc-600">
        {slot}
      </span>
    </div>
  );
}

function Legend() {
  const items = [
    ["bg-crimson/70", "Unsorted"],
    ["bg-amber-400", "Comparing"],
    ["bg-orange-400", "Shifting"],
    ["bg-neon", "Swapping"],
    ["bg-white", "Current key"],
    ["bg-emerald-400/85", "Sorted"],
  ];
  return (
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-2">
          <i className={`inline-block size-2 rounded-sm ${color}`} />
          {label}
        </span>
      ))}
    </div>
  );
}
