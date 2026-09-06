import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { problems } from "@/data/problems";
import { patterns } from "@/data/patterns";
import { Trophy, Flame, Brain, Target, Award, TrendingUp } from "lucide-react";

const STORAGE_KEY = "dp-visualizer-progress";

interface ProgressData {
  visualized: string[];
  solved: string[];
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { visualized: [], solved: [] };
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function Progress() {
  const [progress, setProgress] = useState<ProgressData>({ visualized: [], solved: [] });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const toggleVisualized = (id: string) => {
    const updated = {
      ...progress,
      visualized: progress.visualized.includes(id)
        ? progress.visualized.filter((x) => x !== id)
        : [...progress.visualized, id],
    };
    setProgress(updated);
    saveProgress(updated);
  };

  const toggleSolved = (id: string) => {
    const updated = {
      ...progress,
      solved: progress.solved.includes(id)
        ? progress.solved.filter((x) => x !== id)
        : [...progress.solved, id],
    };
    setProgress(updated);
    saveProgress(updated);
  };

  const totalProblems = problems.length;
  const visualizedCount = progress.visualized.length;
  const solvedCount = progress.solved.length;
  const overallPct = Math.round((solvedCount / totalProblems) * 100);

  const patternProgress = patterns.map((p) => {
    const patternProblems = p.problems.map((id) => problems.find((pr) => pr.metadata.id === id)).filter(Boolean);
    const solved = patternProblems.filter((pr) => pr && progress.solved.includes(pr.metadata.id)).length;
    return {
      ...p,
      total: patternProblems.length,
      solved,
      pct: patternProblems.length > 0 ? Math.round((solved / patternProblems.length) * 100) : 0,
    };
  });

  const badges = [
    { name: "DP Beginner", icon: Brain, condition: visualizedCount >= 1, desc: "Visualize your first problem" },
    { name: "Table Builder", icon: TrendingUp, condition: visualizedCount >= 5, desc: "Visualize 5 problems" },
    { name: "Knapsack Master", icon: Award, condition: ["knapsack-01", "partition-equal-subset-sum", "target-sum"].every((id) => progress.solved.includes(id)), desc: "Solve all knapsack problems" },
    { name: "String DP Expert", icon: Award, condition: ["edit-distance", "decode-ways", "longest-palindromic-substring"].every((id) => progress.solved.includes(id)), desc: "Solve all string DP problems" },
    { name: "State Transition Master", icon: Target, condition: solvedCount >= 10, desc: "Solve 10 problems" },
    { name: "FANG DP Ready", icon: Trophy, condition: solvedCount >= problems.length * 0.7, desc: "Solve 70% of all problems" },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Progress Tracking</h1>
          <p className="text-sm text-gray-500">Track your DP mastery and interview readiness.</p>
        </div>

        {/* Overall */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning-400" />
              <h2 className="text-sm font-semibold text-white">DP Mastery</h2>
            </div>
            <span className="text-2xl font-bold text-primary-400">{overallPct}%</span>
          </div>
          <div className="h-3 bg-bg rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500">
            {solvedCount} / {totalProblems} problems solved · {visualizedCount} visualized
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Visualized", value: visualizedCount, icon: Brain, color: "text-primary-400" },
            { label: "Solved", value: solvedCount, icon: Target, color: "text-success-400" },
            { label: "Patterns Touched", value: new Set(progress.solved.map((id) => problems.find((p) => p.metadata.id === id)?.metadata.pattern)).size, icon: TrendingUp, color: "text-accent-400" },
            { label: "Streak", value: 0, icon: Flame, color: "text-warning-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card p-4 text-center">
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Pattern progress */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Pattern Progress</h2>
          <div className="space-y-3">
            {patternProgress.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{p.name}</span>
                  <span className="text-xs text-gray-600 font-mono">{p.solved}/{p.total}</span>
                </div>
                <div className="h-2 bg-bg rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${
                      p.pct === 100 ? "bg-success-500" : p.pct >= 50 ? "bg-primary-500" : "bg-accent-500/60"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map((badge) => {
              const Icon = badge.icon;
              const earned = badge.condition;
              return (
                <div
                  key={badge.name}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    earned
                      ? "bg-primary-500/5 border-primary-500/20"
                      : "bg-bg border-bg-border opacity-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    earned ? "bg-primary-500/15" : "bg-bg-hover"
                  }`}>
                    <Icon className={`w-4 h-4 ${earned ? "text-primary-400" : "text-gray-600"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-medium ${earned ? "text-white" : "text-gray-600"}`}>
                      {badge.name}
                    </div>
                    <div className="text-[10px] text-gray-600 truncate">{badge.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problem checklist */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Problem Checklist</h2>
          <div className="space-y-2">
            {problems.map((p) => {
              const isVisualized = progress.visualized.includes(p.metadata.id);
              const isSolved = progress.solved.includes(p.metadata.id);
              const diffClass = p.metadata.difficulty === "Easy" ? "badge-easy" : p.metadata.difficulty === "Medium" ? "badge-medium" : "badge-hard";
              return (
                <div key={p.metadata.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-hover transition-colors">
                  <button
                    onClick={() => toggleVisualized(p.metadata.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isVisualized ? "bg-accent-500 border-accent-500" : "border-bg-border hover:border-accent-500/50"
                    }`}
                    title="Mark as visualized"
                  >
                    {isVisualized && <span className="text-[10px] text-white">V</span>}
                  </button>
                  <button
                    onClick={() => toggleSolved(p.metadata.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSolved ? "bg-success-500 border-success-500" : "border-bg-border hover:border-success-500/50"
                    }`}
                    title="Mark as solved"
                  >
                    {isSolved && <span className="text-[10px] text-white">S</span>}
                  </button>
                  <Link to={`/visualizer/${p.metadata.id}`} className="flex-1 min-w-0 text-xs text-gray-400 hover:text-primary-300 transition-colors truncate">
                    {p.metadata.title}
                  </Link>
                  <span className={diffClass}>{p.metadata.difficulty}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
