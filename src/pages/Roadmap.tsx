import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { problemsById } from "@/data/problems";
import { patterns } from "@/data/patterns";
import { Check, Circle, ArrowRight, Target } from "lucide-react";

const roadmapStages = [
  { name: "DP Fundamentals", pattern: null, desc: "Understand state, transition, base cases, and the difference between memoization and tabulation." },
  { name: "1D DP", pattern: "1d-dp", desc: "Single-index problems: Fibonacci, Climbing Stairs, House Robber." },
  { name: "LIS", pattern: "lis", desc: "Increasing subsequence problems with nested-loop transitions." },
  { name: "Grid / 2D DP", pattern: "grid-2d-dp", desc: "Path problems on 2D grids with directional dependencies." },
  { name: "0/1 Knapsack", pattern: "knapsack", desc: "Take-or-leave decisions with capacity constraints." },
  { name: "Unbounded Knapsack", pattern: "unbounded-knapsack", desc: "Items reusable unlimited times — Coin Change." },
  { name: "Subsequence DP", pattern: "subsequence-dp", desc: "Compare two sequences with match/mismatch transitions." },
  { name: "String DP", pattern: "string-dp", desc: "Edit distance, palindromes, and string transformations." },
  { name: "State Machine DP", pattern: "state-machine-dp", desc: "Finite state machines for stock trading problems." },
];

export function Roadmap() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">FANG DP Roadmap</h1>
          <p className="text-sm text-gray-500">
            Follow this progression to go from DP fundamentals to FANG interview readiness.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-bg-border" />

          <div className="space-y-6">
            {roadmapStages.map((stage, idx) => {
              const pattern = stage.pattern ? patterns.find((p) => p.id === stage.pattern) : null;
              const stageProblems = pattern?.problems ?? [];
              return (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative pl-14"
                >
                  {/* Node */}
                  <div className="absolute left-3 top-1 w-5 h-5 rounded-full bg-bg-card border-2 border-primary-500/40 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-primary-400">{idx + 1}</span>
                  </div>

                  <div className="card p-4">
                    <h2 className="text-sm font-semibold text-white mb-1">{stage.name}</h2>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{stage.desc}</p>

                    {stageProblems.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {stageProblems.map((pid) => {
                          const p = problemsById[pid];
                          if (!p) return null;
                          return (
                            <Link
                              key={pid}
                              to={`/visualizer/${pid}`}
                              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg border border-bg-border hover:border-primary-500/30 hover:bg-bg-hover transition-all"
                            >
                              <span className="text-xs text-gray-400 group-hover:text-primary-300">
                                {p.metadata.title}
                              </span>
                              <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-primary-400 transition-colors" />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Final node */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: roadmapStages.length * 0.06 }}
              className="relative pl-14"
            >
              <div className="absolute left-3 top-1 w-5 h-5 rounded-full bg-success-500/20 border-2 border-success-500/50 flex items-center justify-center">
                <Check className="w-3 h-3 text-success-400" />
              </div>
              <div className="card p-4 border-success-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-success-400" />
                  <h2 className="text-sm font-semibold text-success-400">FANG Interview Ready</h2>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You can now recognize DP patterns in new problems, derive states and transitions from scratch,
                  and explain your solution with confidence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
