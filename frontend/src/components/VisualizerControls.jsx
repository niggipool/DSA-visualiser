import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";


const button =
  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40";

export default function VisualizerControls({
  player,
  speed,
  onSpeedChange,
  disabled,
  stepLabel,
}) {
  return (
    <section className="mt-3 rounded-lg border border-white/10 bg-panel/80 p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        {player.playing ? (
          <button
            onClick={player.pause}
            className={`${button} border border-amber-400/50 font-semibold text-amber-200 hover:bg-amber-400/10`}
          >
            <Pause size={16} /> Pause
          </button>
        ) : (
          <button
            onClick={player.play}
            disabled={disabled}
            className={`${button} border border-neon bg-neon/10 font-semibold text-white hover:bg-neon/20`}
          >
            <Play size={16} /> {player.atEnd ? "Replay" : "Play"}
          </button>
        )}

        <button
          onClick={player.previous}
          disabled={disabled || player.atStart}
          className={`${button} border border-white/15 text-zinc-300 hover:bg-white/10`}
        >
          <StepBack size={16} /> Previous
        </button>

        <button
          onClick={player.next}
          disabled={disabled || player.atEnd}
          className={`${button} border border-white/15 text-zinc-300 hover:bg-white/10`}
        >
          <StepForward size={16} /> Next
        </button>

        <button
          onClick={player.reset}
          disabled={disabled}
          className={`${button} border border-white/15 text-zinc-300 hover:bg-white/10`}
        >
          <RotateCcw size={16} /> Reset
        </button>

        <label className="ml-auto flex min-w-48 items-center gap-3 px-1 text-sm text-zinc-400">
          <span>Speed</span>
          <input
            aria-label="Animation speed"
            className="accent-neon"
            type="range"
            min="15"
            max="100"
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
          />
          <span className="font-mono text-xs text-zinc-500">{speed}%</span>
        </label>

        <span className="rounded-md border border-white/10 px-2 py-1.5 font-mono text-xs text-zinc-400">
          {stepLabel}
        </span>
      </div>
    </section>
  );
}
