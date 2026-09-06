import { motion, AnimatePresence } from "framer-motion";
import type { VizStep } from "@/types";
import { Lightbulb } from "lucide-react";

interface ExplanationPanelProps {
  step: VizStep;
  currentStep: number;
  totalSteps: number;
}

export function ExplanationPanel({ step, currentStep, totalSteps }: ExplanationPanelProps) {
  const typeColors: Record<string, string> = {
    init: "text-gray-400 bg-gray-500/10",
    base_case: "text-accent-400 bg-accent-500/10",
    compare: "text-warning-400 bg-warning-500/10",
    cell_update: "text-primary-400 bg-primary-500/10",
    result: "text-success-400 bg-success-500/10",
  };

  const typeLabel: Record<string, string> = {
    init: "Init",
    base_case: "Base Case",
    compare: "Compare",
    cell_update: "Update",
    result: "Result",
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <Lightbulb className="w-3.5 h-3.5" />
          Explanation
        </div>
        <span className="text-xs text-gray-600 font-mono">
          Step {currentStep + 1} / {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className={`badge ${typeColors[step.type] ?? "text-gray-400 bg-gray-500/10"}`}>
          {typeLabel[step.type] ?? step.type}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-gray-300 leading-relaxed"
        >
          {step.explanation}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
