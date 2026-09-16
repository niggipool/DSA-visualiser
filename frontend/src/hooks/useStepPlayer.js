import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Replays a backend-generated step array.
 *
 * The whole point is that `frame` is the single source of truth: the rendered
 * array is always `steps[frame].array`, never something accumulated over time.
 * That is what makes Previous Step exact rather than approximate — going back
 * is just decrementing an index, so no state has to be "undone".
 */
export function useStepPlayer(steps, speed) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  const lastFrame = Math.max(steps.length - 1, 0);
  const atEnd = frame >= lastFrame;

  // A new step list means a fresh run.
  useEffect(() => {
    setFrame(0);
    setPlaying(false);
  }, [steps]);

  // Map the 15–100 slider onto a sensible delay. Also handed to the bars as a
  // CSS transition duration so movement finishes before the next step lands.
  const delay = Math.round(900 - speed * 8);
  const transitionMs = Math.max(90, Math.round(delay * 0.75));

  useEffect(() => {
    if (!playing || steps.length === 0) return undefined;
    if (atEnd) {
      setPlaying(false);
      return undefined;
    }
    timerRef.current = window.setTimeout(
      () => setFrame((value) => Math.min(value + 1, lastFrame)),
      delay,
    );
    return () => window.clearTimeout(timerRef.current);
  }, [playing, frame, delay, atEnd, lastFrame, steps.length]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    // Pressing play at the end restarts rather than doing nothing.
    setFrame((value) => (value >= lastFrame ? 0 : value));
    setPlaying(true);
  }, [lastFrame, steps.length]);

  const pause = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setPlaying(false);
  }, []);

  const next = useCallback(() => {
    pause();
    setFrame((value) => Math.min(value + 1, lastFrame));
  }, [lastFrame, pause]);

  const previous = useCallback(() => {
    pause();
    setFrame((value) => Math.max(value - 1, 0));
  }, [pause]);

  const reset = useCallback(() => {
    pause();
    setFrame(0);
  }, [pause]);

  return {
    frame,
    playing,
    atEnd,
    atStart: frame === 0,
    lastFrame,
    transitionMs,
    play,
    pause,
    next,
    previous,
    reset,
  };
}
