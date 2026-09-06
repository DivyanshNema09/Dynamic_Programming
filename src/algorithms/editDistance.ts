import type { Algorithm, VizStep, Language } from "@/types";

export const editDistance: Algorithm = {
  metadata: {
    id: "edit-distance",
    title: "Edit Distance",
    leetcode: 72,
    difficulty: "Hard",
    pattern: "string-dp",
    dataStructure: "2D Array",
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    tableType: "2D",
    description: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 to word2.",
    stateDefinition: {
      notation: "dp[i][j]",
      description: "The minimum number of operations to convert the first i characters of word1 to the first j characters of word2.",
    },
    transition: {
      notation: "dp[i][j] = dp[i-1][j-1] (match) or 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) (mismatch)",
      description: "If characters match, no operation needed. If not, take the minimum of delete (top), insert (left), or replace (diagonal) and add 1.",
    },
    baseCases: [
      { notation: "dp[0][j] = j", description: "Converting empty string to j characters requires j insertions." },
      { notation: "dp[i][0] = i", description: "Converting i characters to empty string requires i deletions." },
    ],
    complexity: {
      time: "O(m * n)",
      space: "O(m * n)",
      optimizedSpace: "O(min(m, n))",
      optimizationNote: "Since dp[i] only depends on dp[i-1], we can use two 1D arrays.",
    },
    whyDP: [
      "The edit distance for two prefixes depends on the edit distance of smaller prefixes.",
      "Overlapping subproblems: the same (i, j) prefix pair is reached from different paths.",
      "Optimal substructure: the minimum operations for (i, j) extends the best of three subproblems.",
      "This is the canonical string DP problem — insert, delete, and replace operations.",
    ],
    commonMistakes: [
      "Forgetting to handle the match case separately (should be free, not +1).",
      "Confusing insert and delete directions (insert = left, delete = top).",
      "Not initializing the base cases correctly (dp[0][j] = j, not 0).",
    ],
    input: {
      type: "twoStrings",
      default: "horse\nros",
      placeholder: "Enter two strings separated by a newline",
      validate: (input) => {
        const parts = input.split("\n").filter((s) => s.trim().length > 0);
        return parts.length === 2 && parts.every((s) => s.trim().length <= 12);
      },
      parse: (input) => {
        const parts = input.split("\n").filter((s) => s.trim().length > 0);
        return { word1: parts[0].trim(), word2: parts[1].trim() };
      },
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const { word1, word2 } = input as { word1: string; word2: string };
    const m = word1.length;
    const n = word2.length;
    const steps: VizStep[] = [];
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      type: "init",
      state: { i: 0, j: 0 },
      dependencies: [],
      activeLine: 4,
      explanation: `word1 = "${word1}" (length ${m}), word2 = "${word2}" (length ${n}). We'll fill a (${m + 1})×(${n + 1}) DP table.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    // Base cases
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 0,
      activeLine: 5,
      explanation: `Base case: dp[0][j] = j. Converting "" to j characters needs j insertions.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: Array.from({ length: n + 1 }, (_, j) => ({ i: 0, j })),
    });

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 0,
      activeLine: 6,
      explanation: `Base case: dp[i][0] = i. Converting i characters to "" needs i deletions.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: Array.from({ length: m + 1 }, (_, i) => ({ i, j: 0 })),
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const c1 = word1[i - 1];
        const c2 = word2[j - 1];

        if (c1 === c2) {
          const dep = { i: i - 1, j: j - 1 };
          const result = dp[i - 1][j - 1];

          steps.push({
            type: "compare",
            state: { i, j },
            dependencies: [dep],
            candidates: [{ source: dep, value: result, label: `Match: '${c1}' == '${c2}' → dp[${i - 1}][${j - 1}] = ${result}` }],
            activeLine: 8,
            explanation: `word1[${i - 1}] = '${c1}' matches word2[${j - 1}] = '${c2}'. No operation needed: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${result}.`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [dep, { i, j }],
          });

          dp[i][j] = result;
          steps.push({
            type: "cell_update",
            state: { i, j },
            dependencies: [dep],
            candidates: [{ source: dep, value: result, label: `Match` }],
            result,
            activeLine: 8,
            explanation: `dp[${i}][${j}] = ${result}. Characters match, no cost.`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [{ i, j }],
          });
        } else {
          const depDel = { i: i - 1, j };
          const depIns = { i, j: j - 1 };
          const depRep = { i: i - 1, j: j - 1 };
          const del = dp[i - 1][j];
          const ins = dp[i][j - 1];
          const rep = dp[i - 1][j - 1];
          const result = 1 + Math.min(del, ins, rep);

          steps.push({
            type: "compare",
            state: { i, j },
            dependencies: [depDel, depIns, depRep],
            candidates: [
              { source: depDel, value: 1 + del, label: `Delete '${c1}': dp[${i - 1}][${j}] + 1 = ${del} + 1` },
              { source: depIns, value: 1 + ins, label: `Insert '${c2}': dp[${i}][${j - 1}] + 1 = ${ins} + 1` },
              { source: depRep, value: 1 + rep, label: `Replace '${c1}'→'${c2}': dp[${i - 1}][${j - 1}] + 1 = ${rep} + 1` },
            ],
            activeLine: 10,
            explanation: `word1[${i - 1}] = '${c1}' ≠ word2[${j - 1}] = '${c2}'. Delete (${del}+1), Insert (${ins}+1), or Replace (${rep}+1). Min = ${result}.`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [depDel, depIns, depRep, { i, j }],
          });

          dp[i][j] = result;
          steps.push({
            type: "cell_update",
            state: { i, j },
            dependencies: [depDel, depIns, depRep],
            candidates: [
              { source: depDel, value: 1 + del, label: `Delete` },
              { source: depIns, value: 1 + ins, label: `Insert` },
              { source: depRep, value: 1 + rep, label: `Replace` },
            ],
            result,
            activeLine: 10,
            explanation: `dp[${i}][${j}] = 1 + min(${del}, ${ins}, ${rep}) = ${result}.`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [{ i, j }],
          });
        }
      }
    }

    steps.push({
      type: "result",
      state: { i: m, j: n },
      dependencies: [],
      result: dp[m][n],
      activeLine: 12,
      explanation: `Final result: Edit distance = ${dp[m][n]}. It takes ${dp[m][n]} operations to convert "${word1}" to "${word2}".`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: m, j: n }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def minDistance(word1, word2):",
        "    m, n = len(word1), len(word2)",
        "    dp = [[0] * (n + 1) for _ in range(m + 1)]",
        "    for i in range(m + 1): dp[i][0] = i",
        "    for j in range(n + 1): dp[0][j] = j",
        "    for i in range(1, m + 1):",
        "        for j in range(1, n + 1):",
        "            if word1[i-1] == word2[j-1]:",
        "                dp[i][j] = dp[i-1][j-1]",
        "            else:",
        "                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
        "    return dp[m][n]",
      ];
    }
    if (language === "java") {
      return [
        "public int minDistance(String word1, String word2) {",
        "    int m = word1.length(), n = word2.length();",
        "    int[][] dp = new int[m + 1][n + 1];",
        "    for (int i = 0; i <= m; i++) dp[i][0] = i;",
        "    for (int j = 0; j <= n; j++) dp[0][j] = j;",
        "    for (int i = 1; i <= m; i++) {",
        "        for (int j = 1; j <= n; j++) {",
        "            if (word1.charAt(i-1) == word2.charAt(j-1))",
        "                dp[i][j] = dp[i-1][j-1];",
        "            else",
        "                dp[i][j] = 1 + Math.min(dp[i-1][j],",
        "                    Math.min(dp[i][j-1], dp[i-1][j-1]));",
        "        }",
        "    }",
        "    return dp[m][n];",
        "}",
      ];
    }
    return [
      "int minDistance(string word1, string word2) {",
      "    int m = word1.size(), n = word2.size();",
      "    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));",
      "    for (int i = 0; i <= m; i++) dp[i][0] = i;",
      "    for (int j = 0; j <= n; j++) dp[0][j] = j;",
      "    for (int i = 1; i <= m; i++) {",
      "        for (int j = 1; j <= n; j++) {",
      "            if (word1[i-1] == word2[j-1])",
      "                dp[i][j] = dp[i-1][j-1];",
      "            else",
      "                dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});",
      "        }",
      "    }",
      "    return dp[m][n];",
      "}",
    ];
  },
};
