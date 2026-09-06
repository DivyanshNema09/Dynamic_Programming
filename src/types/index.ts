export type Difficulty = "Easy" | "Medium" | "Hard";

export type Language = "cpp" | "java" | "python";

export type TableType = "1D" | "2D" | "grid" | "stateMachine" | "tree" | "interval";

export type StepType =
  | "init"
  | "base_case"
  | "cell_update"
  | "compare"
  | "select"
  | "result"
  | "reconstruct"
  | "cache_hit"
  | "cache_store";

export interface CellPos {
  i: number;
  j?: number;
}

export interface Candidate {
  source: CellPos;
  value: number;
  label: string;
}

export interface VizStep {
  type: StepType;
  state: CellPos;
  dependencies: CellPos[];
  candidates?: Candidate[];
  result?: number;
  activeLine: number;
  explanation: string;
  tableSnapshot?: number[][];
  tableSnapshot1D?: number[];
  highlightedCells?: CellPos[];
  pathCells?: CellPos[];
  recursionNode?: {
    id: string;
    label: string;
    parentId: string | null;
    status: "computing" | "completed" | "cached" | "cache_hit";
    value?: number;
  };
}

export interface StateDefinition {
  notation: string;
  description: string;
}

export interface TransitionInfo {
  notation: string;
  description: string;
}

export interface BaseCaseInfo {
  notation: string;
  description: string;
}

export interface ComplexityInfo {
  time: string;
  space: string;
  optimizedSpace?: string;
  optimizationNote?: string;
}

export interface ProblemInput {
  type: "array" | "string" | "twoStrings" | "grid" | "knapsack";
  default: string;
  placeholder: string;
  validate: (input: string) => boolean;
  parse: (input: string) => unknown;
}

export interface ProblemMetadata {
  id: string;
  title: string;
  leetcode: number;
  difficulty: Difficulty;
  pattern: string;
  dataStructure: string;
  companies: string[];
  tableType: TableType;
  description: string;
  stateDefinition: StateDefinition;
  transition: TransitionInfo;
  baseCases: BaseCaseInfo[];
  complexity: ComplexityInfo;
  whyDP: string[];
  commonMistakes: string[];
  input: ProblemInput;
}

export interface Algorithm {
  metadata: ProblemMetadata;
  generateSteps: (input: unknown) => VizStep[];
  getCode: (language: Language) => string[];
}

export interface ProblemRecord {
  metadata: ProblemMetadata;
  algorithm: Algorithm;
}
