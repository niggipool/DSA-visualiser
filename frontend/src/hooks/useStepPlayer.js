import { useCallback, useEffect, useRef, useState } from "react";

export function useStepPlayer(steps, speed) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  const lastFrame = Math.max(steps.length - 1, 0);
  const atEnd = frame >= lastFrame;


  useEffect(() => {
    setFrame(0);
    setPlaying(false);
  }, [steps]);


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
