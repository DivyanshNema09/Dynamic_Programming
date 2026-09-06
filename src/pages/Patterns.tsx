import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { patterns } from "@/data/patterns";
import { problemsById } from "@/data/problems";
import {
  TrendingUp,
  BarChart3,
  Grid3x3,
  Package,
  Coins,
  AlignHorizontalJustifyCenter,
  Type,
  GitBranch,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, typeof TrendingUp> = {
  TrendingUp,
  BarChart3,
  Grid3x3,
  Package,
  Coins,
  AlignHorizontalJustifyCenter,
  Type,
  GitBranch,
};

export function Patterns() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">DP Patterns</h1>
          <p className="text-sm text-gray-500">
            Master Dynamic Programming by learning recognizable patterns, not memorizing individual problems.
          </p>
        </div>

        <div className="space-y-4">
          {patterns
            .sort((a, b) => a.order - b.order)
            .map((pattern, idx) => {
              const Icon = iconMap[pattern.icon] ?? Grid3x3;
              return (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-gray-600">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h2 className="text-sm font-semibold text-white">{pattern.name}</h2>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{pattern.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {pattern.problems.map((pid) => {
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
                              <span className={`badge text-[10px] ${
                                p.metadata.difficulty === "Easy" ? "badge-easy" :
                                p.metadata.difficulty === "Medium" ? "badge-medium" : "badge-hard"
                              }`}>
                                {p.metadata.difficulty}
                              </span>
                              <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-primary-400 transition-colors" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
