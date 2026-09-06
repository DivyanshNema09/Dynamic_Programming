import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Package,
  Coins,
  Type,
  Grid3x3,
  GitBranch,
  BarChart3,
  Play,
  ArrowRight,
  Code2,
  Eye,
  Zap,
  Trophy,
} from "lucide-react";
import { problems } from "@/data/problems";
import { patterns } from "@/data/patterns";

const patternIcons: Record<string, typeof TrendingUp> = {
  TrendingUp,
  Package,
  Coins,
  Type,
  Grid3x3,
  GitBranch,
  BarChart3,
};

export function Home() {
  const easyCount = problems.filter((p) => p.metadata.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.metadata.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.metadata.difficulty === "Hard").length;

  const heroSteps = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-400 mb-6">
              <Brain className="w-3.5 h-3.5" />
              FANG Interview Preparation Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              Stop Memorizing DP.
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Start Seeing the States.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Visualize states, transitions, recurrence relations, and every decision behind the
              most important Dynamic Programming interview problems.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/visualizer/fibonacci" className="btn-primary">
                <Play className="w-4 h-4" />
                Start Visualizing
              </Link>
              <Link to="/problems" className="btn-accent">
                <Eye className="w-4 h-4" />
                Explore DP Problems
              </Link>
              <Link to="/patterns" className="btn-ghost">
                Learn DP Patterns
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Animated DP table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 card p-6 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-gray-500">Fibonacci DP Table</span>
              <span className="text-xs text-primary-400 font-mono">dp[i] = dp[i-1] + dp[i-2]</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {heroSteps.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 font-mono text-sm ${
                    i === 0
                      ? "border-accent-400/30 bg-accent-500/5 text-gray-400"
                      : i === 1
                      ? "border-accent-400/30 bg-accent-500/5 text-gray-400"
                      : i === heroSteps.length - 1
                      ? "border-primary-400 bg-primary-500/15 text-primary-300"
                      : "border-bg-border bg-bg-hover text-gray-300"
                  }`}
                >
                  <span className="text-[9px] text-gray-600 absolute -mt-5">dp[{i}]</span>
                  {val}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Problems", value: problems.length, icon: Code2 },
            { label: "Patterns", value: patterns.length, icon: Grid3x3 },
            { label: "Easy", value: easyCount, icon: TrendingUp },
            { label: "Medium + Hard", value: mediumCount + hardCount, icon: Zap },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card p-4 text-center">
                <Icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Patterns overview */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">DP Pattern Roadmap</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {patterns.map((pattern, idx) => {
              const Icon = patternIcons[pattern.icon] ?? Grid3x3;
              return (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to="/patterns" className="card p-4 hover:border-primary-500/30 hover:bg-bg-hover transition-all block">
                    <Icon className="w-5 h-5 text-primary-400 mb-2" />
                    <h3 className="text-sm font-medium text-white mb-1">{pattern.name}</h3>
                    <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{pattern.description}</p>
                    <span className="text-[10px] text-gray-600 mt-2 block">{pattern.problems.length} problems</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">What You Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Eye, title: "See Every State", desc: "Watch the DP table fill cell by cell, with dependencies highlighted and arrows showing exactly which previous states feed into the current one." },
              { icon: Code2, title: "Synced Code", desc: "Code in C++, Java, or Python stays perfectly synchronized with the visualization. The exact line responsible for each step lights up." },
              { icon: GitBranch, title: "Understand Transitions", desc: "Every recurrence is broken down: see the candidates, see the comparison, see why a particular value is chosen." },
              { icon: Brain, title: "Why DP?", desc: "Each problem explains why it's DP: overlapping subproblems, optimal substructure, and what information must be remembered." },
              { icon: Trophy, title: "Track Progress", desc: "Monitor your DP mastery across patterns, see which areas need work, and gauge your FANG interview readiness." },
              { icon: Zap, title: "Space Optimization", desc: "See how full DP tables reduce to two variables when only the previous state is needed, and understand why it's safe." },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-5">
                  <Icon className="w-5 h-5 text-accent-400 mb-3" />
                  <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to master DP?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Don't just memorize solutions. Understand the state, derive the transition, and recognize
            the pattern in any new problem.
          </p>
          <Link to="/visualizer/fibonacci" className="btn-primary">
            <Play className="w-4 h-4" />
            Start with Fibonacci
          </Link>
        </div>
      </section>
    </div>
  );
}
