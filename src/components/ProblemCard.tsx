import { Link } from "react-router-dom";
import type { ProblemMetadata } from "@/types";
import { patternsById } from "@/data/patterns";

interface ProblemCardProps {
  metadata: ProblemMetadata;
}

export function ProblemCard({ metadata }: ProblemCardProps) {
  const pattern = patternsById[metadata.pattern];
  const diffClass =
    metadata.difficulty === "Easy"
      ? "badge-easy"
      : metadata.difficulty === "Medium"
      ? "badge-medium"
      : "badge-hard";

  return (
    <div className="card p-4 hover:border-primary-500/30 hover:bg-bg-hover transition-all duration-200 group">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-white text-sm group-hover:text-primary-300 transition-colors">
            {metadata.title}
          </h3>
          {metadata.leetcode > 0 && (
            <span className="text-[11px] text-gray-600 font-mono">LeetCode #{metadata.leetcode}</span>
          )}
        </div>
        <span className={diffClass}>{metadata.difficulty}</span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {metadata.description}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <span className="badge bg-primary-500/10 text-primary-400 border border-primary-500/20">
          {pattern?.name ?? metadata.pattern}
        </span>
        <span className="badge bg-bg text-gray-500 border border-bg-border">
          {metadata.dataStructure}
        </span>
      </div>

      {metadata.companies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {metadata.companies.slice(0, 3).map((company) => (
            <span key={company} className="text-[10px] text-gray-600">
              {company}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-bg-border">
        <Link
          to={`/visualizer/${metadata.id}`}
          className="btn-primary flex-1 text-xs py-1.5"
        >
          Visualize
        </Link>
      </div>
    </div>
  );
}
