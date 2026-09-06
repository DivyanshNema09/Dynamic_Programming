import type { Algorithm, VizStep, Language } from "@/types";

export const uniquePaths: Algorithm = {
  metadata: {
    id: "unique-paths",
    title: "Unique Paths",
    leetcode: 62,
    difficulty: "Medium",
    pattern: "grid-2d-dp",
    dataStructure: "2D Array",
    companies: ["Amazon", "Google", "Microsoft"],
    tableType: "grid",
    description: "A robot is located at the top-left corner of an m×n grid. The robot can only move right or down. How many possible unique paths are there to reach the bottom-right corner?",
    stateDefinition: {
      notation: "dp[i][j]",
      description: "The number of unique paths to reach cell (i, j) from the top-left corner.",
    },
    transition: {
      notation: "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
      description: "You can reach (i, j) from above (i-1, j) or from the left (i, j-1). Sum both.",
    },
    baseCases: [
      { notation: "dp[0][j] = 1", description: "Only one way along the top row: all right moves." },
      { notation: "dp[i][0] = 1", description: "Only one way along the left column: all down moves." },
    ],
    complexity: {
      time: "O(m * n)",
      space: "O(m * n)",
      optimizedSpace: "O(n)",
      optimizationNote: "Since dp[i] only depends on dp[i-1], we can use a single 1D array.",
    },
    whyDP: [
      "The number of paths to (i, j) depends on the paths to (i-1, j) and (i, j-1).",
      "Overlapping subproblems: the same cell is reached from different paths.",
      "Optimal substructure: total paths to a cell = paths from above + paths from the left.",
      "This is the canonical grid DP pattern — only right and down moves.",
    ],
    commonMistakes: [
      "Forgetting that the first row and first column must be initialized to 1 (not 0).",
      "Allowing moves in all 4 directions (the robot can only move right or down).",
      "Using dp[i-1][j-1] instead of dp[i-1][j] + dp[i][j-1].",
    ],
    input: {
      type: "array",
      default: "3,7",
      placeholder: "Enter m,n (e.g., 3,7)",
      validate: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return parts.length === 2 && parts.every((n) => !isNaN(n) && n >= 1 && n <= 10);
      },
      parse: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return { m: parts[0], n: parts[1] };
      },
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const { m, n } = input as { m: number; n: number };
    const steps: VizStep[] = [];
    const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

    steps.push({
      type: "init",
      state: { i: 0, j: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `Grid size: ${m}×${n}. We want the number of unique paths from top-left to bottom-right, moving only right or down.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    // Base cases: first row
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 1,
      activeLine: 4,
      explanation: "Base case: dp[0][j] = 1 for all j. Only one way along the top row (all right moves).",
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: Array.from({ length: n }, (_, j) => ({ i: 0, j })),
    });

    // Base cases: first column
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 1,
      activeLine: 5,
      explanation: "Base case: dp[i][0] = 1 for all i. Only one way along the left column (all down moves).",
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: Array.from({ length: m }, (_, i) => ({ i, j: 0 })),
    });

    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const dep1 = { i: i - 1, j };
        const dep2 = { i, j: j - 1 };
        const val1 = dp[i - 1][j];
        const val2 = dp[i][j - 1];
        const result = val1 + val2;

        steps.push({
          type: "compare",
          state: { i, j },
          dependencies: [dep1, dep2],
          candidates: [
            { source: dep1, value: val1, label: `From above: dp[${i - 1}][${j}] = ${val1}` },
            { source: dep2, value: val2, label: `From left: dp[${i}][${j - 1}] = ${val2}` },
          ],
          activeLine: 7,
          explanation: `Cell (${i}, ${j}): Paths from above (${val1}) + paths from left (${val2}).`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [dep1, dep2, { i, j }],
        });

        dp[i][j] = result;
        steps.push({
          type: "cell_update",
          state: { i, j },
          dependencies: [dep1, dep2],
          candidates: [
            { source: dep1, value: val1, label: `Above` },
            { source: dep2, value: val2, label: `Left` },
          ],
          result,
          activeLine: 7,
          explanation: `dp[${i}][${j}] = ${val1} + ${val2} = ${result}.`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [{ i, j }],
        });
      }
    }

    steps.push({
      type: "result",
      state: { i: m - 1, j: n - 1 },
      dependencies: [],
      result: dp[m - 1][n - 1],
      activeLine: 9,
      explanation: `Final result: ${dp[m - 1][n - 1]} unique paths to reach the bottom-right corner.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: m - 1, j: n - 1 }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def uniquePaths(m, n):",
        "    dp = [[1] * n for _ in range(m)]",
        "    for i in range(1, m):",
        "        for j in range(1, n):",
        "            dp[i][j] = dp[i-1][j] + dp[i][j-1]",
        "    return dp[m-1][n-1]",
      ];
    }
    if (language === "java") {
      return [
        "public int uniquePaths(int m, int n) {",
        "    int[][] dp = new int[m][n];",
        "    for (int j = 0; j < n; j++) dp[0][j] = 1;",
        "    for (int i = 0; i < m; i++) dp[i][0] = 1;",
        "    for (int i = 1; i < m; i++) {",
        "        for (int j = 1; j < n; j++) {",
        "            dp[i][j] = dp[i-1][j] + dp[i][j-1];",
        "        }",
        "    }",
        "    return dp[m-1][n-1];",
        "}",
      ];
    }
    return [
      "int uniquePaths(int m, int n) {",
      "    vector<vector<int>> dp(m, vector<int>(n, 1));",
      "    for (int i = 1; i < m; i++) {",
      "        for (int j = 1; j < n; j++) {",
      "            dp[i][j] = dp[i-1][j] + dp[i][j-1];",
      "        }",
      "    }",
      "    return dp[m-1][n-1];",
      "}",
    ];
  },
};
