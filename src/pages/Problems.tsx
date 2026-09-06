import { useState, useMemo } from "react";
import { problems } from "@/data/problems";
import { patterns } from "@/data/patterns";
import { ProblemCard } from "@/components/ProblemCard";
import { Search } from "lucide-react";
import type { Difficulty } from "@/types";

export function Problems() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "All">("All");
  const [patternFilter, setPatternFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const meta = p.metadata;
      if (difficultyFilter !== "All" && meta.difficulty !== difficultyFilter) return false;
      if (patternFilter !== "All" && meta.pattern !== patternFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          meta.title.toLowerCase().includes(q) ||
          String(meta.leetcode).includes(q) ||
          meta.pattern.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, difficultyFilter, patternFilter]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">DP Problem Library</h1>
          <p className="text-sm text-gray-500">
            {problems.length} curated problems across {patterns.length} patterns
          </p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, LeetCode number, or pattern..."
              className="input-field pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 mr-1">Difficulty:</span>
              {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    difficultyFilter === d
                      ? "bg-primary-600/20 text-primary-400"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-gray-500 mr-1">Pattern:</span>
              <button
                onClick={() => setPatternFilter("All")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  patternFilter === "All"
                    ? "bg-primary-600/20 text-primary-400"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                All
              </button>
              {patterns.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPatternFilter(p.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    patternFilter === p.id
                      ? "bg-primary-600/20 text-primary-400"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProblemCard key={p.metadata.id} metadata={p.metadata} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-sm text-gray-500">No problems match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
