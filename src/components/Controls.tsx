import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (step: number) => void;
}

const speeds = [0.5, 1, 1.5, 2];

export function Controls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
  onSeek,
}: ControlsProps) {
  return (
    <div className="card p-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <button
          onClick={onReset}
          className="btn-ghost px-2.5 py-2"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="btn-ghost px-2.5 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous Step"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {isPlaying ? (
          <button onClick={onPause} className="btn-primary px-4 py-2" title="Pause">
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={currentStep >= totalSteps - 1 && !isPlaying}
            className="btn-primary px-4 py-2 disabled:opacity-50"
            title="Play"
          >
            <Play className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          className="btn-ghost px-2.5 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next Step"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                speed === s
                  ? "bg-primary-600/20 text-primary-400"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 min-w-[120px]">
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStep}
            onChange={(e) => onSeek(parseInt(e.target.value))}
            className="flex-1 h-1 bg-bg-border rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}
