import { motion } from "framer-motion";
import type { VizStep, CellPos, TableType } from "@/types";

interface DPTableProps {
  step: VizStep;
  tableType: TableType;
  rowLabels?: string[];
  colLabels?: string[];
}

function isHighlighted(cell: CellPos, highlights: CellPos[] | undefined): boolean {
  if (!highlights) return false;
  return highlights.some((h) => h.i === cell.i && h.j === cell.j);
}

function isDependency(cell: CellPos, deps: CellPos[] | undefined): boolean {
  if (!deps) return false;
  return deps.some((d) => d.i === cell.i && d.j === cell.j);
}

function isCurrent(cell: CellPos, state: CellPos): boolean {
  return cell.i === state.i && cell.j === state.j;
}

export function DPTable({ step, tableType, rowLabels, colLabels }: DPTableProps) {
  if (tableType === "1D") {
    const data = step.tableSnapshot1D ?? [];
    if (data.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 justify-center items-center p-4">
        {data.map((val, i) => {
          const cell = { i };
          const highlighted = isHighlighted(cell, step.highlightedCells);
          const dep = isDependency(cell, step.dependencies);
          const current = isCurrent(cell, step.state);
          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                current
                  ? "border-primary-400 bg-primary-500/20 text-white scale-110 shadow-lg shadow-primary-500/30"
                  : highlighted
                  ? "border-accent-400 bg-accent-500/15 text-accent-300"
                  : dep
                  ? "border-dep-400 bg-dep-500/15 text-dep-300"
                  : val !== 0
                  ? "border-bg-border bg-bg-hover text-gray-200"
                  : "border-bg-border bg-bg-card text-gray-600"
              }`}
            >
              <span className="text-[10px] text-gray-500 absolute top-0.5 left-1">dp[{i}]</span>
              <span className="font-semibold mt-1">{val === 0 && !highlighted && !current ? "—" : val}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // 2D / grid / stateMachine
  const data = step.tableSnapshot ?? [];
  if (data.length === 0) return null;

  return (
    <div className="overflow-x-auto p-4">
      <table className="border-separate border-spacing-1 mx-auto">
        {colLabels && colLabels.length > 0 && (
          <thead>
            <tr>
              <th className="w-10" />
              {colLabels.map((label, j) => (
                <th key={j} className="text-xs text-gray-500 font-mono px-1 pb-1 text-center w-14">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {rowLabels && rowLabels[i] !== undefined && (
                <td className="text-xs text-gray-500 font-mono pr-2 text-right w-10 align-middle">
                  {rowLabels[i]}
                </td>
              )}
              {row.map((val, j) => {
                const cell = { i, j };
                const highlighted = isHighlighted(cell, step.highlightedCells);
                const dep = isDependency(cell, step.dependencies);
                const current = isCurrent(cell, step.state);
                return (
                  <td key={j}>
                    <motion.div
                      layout
                      initial={{ opacity: 0.5, scale: 0.9 }}
                      animate={{ opacity: 1, scale: current ? 1.08 : 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center justify-center w-14 h-12 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                        current
                          ? "border-primary-400 bg-primary-500/20 text-white shadow-lg shadow-primary-500/20"
                          : highlighted
                          ? "border-accent-400 bg-accent-500/15 text-accent-300"
                          : dep
                          ? "border-dep-400 bg-dep-500/15 text-dep-300"
                          : val !== 0
                          ? "border-bg-border bg-bg-hover text-gray-200"
                          : "border-bg-border bg-bg-card text-gray-600"
                      }`}
                    >
                      {val === 0 && !highlighted && !current ? "—" : val}
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
