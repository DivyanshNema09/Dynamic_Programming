import type { ComplexityInfo } from "@/types";
import { Clock, Database, Zap } from "lucide-react";

interface ComplexityCardProps {
  complexity: ComplexityInfo;
}

export function ComplexityCard({ complexity }: ComplexityCardProps) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <Zap className="w-3.5 h-3.5" />
        Complexity
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-bg rounded-lg p-2.5 border border-bg-border">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
            <Clock className="w-3 h-3" />
            Time
          </div>
          <code className="text-sm font-mono text-primary-400">{complexity.time}</code>
        </div>

        <div className="bg-bg rounded-lg p-2.5 border border-bg-border">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
            <Database className="w-3 h-3" />
            Space
          </div>
          <code className="text-sm font-mono text-accent-400">{complexity.space}</code>
        </div>
      </div>

      {complexity.optimizedSpace && (
        <div className="bg-result-500/5 border border-result-500/20 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-[11px] text-result-400 mb-1">
            <Zap className="w-3 h-3" />
            Optimized Space
          </div>
          <code className="text-sm font-mono text-result-400">{complexity.optimizedSpace}</code>
          {complexity.optimizationNote && (
            <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
              {complexity.optimizationNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
