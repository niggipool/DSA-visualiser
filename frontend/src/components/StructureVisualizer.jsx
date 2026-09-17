import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring", stiffness: 380, damping: 30 };

const TYPE_LABEL = {
  init: "Ready",
  push: "Push",
  pop: "Pop",
  peek: "Peek",
  enqueue: "Enqueue",
  dequeue: "Dequeue",
  insert: "Insert",
  delete: "Delete",
  unlink: "Unlink",
  traverse: "Traverse",
  compare: "Compare",
  found: "Found",
  notfound: "Not found",
  swap: "Swap",
  settle: "Settle",
  replace: "Replace",
  extract: "Extract",
  hash: "Hash",
  put: "Put",
  update: "Update",
  collision: "Collision",
  error: "Error",
  done: "Done",
};

function cellClass(highlighted, extra = "") {
  return `grid place-items-center rounded-md border font-mono transition-colors ${
    highlighted
      ? "border-neon bg-neon/15 text-white shadow-[0_0_18px_rgba(255,23,68,.45)]"
      : "border-white/15 bg-white/[.04] text-zinc-200"
  } ${extra}`;
}

export default function StructureVisualizer({ step }) {
  const cells = step.cells ?? [];
  const highlight = new Set(step.highlight ?? []);
  const isError = step.type === "error";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.18em] ${
            isError
              ? "border-red-500/50 bg-red-500/10 text-red-300"
              : "border-neon/40 bg-neon/10 text-neon"
          }`}
        >
          {TYPE_LABEL[step.type] ?? step.type}
        </span>
        <p className="min-w-0 flex-1 text-sm text-zinc-300">{step.message}</p>
        {step.output !== null && step.output !== undefined && (
          <span className="rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-xs text-emerald-300">
            returned {String(step.output)}
          </span>
        )}
      </div>

      <div className="mt-6 min-h-[18rem] rounded-lg border border-white/10 bg-ink/50 p-5">
        {step.structure === "stack" && (
          <StackView cells={cells} highlight={highlight} />
        )}
        {step.structure === "queue" && (
          <QueueView cells={cells} highlight={highlight} />
        )}
        {step.structure === "linked-list" && (
          <LinkedListView cells={cells} highlight={highlight} />
        )}
        {step.structure === "heap" && (
          <HeapView cells={cells} highlight={highlight} />
        )}
        {step.structure === "hash-map" && (
          <HashMapView cells={cells} highlight={highlight} step={step} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stack: grows upward, everything happens at the top                  */
/* ------------------------------------------------------------------ */
function StackView({ cells, highlight }) {
  return (
    <div className="flex h-full flex-col items-center justify-end gap-2">
      <AnimatePresence mode="popLayout">
        {[...cells].reverse().map((cell, index) => (
          <motion.div
            key={cell.id}
            layout
            transition={spring}
            initial={{ opacity: 0, y: -30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.85 }}
            className="flex items-center gap-3"
          >
            {index === 0 && (
              <span className="w-12 text-right font-mono text-[10px] uppercase text-neon">
                top
              </span>
            )}
            {index !== 0 && <span className="w-12" />}
            <div
              className={cellClass(highlight.has(cell.id), "h-11 w-28 text-sm")}
            >
              {cell.value}
            </div>
            <span className="w-12 font-mono text-[10px] text-zinc-600">
              {cells.length - 1 - index}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
      {cells.length === 0 && <EmptyNote text="Stack is empty" />}
      <div className="mt-2 h-1 w-44 rounded bg-white/15" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Queue: enters right, leaves left                                    */
/* ------------------------------------------------------------------ */
function QueueView({ cells, highlight }) {
  return (
    <div className="flex h-full flex-col justify-center mt-22  items-center">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase text-neon">front</span>
        <div className="flex flex-1 items-center gap-2">
          <AnimatePresence mode="popLayout">
            {cells.map((cell) => (
              <motion.div
                key={cell.id}
                layout
                transition={spring}
                initial={{ opacity: 0, x: 40, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.85 }}
                className={cellClass(
                  highlight.has(cell.id),
                  "h-14 w-16 text-sm",
                )}
              >
                {cell.value}
              </motion.div>
            ))}
          </AnimatePresence>
          {cells.length === 0 && <EmptyNote text="Queue is empty" />}
        </div>
        <span className="font-mono text-[10px] uppercase text-neon">rear</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Linked list: nodes joined by pointers                               */
/* ------------------------------------------------------------------ */
function LinkedListView({ cells, highlight }) {
  return (
    <div className="flex h-full flex-col justify-center items-center mt-22">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase text-neon">head</span>
        <span className="font-mono text-zinc-600">→</span>
        <AnimatePresence mode="popLayout">
          {cells.map((cell) => (
            <motion.div
              key={cell.id}
              layout
              transition={spring}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-2"
            >
              <div
                className={cellClass(
                  highlight.has(cell.id),
                  "h-14 w-20 text-sm",
                )}
              >
                {cell.value}
              </div>
              <span className="font-mono text-zinc-600">→</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <span className="font-mono text-xs text-zinc-600">null</span>
      </div>
      {cells.length === 0 && (
        <EmptyNote text="List is empty, head points to null" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Heap: array positions drawn as a complete binary tree               */
/* ------------------------------------------------------------------ */
function HeapView({ cells, highlight }) {
  const depthOf = (index) => Math.floor(Math.log2(index + 1));
  const maxDepth = cells.length ? depthOf(cells.length - 1) : 0;

  const positionOf = (index) => {
    const depth = depthOf(index);
    const levelStart = 2 ** depth - 1;
    const offset = index - levelStart;
    const count = 2 ** depth;
    return {
      x: ((offset + 0.5) / count) * 100,
      y: maxDepth === 0 ? 50 : 14 + (depth / maxDepth) * 66,
    };
  };

  return (
    <div className="space-y-4">
      <div className="relative h-52">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full"
          preserveAspectRatio="none"
        >
          {cells.map((cell, index) => {
            if (index === 0) return null;
            const parent = positionOf(Math.floor((index - 1) / 2));
            const self = positionOf(index);
            return (
              <line
                key={cell.id}
                x1={parent.x}
                y1={parent.y}
                x2={self.x}
                y2={self.y}
                stroke="#3f3f46"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {cells.map((cell, index) => {
          const { x, y } = positionOf(index);
          return (
            <motion.div
              key={cell.id}
              layout
              transition={spring}
              className={cellClass(
                highlight.has(cell.id),
                "absolute size-11 -translate-x-1/2 -translate-y-1/2 text-sm",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {cell.value}
            </motion.div>
          );
        })}
        {cells.length === 0 && <EmptyNote text="Heap is empty" />}
      </div>

      {/* The same heap as its underlying array */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-zinc-500">
          Underlying array — children of k are 2k+1 and 2k+2
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cells.map((cell, index) => (
            <motion.div
              key={cell.id}
              layout
              transition={spring}
              className={cellClass(highlight.has(cell.id), "h-10 w-12 text-xs")}
            >
              <span>{cell.value}</span>
              <span className="text-[9px] text-zinc-600">{index}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hash map: one row per bucket, chains inside                         */
/* ------------------------------------------------------------------ */
function HashMapView({ cells, highlight, step }) {
  const bucketCount = step.pointers?.buckets ?? 8;
  const activeBucket = step.pointers?.active_bucket;

  return (
    <div className="space-y-1.5">
      {Array.from({ length: bucketCount }, (_, bucket) => {
        const chain = cells.filter((cell) => cell.bucket === bucket);
        const isActive = activeBucket === bucket;
        return (
          <div
            key={bucket}
            className={`flex items-center gap-3 rounded-md border px-2 py-1.5 transition-colors ${
              isActive
                ? "border-neon/60 bg-neon/5"
                : "border-white/5 bg-transparent"
            }`}
          >
            <span
              className={`w-8 shrink-0 text-center font-mono text-xs ${
                isActive ? "text-neon" : "text-zinc-600"
              }`}
            >
              {bucket}
            </span>
            <div className="flex min-h-9 flex-wrap items-center gap-2">
              <AnimatePresence mode="popLayout">
                {chain.map((cell, index) => (
                  <motion.div
                    key={cell.id}
                    layout
                    transition={spring}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="flex items-center gap-2"
                  >
                    {index > 0 && (
                      <span className="font-mono text-zinc-600">→</span>
                    )}
                    <div
                      className={cellClass(
                        highlight.has(cell.id),
                        "h-9 gap-2 px-3 text-xs [grid-auto-flow:column]",
                      )}
                    >
                      <span className="text-zinc-400">{cell.key}</span>
                      <span className="text-white">{cell.value}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {chain.length === 0 && (
                <span className="font-mono text-xs text-zinc-700">null</span>
              )}
            </div>
            {chain.length > 1 && (
              <span className="ml-auto shrink-0 font-mono text-[10px] uppercase text-amber-400">
                chain of {chain.length}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmptyNote({ text }) {
  return (
    <p className="grid h-full place-items-center font-mono text-xs text-zinc-700">
      {text}
    </p>
  );
}
