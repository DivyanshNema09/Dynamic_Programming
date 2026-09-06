import { motion, AnimatePresence } from "framer-motion";
import type { VizStep } from "@/types";
import { Hash, ArrowRight } from "lucide-react";

interface StatePanelProps {
  step: VizStep;
  stateNotation: string;
  stateDescription: string;
}

export function StatePanel({ step, stateNotation, stateDescription }: StatePanelProps) {
  const { state, dependencies, candidates, result } = step;
  const hasJ = state.j !== undefined;

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <Hash className="w-3.5 h-3.5" />
        State Panel
      </div>

      <div className="bg-bg rounded-lg p-3 border border-bg-border">
        <p className="text-[11px] text-gray-500 mb-1">{stateNotation} means:</p>
        <p className="text-xs text-gray-300 leading-relaxed">{stateDescription}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Current:</span>
          <code className="text-sm font-mono text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">
            {hasJ ? `dp[${state.i}][${state.j}]` : `dp[${state.i}]`}
          </code>
        </div>

        <AnimatePresence mode="wait">
          {dependencies.length > 0 && (
            <motion.div
              key="deps"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5"
            >
              <span className="text-xs text-gray-500">Depends on:</span>
              <div className="flex flex-wrap gap-1.5">
                {dependencies.map((dep, idx) => (
                  <code
                    key={idx}
                    className="text-xs font-mono text-dep-300 bg-dep-500/10 px-2 py-0.5 rounded border border-dep-500/20"
                  >
                    {dep.j !== undefined ? `dp[${dep.i}][${dep.j}]` : `dp[${dep.i}]`}
                  </code>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {candidates && candidates.length > 0 && (
            <motion.div
              key="candidates"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5"
            >
              <span className="text-xs text-gray-500">Candidates:</span>
              <div className="space-y-1">
                {candidates.map((c, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                      result !== undefined && c.value === result && candidates.length > 1
                        ? "bg-result-500/10 text-result-400 border border-result-500/20"
                        : "bg-bg text-gray-400"
                    }`}
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span className="font-mono">{c.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {result !== undefined && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 pt-1"
            >
              <span className="text-xs text-gray-500">Result:</span>
              <motion.code
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-sm font-mono font-semibold text-result-400 bg-result-500/10 px-2 py-0.5 rounded border border-result-500/20"
              >
                {result}
              </motion.code>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
