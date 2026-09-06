import { useState, useEffect, useRef, useCallback } from "react";
import type { VizStep } from "@/types";

export function useVisualizer(steps: VizStep[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = steps.length;

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 800 / speed);
    } else if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, speed, totalSteps]);

  const next = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) setCurrentStep(0);
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    },
    [totalSteps]
  );

  return {
    steps,
    currentStep,
    step: steps[currentStep],
    totalSteps,
    isPlaying,
    speed,
    setSpeed,
    next,
    prev,
    reset,
    play,
    pause,
    goToStep,
  };
}
