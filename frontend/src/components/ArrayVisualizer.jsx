import { motion, AnimatePresence } from "framer-motion";


const ROLES = {
  base: "bg-crimson/70",
  compare: "bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,.55)]",
  swap: "bg-neon shadow-[0_0_20px_rgba(255,23,68,.7)]",
  shift: "bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,.6)]",
  key: "bg-white shadow-[0_0_22px_rgba(255,255,255,.55)]",
  probe: "bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,.6)]",
  found: "bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,.75)]",
  sorted: "bg-emerald-400/85",
  pivot: "bg-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,.6)]",
};

const LABEL_COLOR = {
  base: "text-zinc-400",
  compare: "text-amber-300",
  swap: "text-neon",
  shift: "text-orange-300",
  key: "text-white",
  probe: "text-sky-300",
  found: "text-emerald-300",
  sorted: "text-emerald-300",
  pivot: "text-fuchsia-300",
};

const TYPE_LABEL = {
  compare: "Compare",
  swap: "Swap",
  shift: "Shift",
  insert: "Insert",
  select: "Select",
  write: "Write",
  divide: "Divide",
  probe: "Probe",
  found: "Found",
  notfound: "Not found",
  sorted: "Sorted",
  done: "Done",
  note: "Note",
  idle: "Ready",
};


function roleFor(slot, step) {
  const touched = step.indices?.includes(slot);
  const active = step.active === slot;
  const pointers = step.pointers ?? {};

  if (step.found === slot && (step.type === "found" || step.type === "done"))
    return "found";
  if (step.type === "probe" && touched) return "probe";
  if (pointers.pivot === slot) return "pivot";

  if (touched) {
    if (step.type === "swap") return "swap";
    if (step.type === "shift") return active ? "key" : "shift";
    if (step.type === "compare") return active ? "key" : "compare";
    if (step.type === "write" || step.type === "insert") return "key";
  }
  if (active) return "key";
  if (step.sorted?.includes(slot)) return "sorted";
  return "base";
}

export default function ArrayVisualizer({ step, transitionMs = 240 }) {
  const values = step.array ?? [];
  const ids = step.ids ?? values.map((_, index) => index);
  const pointers = step.pointers ?? {};


  const allValues = [
    ...values.filter((value) => value !== null),
    ...(step.auxLeft ?? []),
    ...(step.auxRight ?? []),
  ];
  const max = Math.max(...allValues, 1);

  const spring = {
    type: "spring",
    stiffness: 420,
    damping: 34,
    duration: transitionMs / 1000,
  };

  const hasBuffer = step.auxLeft !== null && step.auxLeft !== undefined;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded border border-neon/40 bg-neon/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.18em] text-neon">
          {TYPE_LABEL[step.type] ?? step.type}
        </span>
        <p className="min-w-0 flex-1 text-sm text-zinc-300">{step.message}</p>
        {step.target !== undefined && step.target !== null && (
          <span className="rounded border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 font-mono text-lg text-sky-300">
            target {step.target}
          </span>
        )}
      </div>

      {/* Main array */}
      <div className="mt-6 flex h-64 items-end gap-1.5 border-b border-white/10">
        {values.map((value, slot) => {
          const id = ids[slot];
          const role = roleFor(slot, step);

          if (value === null) {
            return (
              <div key={`hole-${id}`} className="flex h-full flex-1 items-end">
                <div className="h-8 w-full rounded-t-sm border border-dashed border-white/20 bg-white/[.02]" />
              </div>
            );
          }

          return (
            <div key={id} className="flex h-full flex-1 flex-col justify-end">
              <motion.div
                layoutId={`el-${id}`}
                transition={spring}
                className="flex h-full flex-col justify-end"
              >
                <span
                  className={`mb-1.5 text-center font-mono text-xs ${LABEL_COLOR[role]}`}
                >
                  {value}
                </span>
                <div
                  style={{ height: `${(value / max) * 100}%` }}
                  className={`min-h-3 rounded-t-sm transition-colors duration-150 ${ROLES[role]}`}
                />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Slot indices and named pointers */}
      <div className="flex gap-1.5">
        {values.map((_, slot) => {
          const marks = Object.entries(pointers)
            .filter(([, index]) => index === slot)
            .map(([name]) => name);
          return (
            <div key={slot} className="flex-1 text-center">
              <span className="font-mono text-[10px] text-zinc-600">
                {slot}
              </span>
              {marks.length > 0 && (
                <p className="font-mono text-[9px] uppercase leading-tight text-neon">
                  {marks.join(" ")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Merge buffer */}
      <AnimatePresence>
        {hasBuffer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-zinc-500">
              Merge buffer — the O(n) extra space
            </p>
            <div className="mt-2 flex flex-wrap gap-6">
              <BufferHalf
                label="Left"
                values={step.auxLeft ?? []}
                ids={step.auxLeftIds ?? []}
                spring={spring}
              />
              <BufferHalf
                label="Right"
                values={step.auxRight ?? []}
                ids={step.auxRightIds ?? []}
                spring={spring}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Legend />
    </div>
  );
}


function BufferHalf({ label, values, ids, spring }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase text-zinc-500">
        {label}
      </span>
      <div className="flex min-h-9 items-center gap-1.5">
        {values.length === 0 ? (
          <span className="font-mono text-xs text-zinc-700">empty</span>
        ) : (
          values.map((value, index) => (
            <motion.div
              key={ids[index]}
              layoutId={`el-${ids[index]}`}
              transition={spring}
              className={`grid size-9 place-items-center rounded border font-mono text-xs ${
                index === 0
                  ? "border-amber-400/70 bg-amber-400/15 text-amber-200"
                  : "border-white/15 bg-white/[.03] text-zinc-300"
              }`}
            >
              {value}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    ["bg-crimson/70", "Unsorted"],
    ["bg-amber-400", "Comparing"],
    ["bg-orange-400", "Shifting"],
    ["bg-neon", "Swapping"],
    ["bg-fuchsia-400", "Pivot"],
    ["bg-sky-400", "Probing"],
    ["bg-white", "Current"],
    ["bg-emerald-400/85", "Sorted / found"],
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
