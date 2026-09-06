import type { Algorithm, VizStep, Language } from "@/types";

export const minPathSum: Algorithm = {
  metadata: {
    id: "min-path-sum",
    title: "Minimum Path Sum",
    leetcode: 64,
    difficulty: "Medium",
    pattern: "grid-2d-dp",
    dataStructure: "2D Array",
    companies: ["Amazon", "Google", "Microsoft", "Apple"],
    tableType: "grid",
    description: "Given an m×n grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path. You can only move right or down.",
    stateDefinition: {
      notation: "dp[i][j]",
      description: "The minimum path sum to reach cell (i, j) from the top-left corner.",
    },
    transition: {
      notation: "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
      description: "To reach (i, j), come from above or from the left — whichever has the smaller sum. Add the current cell's value.",
    },
    baseCases: [
      { notation: "dp[0][0] = grid[0][0]", description: "Starting cell: its own value." },
      { notation: "dp[0][j] = grid[0][j] + dp[0][j-1]", description: "Top row: only reachable from the left." },
      { notation: "dp[i][0] = grid[i][0] + dp[i-1][0]", description: "Left column: only reachable from above." },
    ],
    complexity: {
      time: "O(m * n)",
      space: "O(m * n)",
      optimizedSpace: "O(n)",
      optimizationNote: "Since dp[i] only depends on dp[i-1], we can use a single 1D array.",
    },
    whyDP: [
      "The minimum path sum to (i, j) depends on the minimum sums to (i-1, j) and (i, j-1).",
      "Overlapping subproblems: the same cell is reached from different paths.",
      "Optimal substructure: the best path to a cell uses the best path to a previous cell.",
      "This is the canonical weighted grid DP — minimize instead of count.",
    ],
    commonMistakes: [
      "Forgetting to add grid[i][j] to the min of the two neighbors.",
      "Not handling the first row and first column separately (they only have one neighbor).",
      "Using max instead of min.",
    ],
    input: {
      type: "grid",
      default: "1 3 1\n1 5 1\n4 2 1",
      placeholder: "Enter grid rows (space-separated, newlines between rows)",
      validate: (input) => {
        const rows = input.trim().split("\n").map((r) => r.trim().split(/\s+/).map((n) => parseInt(n)));
        if (rows.length < 1) return false;
        const cols = rows[0].length;
        return rows.every((r) => r.length === cols && r.every((n) => !isNaN(n) && n >= 0));
      },
      parse: (input) => {
        const rows = input.trim().split("\n").map((r) => r.trim().split(/\s+/).map((n) => parseInt(n)));
        return rows;
      },
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const grid = input as number[][];
    const m = grid.length;
    const n = grid[0].length;
    const steps: VizStep[] = [];
    const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

    steps.push({
      type: "init",
      state: { i: 0, j: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `Grid: ${m}×${n}. We want the minimum path sum from top-left to bottom-right, moving only right or down.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    // Base case: dp[0][0]
    dp[0][0] = grid[0][0];
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: grid[0][0],
      activeLine: 4,
      explanation: `Base case: dp[0][0] = grid[0][0] = ${grid[0][0]}.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: 0, j: 0 }],
    });

    // Base case: first row
    for (let j = 1; j < n; j++) {
      dp[0][j] = grid[0][j] + dp[0][j - 1];
      steps.push({
        type: "base_case",
        state: { i: 0, j },
        dependencies: [{ i: 0, j: j - 1 }],
        result: dp[0][j],
        activeLine: 5,
        explanation: `dp[0][${j}] = grid[0][${j}] + dp[0][${j - 1}] = ${grid[0][j]} + ${dp[0][j - 1]} = ${dp[0][j]}. Top row: only reachable from the left.`,
        tableSnapshot: dp.map((r) => [...r]),
        highlightedCells: [{ i: 0, j }, { i: 0, j: j - 1 }],
      });
    }

    // Base case: first column
    for (let i = 1; i < m; i++) {
      dp[i][0] = grid[i][0] + dp[i - 1][0];
      steps.push({
        type: "base_case",
        state: { i, j: 0 },
        dependencies: [{ i: i - 1, j: 0 }],
        result: dp[i][0],
        activeLine: 6,
        explanation: `dp[${i}][0] = grid[${i}][0] + dp[${i - 1}][0] = ${grid[i][0]} + ${dp[i - 1][0]} = ${dp[i][0]}. Left column: only reachable from above.`,
        tableSnapshot: dp.map((r) => [...r]),
        highlightedCells: [{ i, j: 0 }, { i: i - 1, j: 0 }],
      });
    }

    // Fill the rest
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const dep1 = { i: i - 1, j };
        const dep2 = { i, j: j - 1 };
        const val1 = dp[i - 1][j];
        const val2 = dp[i][j - 1];
        const minPrev = Math.min(val1, val2);
        const result = grid[i][j] + minPrev;

        steps.push({
          type: "compare",
          state: { i, j },
          dependencies: [dep1, dep2],
          candidates: [
            { source: dep1, value: val1, label: `From above: dp[${i - 1}][${j}] = ${val1}` },
            { source: dep2, value: val2, label: `From left: dp[${i}][${j - 1}] = ${val2}` },
          ],
          activeLine: 8,
          explanation: `Cell (${i}, ${j}) has grid value ${grid[i][j]}. Min of above (${val1}) and left (${val2}) = ${minPrev}.`,
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
          activeLine: 8,
          explanation: `dp[${i}][${j}] = grid[${i}][${j}] + min(${val1}, ${val2}) = ${grid[i][j]} + ${minPrev} = ${result}.`,
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
      activeLine: 10,
      explanation: `Final result: Minimum path sum = ${dp[m - 1][n - 1]}.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: m - 1, j: n - 1 }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def minPathSum(grid):",
        "    m, n = len(grid), len(grid[0])",
        "    dp = [[0] * n for _ in range(m)]",
        "    dp[0][0] = grid[0][0]",
        "    for j in range(1, n): dp[0][j] = grid[0][j] + dp[0][j-1]",
        "    for i in range(1, m): dp[i][0] = grid[i][0] + dp[i-1][0]",
        "    for i in range(1, m):",
        "        for j in range(1, n):",
        "            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
        "    return dp[m-1][n-1]",
      ];
    }
    if (language === "java") {
      return [
        "public int minPathSum(int[][] grid) {",
        "    int m = grid.length, n = grid[0].length;",
        "    int[][] dp = new int[m][n];",
        "    dp[0][0] = grid[0][0];",
        "    for (int j = 1; j < n; j++) dp[0][j] = grid[0][j] + dp[0][j-1];",
        "    for (int i = 1; i < m; i++) dp[i][0] = grid[i][0] + dp[i-1][0];",
        "    for (int i = 1; i < m; i++) {",
        "        for (int j = 1; j < n; j++) {",
        "            dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);",
        "        }",
        "    }",
        "    return dp[m-1][n-1];",
        "}",
      ];
    }
    return [
      "int minPathSum(vector<vector<int>>& grid) {",
      "    int m = grid.size(), n = grid[0].size();",
      "    vector<vector<int>> dp(m, vector<int>(n, 0));",
      "    dp[0][0] = grid[0][0];",
      "    for (int j = 1; j < n; j++) dp[0][j] = grid[0][j] + dp[0][j-1];",
      "    for (int i = 1; i < m; i++) dp[i][0] = grid[i][0] + dp[i-1][0];",
      "    for (int i = 1; i < m; i++) {",
      "        for (int j = 1; j < n; j++) {",
      "            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);",
      "        }",
      "    }",
      "    return dp[m-1][n-1];",
      "}",
    ];
  },
};
