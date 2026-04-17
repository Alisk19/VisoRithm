import { useState, useEffect, useRef, useCallback } from 'react';

export function useAnimationEngine() {
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step

  const timerRef = useRef(null);

  const load = useCallback((newSteps) => {
    setSteps(newSteps);
    setStepIndex(0);
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const next = useCallback(() => {
    setStepIndex((idx) => {
      if (idx >= steps.length - 1) {
        pause();
        return idx;
      }
      return idx + 1;
    });
  }, [steps.length, pause]);

  const prev = useCallback(() => {
    setStepIndex((idx) => Math.max(0, idx - 1));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(0);
    pause();
  }, [pause]);

  const play = useCallback(() => {
    if (stepIndex >= steps.length - 1) {
      // If at the end, reset and play
      reset();
    }
    setIsPlaying(true);
  }, [stepIndex, steps.length, reset]);

  // Handle auto-play
  useEffect(() => {
    if (isPlaying) {
      if (stepIndex >= steps.length - 1) {
        pause();
      } else {
        timerRef.current = setInterval(next, speed);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepIndex, steps.length, speed, next, pause]);

  const currentStep = steps[stepIndex] || null;

  return {
    steps,
    currentStep,
    stepIndex,
    isPlaying,
    speed,
    setSpeed,
    load,
    play,
    pause,
    next,
    prev,
    reset
  };
}
