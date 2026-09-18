import { useEffect, useState } from "react";
import { Check, Shuffle } from "lucide-react";



export const MAX_ARRAY_SIZE = 24;
const MIN_VALUE = 1;
const MAX_VALUE = 999;

export function parseNumbers(text) {
  const tokens = text.split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) return { error: "Enter at least one number." };
  if (tokens.length > MAX_ARRAY_SIZE)
    return { error: `Use at most ${MAX_ARRAY_SIZE} numbers.` };

  const values = [];
  for (const token of tokens) {
    if (!/^\d+$/.test(token))
      return { error: `"${token}" is not a whole number.` };
    const value = Number(token);
    if (value < MIN_VALUE || value > MAX_VALUE)
      return { error: `Values must be between ${MIN_VALUE} and ${MAX_VALUE}.` };
    values.push(value);
  }
  return { values };
}

export function randomArray(length = 10) {
  return Array.from({ length }, () => Math.floor(Math.random() * 90) + 8);
}

export function parseOperations(text, allowed) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return { error: "Add at least one operation." };
  if (lines.length > 30) return { error: "At most 30 operations per run." };

  const operations = [];
  for (const line of lines) {
    const [op, ...args] = line.split(/\s+/);
    if (!allowed.includes(op))
      return {
        error: `"${op}" is not valid here. Try: ${allowed.join(", ")}.`,
      };

    const operation = { op };
    if (["put", "get", "delete"].includes(op) && args.length > 0) {
      operation.key = args[0];
      if (op === "put") {
        if (args.length < 2)
          return { error: `"${line}" needs a value: put key value.` };
        operation.value = Number(args[1]) || args[1];
      }
    } else if (args.length > 0) {
      if (!/^\d+$/.test(args[0]))
        return { error: `"${args[0]}" in "${line}" is not a whole number.` };
      operation.value = Number(args[0]);
      if (args.length > 1) operation.index = Number(args[1]) || 0;
    }
    operations.push(operation);
  }
  return { operations };
}

const button =
  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition disabled:opacity-40";
const field =
  "rounded-md border border-white/15 bg-ink px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-neon";

export default function InputPanel({ entry, algorithm, nodeIds, onRun }) {
  const [arrayText, setArrayText] = useState("42, 17, 68, 9, 31, 56, 24, 73");
  const [target, setTarget] = useState("68");
  const [start, setStart] = useState("A");
  const [goal, setGoal] = useState("I");
  const [treeText, setTreeText] = useState("50, 30, 70, 20, 40, 60, 80");
  const [order, setOrder] = useState("inorder");
  const [opsText, setOpsText] = useState(entry?.sample ?? "");
  const [error, setError] = useState("");


  useEffect(() => {
    if (entry?.input === "operations") setOpsText(entry.sample ?? "");
    setError("");
  }, [entry]);

  const submit = (payload) => {
    setError("");
    onRun(payload);
  };

  const runArray = (withTarget) => {
    const { values, error: parseError } = parseNumbers(arrayText);
    if (parseError) return setError(parseError);
    if (withTarget) {
      if (!/^\d+$/.test(target))
        return setError("Target must be a whole number.");
      return submit({ array: values, target: Number(target) });
    }
    return submit({ array: values });
  };

  const runTree = (withOrder) => {
    const { values, error: parseError } = parseNumbers(treeText);
    if (parseError) return setError(parseError);
    if (new Set(values).size !== values.length)
      return setError(
        "Tree values must be distinct — node ids are the values.",
      );
    return submit(withOrder ? { values, order } : { values });
  };

  const runGraph = () => {
    if (entry.requiresGoal && !goal)
      return setError(
        "A* needs a goal node: its heuristic measures distance to it.",
      );
    return submit({ start, goal: goal || null });
  };

  const runOperations = () => {
    const { operations, error: parseError } = parseOperations(
      opsText,
      entry.ops,
    );
    if (parseError) return setError(parseError);
    return submit({ operations });
  };

  return (
    <section className="mt-3 rounded-lg border border-white/10 bg-panel/80 p-3 sm:p-4">
      {(entry.input === "array" || entry.input === "search") && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            aria-label="Array values"
            value={arrayText}
            onChange={(event) => setArrayText(event.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" && runArray(entry.input === "search")
            }
            placeholder="42, 17, 68, 9"
            className={`${field} min-w-56 flex-1`}
          />
          {entry.input === "search" && (
            <input
              aria-label="Search target"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder="target"
              className={`${field} w-24`}
            />
          )}
           { entry.input === "search" && (
            <button
              onClick={() => runArray(entry.input === "search")}
              className={`${button} border border-neon bg-neon/10 font-semibold text-white hover:bg-neon/20`}
            >
              <Check size={16} /> Run
            </button>
          )}
          <button
            onClick={() => {
              const values = randomArray();
              setArrayText(values.join(", "));
              setError("");
              onRun(
                entry.input === "search"
                  ? {
                      array: values,
                      target: values[Math.floor(Math.random() * values.length)],
                    }
                  : { array: values },
              );
            }}
            className={`${button} border border-white/15 text-zinc-300 hover:bg-white/10`}
          >
            <Shuffle size={16} /> Random
          </button>
        </div>
      )}

      {entry.input === "graph" && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            Start
            <select
              value={start}
              onChange={(event) => setStart(event.target.value)}
              className={field}
            >
              {nodeIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            Goal
            <select
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              className={field}
            >
              {!entry.requiresGoal && (
                <option value="">none (explore all)</option>
              )}
              {nodeIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={runGraph}
            className={`${button} border border-neon bg-neon/10 font-semibold text-white hover:bg-neon/20`}
          >
            <Check size={16} /> Run
          </button>
          <p className="ml-auto max-w-sm text-xs text-zinc-500">
            {entry.requiresGoal
              ? "A* uses straight-line distance to the goal as its heuristic."
              : "Leave the goal unset to watch the full traversal."}
          </p>
        </div>
      )}

      {(entry.input === "tree" || entry.input === "treeOrder") && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            aria-label="Tree values in level order"
            value={treeText}
            onChange={(event) => setTreeText(event.target.value)}
            className={`${field} min-w-56 flex-1`}
          />
          {entry.input === "treeOrder" && (
            <select
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              className={field}
            >
              <option value="preorder">preorder</option>
              <option value="inorder">inorder</option>
              <option value="postorder">postorder</option>
            </select>
          )}
          <button
            onClick={() => runTree(entry.input === "treeOrder")}
            className={`${button} border border-neon bg-neon/10 font-semibold text-white hover:bg-neon/20`}
          >
            <Check size={16} /> Run
          </button>
          <p className="ml-auto max-w-xs text-xs text-zinc-500">
            Level order: index k has children 2k+1 and 2k+2.
          </p>
        </div>
      )}

      {entry.input === "operations" && (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <textarea
              aria-label="Operations, one per line"
              value={opsText}
              onChange={(event) => setOpsText(event.target.value)}
              rows={5}
              className={`${field} min-w-56 flex-1 resize-y leading-relaxed`}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={runOperations}
                className={`${button} border border-neon bg-neon/10 font-semibold text-white hover:bg-neon/20`}
              >
                <Check size={16} /> Run
              </button>
              <button
                onClick={() => {
                  setOpsText(entry.sample ?? "");
                  setError("");
                }}
                className={`${button} border border-white/15 text-zinc-300 hover:bg-white/10`}
              >
                Demo
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            One operation per line. {algorithm} accepts: {entry.ops.join(", ")}.
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}
