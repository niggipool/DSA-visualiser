import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ArrayVisualizer from "../components/ArrayVisualizer";

import ComplexityPanel from "../components/ComplexityPanel";
import VisualizerControls from "../components/VisualizerControls";
import InputPanel from "../components/InputPanel";
import { useStepPlayer } from "../hooks/useStepPlayer";
import { runAlgorithm } from "../services/api";
import {
  algorithmsByCategory,
  categories,
  entryFor,
  isImplemented,
} from "../data/algorithms";
import { algorithmDetails } from "../data/algorithmInfo";

const DEFAULT_PAYLOAD = {
  array: { array: [42, 17, 68, 9, 31, 56, 24, 73] },
  search: { array: [42, 17, 68, 9, 31, 56, 24, 73], target: 68 },
  graph: { start: "A", goal: "I" },
  tree: { values: [50, 30, 70, 20, 40, 60, 80] },
  treeOrder: { values: [50, 30, 70, 20, 40, 60, 80], order: "inorder" },
  operations: {},
};

export default function AlgorithmsPage() {
  const [category, setCategory] = useState("Sorting");
  const [algorithm, setAlgorithm] = useState("Bubble Sort");
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD.array);
  const [run, setRun] = useState(null);
  const [speed, setSpeed] = useState(55);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showConcepts, setShowConcepts] = useState(false);

  const entry = entryFor(category, algorithm);
  const details = algorithmDetails(category, algorithm);
  const steps = run?.steps ?? [];
  const player = useStepPlayer(steps, speed);

  const selectAlgorithm = (nextCategory, nextAlgorithm) => {
    setCategory(nextCategory);
    setAlgorithm(nextAlgorithm);
    const nextEntry = entryFor(nextCategory, nextAlgorithm);
    setPayload(nextEntry ? DEFAULT_PAYLOAD[nextEntry.input] : null);
    setRun(null);
    setApiError("");
  };

  useEffect(() => {
    if (!entry || !payload) {
      setRun(null);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setApiError("");
      try {
        setRun(await runAlgorithm(entry, payload, controller.signal));
      } catch (error) {
        if (error.name !== "AbortError") {
          setRun(null);
          setApiError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [entry, payload]);

  const step = useMemo(
    () =>
      steps.length ? steps[Math.min(player.frame, steps.length - 1)] : null,
    [steps, player.frame],
  );

  const nodeIds = useMemo(
    () => (run?.graph?.nodes ?? []).map((node) => node.id),
    [run],
  );

  const stepLabel = steps.length
    ? `STEP ${player.frame + 1} / ${steps.length}`
    : "STEP 0 / 0";

  return (
    <div className="min-h-screen bg-ink text-zinc-100 selection:bg-neon selection:text-white">
      <header className="sticky top-0 z-20 border-b border-neon/20 bg-ink/90 shadow-[0_1px_18px_rgba(255,23,68,.09)] backdrop-blur">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="font-mono text-3xl font-bold tracking-[.18em] text-white"
          >
            DSA<span className="text-neon"> </span>VISUALIZER
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-7">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-neon">
            Algorithm laboratory
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Algorithms
          </h1>
        </div>

        <section aria-label="Algorithm selection" className="space-y-3">
          <div className="grid overflow-hidden rounded-lg border border-white/10 bg-panel/80 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() =>
                  selectAlgorithm(item, algorithmsByCategory[item][0])
                }
                className={`min-h-14 border-b border-r border-white/5 px-3 py-3 text-sm font-bold transition last:border-r-0 sm:border-b-0 ${
                  category === item
                    ? "bg-neon/10 text-neon shadow-[inset_0_-2px_0_#ff1744]"
                    : "text-white hover:bg-white/[.03]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-panel/80 p-1.5">
            {algorithmsByCategory[category].map((item) => (
              <button
                key={item}
                onClick={() => selectAlgorithm(category, item)}
                className={`relative flex-1 rounded-md px-3 py-2 font-mono text-xs transition ${
                  algorithm === item
                    ? "border border-neon bg-neon/10 text-neon shadow-neon"
                    : "border border-transparent text-white hover:bg-white/[.03]"
                }`}
              >
                {item}
                {isImplemented(category, item) && (
                  <i
                    className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-emerald-400"
                    title="Implemented"
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {entry ? (
          <>
            <InputPanel
              entry={entry}
              algorithm={algorithm}
              nodeIds={nodeIds.length ? nodeIds : ["A"]}
              onRun={setPayload}
            />
            <VisualizerControls
              player={player}
              speed={speed}
              onSpeedChange={setSpeed}
              disabled={loading || steps.length === 0}
              stepLabel={stepLabel}
            />
          </>
        ) : (
          <section className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100">
            <strong>{algorithm}:</strong> Coming soon — backend visualizer not
            implemented yet.
          </section>
        )}

        {entry && (loading || apiError) && (
          <p
            role="status"
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              apiError
                ? "border-red-500/50 bg-red-500/10 text-red-200"
                : "border-neon/30 bg-neon/5 text-zinc-300"
            }`}
          >
            {apiError || `Loading ${algorithm} steps from the API…`}
          </p>
        )}

        <section className="mt-6 rounded-xl border border-white/10 bg-panel/80 p-5 sm:p-7">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            {algorithm}
          </h2>
          {entry && step ? (
            <>
              {entry.kind === "array" && (
                <ArrayVisualizer
                  step={step}
                  transitionMs={player.transitionMs}
                />
              )}
              {entry.kind === "graph" && (
                <GraphVisualizer
                  graph={run.graph}
                  step={step}
                  transitionMs={player.transitionMs}
                />
              )}
              {entry.kind === "structure" && (
                <StructureVisualizer step={step} />
              )}
            </>
          ) : (
            <p className="text-zinc-400">
              {entry
                ? "Waiting for steps from the backend."
                : "Coming soon — backend visualizer not implemented yet."}
            </p>
          )}
        </section>

        {entry && run?.meta ? (
          <ComplexityPanel meta={run.meta} stats={run.stats} />
        ) : (
          <p className="mt-4 border-l-2 border-neon bg-[#0a1027] px-3 py-2.5 text-sm leading-relaxed text-zinc-300">
            {details.description}
          </p>
        )}

        <section className="mt-4 rounded-lg border border-white/10 bg-panel/80">
          <button
            onClick={() => setShowConcepts((value) => !value)}
            aria-expanded={showConcepts}
            className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold text-zinc-100"
          >
            <span className="text-neon">{showConcepts ? "▾" : "▸"}</span>{" "}
            {algorithm} — Principles &amp; Key Concepts
          </button>
          {showConcepts && (
            <div className="grid gap-4 border-t border-white/10 px-4 py-4 text-sm leading-relaxed text-zinc-400 sm:grid-cols-3">
              {details.concepts.map(([title, text]) => (
                <p key={title}>
                  <strong className="text-zinc-200">{title}</strong>
                  <br />
                  {text}
                </p>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
