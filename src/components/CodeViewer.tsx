import { motion } from "framer-motion";
import type { Language } from "@/types";
import { Code2 } from "lucide-react";

interface CodeViewerProps {
  code: string[];
  activeLine: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const langLabels: Record<Language, string> = {
  cpp: "C++",
  java: "Java",
  python: "Python",
};

export function CodeViewer({ code, activeLine, language, onLanguageChange }: CodeViewerProps) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-bg-border bg-bg">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <Code2 className="w-3.5 h-3.5" />
          Code
        </div>
        <div className="flex items-center gap-1">
          {(Object.keys(langLabels) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                language === lang
                  ? "bg-primary-600/20 text-primary-400"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {langLabels[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto p-3 bg-bg font-mono text-xs leading-relaxed">
        <pre className="min-w-full">
          {code.map((line, idx) => {
            const isActive = idx === activeLine;
            return (
              <motion.div
                key={idx}
                initial={isActive ? { backgroundColor: "rgba(59,130,246,0.15)" } : false}
                animate={isActive ? { backgroundColor: "rgba(59,130,246,0.15)" } : { backgroundColor: "transparent" }}
                className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                  isActive ? "text-primary-300" : "text-gray-400"
                }`}
              >
                <span className="select-none w-7 text-right pr-2 text-gray-700 shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre">{line || " "}</span>
              </motion.div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
