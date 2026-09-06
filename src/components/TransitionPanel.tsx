import { motion, AnimatePresence } from "framer-motion";
import type { VizStep } from "@/types";
import { GitBranch, ArrowRight } from "lucide-react";

interface TransitionPanelProps {
  step: VizStep;
  transitionNotation: string;
  transitionDescription: string;
}

export function TransitionPanel({ step, transitionNotation, transitionDescription }: TransitionPanelProps) {
  const { candidates, result, state } = step;
  const hasJ = state.j !== undefined;
  const currentLabel = hasJ ? `dp[${state.i}][${state.j}]` : `dp[${state.i}]`;

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <GitBranch className="w-3.5 h-3.5" />
        Transition
      </div>

      <div className="bg-bg rounded-lg p-3 border border-bg-border">
        <code className="text-xs font-mono text-primary-400 block">{transitionNotation}</code>
        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{transitionDescription}</p>
      </div>

      <AnimatePresence mode="wait">
        {candidates && candidates.length > 0 && (
          <motion.div
            key={step.explanation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="flex flex-col gap-1.5">
              {candidates.map((c, idx) => {
                const isWinner = result !== undefined && c.value === result && candidates.length > 1;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs transition-all ${
                      isWinner
                        ? "bg-result-500/10 border-result-500/30 text-result-400"
                        : "bg-bg border-bg-border text-gray-400"
                    }`}
                  >
                    <span className="font-mono flex-1">{c.label}</span>
                    {isWinner && <ArrowRight className="w-3 h-3" />}
                    {isWinner && <span className="font-mono font-semibold">{c.value}</span>}
                  </div>
                );
              })}
            </div>

            {result !== undefined && candidates.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-1">
                <code className="text-xs text-gray-500 font-mono">
                  {currentLabel} =
                </code>
                <motion.code
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-sm font-mono font-bold text-result-400 bg-result-500/10 px-2 py-0.5 rounded border border-result-500/20"
                >
                  {result}
                </motion.code>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
