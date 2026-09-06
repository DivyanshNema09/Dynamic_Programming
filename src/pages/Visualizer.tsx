import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { problemsById } from "@/data/problems";
import { patternsById } from "@/data/patterns";
import { useVisualizer } from "@/hooks/useVisualizer";
import { DPTable } from "@/components/DPTable";
import { StatePanel } from "@/components/StatePanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { TransitionPanel } from "@/components/TransitionPanel";
import { CodeViewer } from "@/components/CodeViewer";
import { Controls } from "@/components/Controls";
import { ComplexityCard } from "@/components/ComplexityCard";
import type { Language } from "@/types";
import { ArrowLeft, AlertCircle, Info, X, BookOpen } from "lucide-react";

export function Visualizer() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const problem = problemId ? problemsById[problemId] : undefined;

  const [language, setLanguage] = useState<Language>("python");
  const [inputValue, setInputValue] = useState(problem?.metadata.input.default ?? "");
  const [inputError, setInputError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const steps = useMemo(() => {
    if (!problem) return [];
    try {
      const parsed = problem.metadata.input.parse(inputValue);
      return problem.algorithm.generateSteps(parsed);
    } catch {
      return [];
    }
  }, [problem, inputValue]);

  const viz = useVisualizer(steps);
  const pattern = problem ? patternsById[problem.metadata.pattern] : undefined;

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 text-center max-w-md">
          <AlertCircle className="w-8 h-8 text-error-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-white mb-2">Problem not found</h2>
          <p className="text-sm text-gray-500 mb-4">This DP problem doesn't exist in the library.</p>
          <button onClick={() => navigate("/problems")} className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const meta = problem.metadata;
  const step = viz.step;

  const handleVisualize = () => {
    if (!meta.input.validate(inputValue)) {
      setInputError("Invalid input. Please check the format.");
      return;
    }
    setInputError(null);
  };

  const diffClass =
    meta.difficulty === "Easy" ? "badge-easy" : meta.difficulty === "Medium" ? "badge-medium" : "badge-hard";

  const rowLabels = meta.tableType === "2D" || meta.tableType === "grid"
    ? Array.from({ length: step?.tableSnapshot?.length ?? 0 }, (_, i) => String(i))
    : undefined;
  const colLabels = meta.tableType === "2D" || meta.tableType === "grid"
    ? Array.from({ length: step?.tableSnapshot?.[0]?.length ?? 0 }, (_, j) => String(j))
    : undefined;

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="border-b border-bg-border bg-bg-card/50 backdrop-blur-sm sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate("/problems")} className="btn-ghost px-2 py-2 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-white truncate">{meta.title}</h1>
                <span className={diffClass}>{meta.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                {meta.leetcode > 0 && <span className="font-mono">#{meta.leetcode}</span>}
                <span>·</span>
                <span>{pattern?.name ?? meta.pattern}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowInfo(true)} className="btn-ghost px-2.5 py-2 shrink-0">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Input */}
        <div className="card p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">Input:</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleVisualize}
            placeholder={meta.input.placeholder}
            className="input-field flex-1 min-w-[200px]"
          />
          <button onClick={handleVisualize} className="btn-primary text-xs py-1.5">
            Visualize
          </button>
          {inputError && (
            <span className="text-xs text-error-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {inputError}
            </span>
          )}
        </div>

        {/* Controls */}
        {steps.length > 0 && (
          <Controls
            isPlaying={viz.isPlaying}
            currentStep={viz.currentStep}
            totalSteps={viz.totalSteps}
            speed={viz.speed}
            onPlay={viz.play}
            onPause={viz.pause}
            onNext={viz.next}
            onPrev={viz.prev}
            onReset={viz.reset}
            onSpeedChange={viz.setSpeed}
            onSeek={viz.goToStep}
          />
        )}

        {/* Main visualization */}
        {steps.length > 0 && step && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* DP Table — takes 2 cols on desktop */}
            <div className="lg:col-span-2 card p-4 min-h-[300px] flex items-center justify-center">
              <DPTable step={step} tableType={meta.tableType} rowLabels={rowLabels} colLabels={colLabels} />
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              <StatePanel
                step={step}
                stateNotation={meta.stateDefinition.notation}
                stateDescription={meta.stateDefinition.description}
              />
              <TransitionPanel
                step={step}
                transitionNotation={meta.transition.notation}
                transitionDescription={meta.transition.description}
              />
            </div>
          </div>
        )}

        {/* Explanation + Code */}
        {steps.length > 0 && step && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ExplanationPanel step={step} currentStep={viz.currentStep} totalSteps={viz.totalSteps} />
            <CodeViewer
              code={problem.algorithm.getCode(language)}
              activeLine={step.activeLine}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
        )}

        {/* Complexity */}
        <ComplexityCard complexity={meta.complexity} />

        {steps.length === 0 && (
          <div className="card p-8 text-center">
            <AlertCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Enter valid input and click Visualize to begin.</p>
          </div>
        )}
      </div>

      {/* Info modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowInfo(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">{meta.title}</h2>
              </div>
              <button onClick={() => setShowInfo(false)} className="btn-ghost px-2 py-2">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">{meta.description}</p>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">State Definition</h3>
              <div className="bg-bg rounded-lg p-3 border border-bg-border">
                <code className="text-sm font-mono text-primary-400 block mb-1">{meta.stateDefinition.notation}</code>
                <p className="text-xs text-gray-400">{meta.stateDefinition.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Transition</h3>
              <div className="bg-bg rounded-lg p-3 border border-bg-border">
                <code className="text-sm font-mono text-accent-400 block mb-1">{meta.transition.notation}</code>
                <p className="text-xs text-gray-400">{meta.transition.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Base Cases</h3>
              <div className="space-y-1.5">
                {meta.baseCases.map((bc, idx) => (
                  <div key={idx} className="bg-bg rounded-lg p-2.5 border border-bg-border">
                    <code className="text-xs font-mono text-success-400 block">{bc.notation}</code>
                    <p className="text-[11px] text-gray-500 mt-0.5">{bc.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Why is this DP?</h3>
              <ul className="space-y-1.5">
                {meta.whyDP.map((reason, idx) => (
                  <li key={idx} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-primary-400 shrink-0">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Common Mistakes</h3>
              <ul className="space-y-1.5">
                {meta.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-error-400 shrink-0">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
