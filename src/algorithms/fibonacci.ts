import type { Algorithm, VizStep, Language } from "@/types";

export const fibonacci: Algorithm = {
  metadata: {
    id: "fibonacci",
    title: "Fibonacci Number",
    leetcode: 509,
    difficulty: "Easy",
    pattern: "1d-dp",
    dataStructure: "Array",
    companies: ["Google", "Microsoft"],
    tableType: "1D",
    description: "The Fibonacci numbers, commonly denoted F(n), form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2) for n > 1.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The i-th Fibonacci number.",
    },
    transition: {
      notation: "dp[i] = dp[i-1] + dp[i-2]",
      description: "Each Fibonacci number is the sum of the two previous Fibonacci numbers.",
    },
    baseCases: [
      { notation: "dp[0] = 0", description: "The 0th Fibonacci number is 0." },
      { notation: "dp[1] = 1", description: "The 1st Fibonacci number is 1." },
    ],
    complexity: {
      time: "O(n)",
      space: "O(n)",
      optimizedSpace: "O(1)",
      optimizationNote: "Since dp[i] only depends on dp[i-1] and dp[i-2], we can use two variables instead of the full array.",
    },
    whyDP: [
      "The problem has overlapping subproblems: F(3) is computed multiple times in the naive recursion.",
      "It has optimal substructure: F(n) can be built from F(n-1) and F(n-2).",
      "The state is a single index i, making it a 1D DP problem.",
    ],
    commonMistakes: [
      "Using wrong base cases (e.g., starting from 1 instead of 0).",
      "Forgetting that the recurrence requires two previous values, not one.",
      "Confusing 0-indexed vs 1-indexed sequences.",
    ],
    input: {
      type: "array",
      default: "10",
      placeholder: "Enter n (e.g., 10)",
      validate: (input) => {
        const n = parseInt(input.trim());
        return !isNaN(n) && n >= 0 && n <= 30;
      },
      parse: (input) => parseInt(input.trim()),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const n = input as number;
    const steps: VizStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `We want to compute F(${n}). We'll build a DP table of size ${n + 1}.`,
      tableSnapshot1D: [...dp],
    });

    // Base case 0
    dp[0] = 0;
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: 0,
      activeLine: 5,
      explanation: "Base case: dp[0] = 0. The 0th Fibonacci number is 0.",
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    if (n >= 1) {
      dp[1] = 1;
      steps.push({
        type: "base_case",
        state: { i: 1 },
        dependencies: [],
        result: 1,
        activeLine: 6,
        explanation: "Base case: dp[1] = 1. The 1st Fibonacci number is 1.",
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i: 1 }],
      });
    }

    for (let i = 2; i <= n; i++) {
      const dep1 = { i: i - 1 };
      const dep2 = { i: i - 2 };
      const val1 = dp[i - 1];
      const val2 = dp[i - 2];
      const result = val1 + val2;

      steps.push({
        type: "compare",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: val1, label: `dp[${i - 1}]` },
          { source: dep2, value: val2, label: `dp[${i - 2}]` },
        ],
        activeLine: 9,
        explanation: `Computing dp[${i}]: We need dp[${i - 1}] = ${val1} and dp[${i - 2}] = ${val2}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [dep1, dep2, { i }],
      });

      dp[i] = result;
      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: val1, label: `dp[${i - 1}]` },
          { source: dep2, value: val2, label: `dp[${i - 2}]` },
        ],
        result,
        activeLine: 9,
        explanation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${val1} + ${val2} = ${result}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    steps.push({
      type: "result",
      state: { i: n },
      dependencies: [],
      result: dp[n],
      activeLine: 12,
      explanation: `Final result: F(${n}) = ${dp[n]}.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: n }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def fib(n):",
        "    if n <= 1:",
        "        return n",
        "    dp = [0] * (n + 1)",
        "    dp[0] = 0",
        "    dp[1] = 1",
        "    for i in range(2, n + 1):",
        "        dp[i] = dp[i-1] + dp[i-2]",
        "    return dp[n]",
      ];
    }
    if (language === "java") {
      return [
        "public int fib(int n) {",
        "    if (n <= 1) return n;",
        "    int[] dp = new int[n + 1];",
        "    dp[0] = 0;",
        "    dp[1] = 1;",
        "    for (int i = 2; i <= n; i++) {",
        "        dp[i] = dp[i-1] + dp[i-2];",
        "    }",
        "    return dp[n];",
        "}",
      ];
    }
    return [
      "int fib(int n) {",
      "    if (n <= 1) return n;",
      "    vector<int> dp(n + 1, 0);",
      "    dp[0] = 0;",
      "    dp[1] = 1;",
      "    for (int i = 2; i <= n; i++) {",
      "        dp[i] = dp[i-1] + dp[i-2];",
      "    }",
      "    return dp[n];",
      "}",
    ];
  },
};
