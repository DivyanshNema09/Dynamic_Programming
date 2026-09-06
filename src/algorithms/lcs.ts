import type { Algorithm, VizStep, Language } from "@/types";

export const lcs: Algorithm = {
  metadata: {
    id: "lcs",
    title: "Longest Common Subsequence",
    leetcode: 1143,
    difficulty: "Medium",
    pattern: "subsequence-dp",
    dataStructure: "2D Array",
    companies: ["Google", "Amazon", "Microsoft"],
    tableType: "2D",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order but not necessarily contiguous.",
    stateDefinition: {
      notation: "dp[i][j]",
      description: "The length of the LCS of the first i characters of text1 and the first j characters of text2.",
    },
    transition: {
      notation: "dp[i][j] = dp[i-1][j-1] + 1 (match) or max(dp[i-1][j], dp[i][j-1]) (mismatch)",
      description: "If characters match, extend the diagonal. If not, take the best of skipping one character from either string.",
    },
    baseCases: [
      { notation: "dp[0][j] = 0", description: "LCS with an empty string is 0." },
      { notation: "dp[i][0] = 0", description: "LCS with an empty string is 0." },
    ],
    complexity: {
      time: "O(m * n)",
      space: "O(m * n)",
      optimizedSpace: "O(min(m, n))",
      optimizationNote: "Since dp[i] only depends on dp[i-1], we can use two 1D arrays.",
    },
    whyDP: [
      "The LCS of two prefixes depends on the LCS of smaller prefixes.",
      "Overlapping subproblems: the same (i, j) prefix pair is reached from different paths.",
      "Optimal substructure: if characters match, the best solution extends the diagonal; if not, it's the best of two subproblems.",
      "This is the canonical 2D subsequence DP pattern.",
    ],
    commonMistakes: [
      "Confusing subsequence with substring (subsequence doesn't need to be contiguous).",
      "Using dp[i-1][j-1] on mismatch instead of max(dp[i-1][j], dp[i][j-1]).",
      "Forgetting the +1 when characters match.",
    ],
    input: {
      type: "twoStrings",
      default: "abcde\nace",
      placeholder: "Enter two strings separated by a newline",
      validate: (input) => {
        const parts = input.split("\n").filter((s) => s.trim().length > 0);
        return parts.length === 2 && parts.every((s) => s.trim().length <= 15);
      },
      parse: (input) => {
        const parts = input.split("\n").filter((s) => s.trim().length > 0);
        return { text1: parts[0].trim(), text2: parts[1].trim() };
      },
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const { text1, text2 } = input as { text1: string; text2: string };
    const m = text1.length;
    const n = text2.length;
    const steps: VizStep[] = [];
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      type: "init",
      state: { i: 0, j: 0 },
      dependencies: [],
      activeLine: 4,
      explanation: `text1 = "${text1}" (length ${m}), text2 = "${text2}" (length ${n}). We'll fill a (${m + 1})×(${n + 1}) DP table.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    // Base cases: row 0 and column 0 are all zeros
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 0,
      activeLine: 5,
      explanation: "Base case: dp[0][j] = 0 and dp[i][0] = 0. LCS with an empty string is always 0.",
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: 0, j: 0 }],
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = text1[i - 1];
        const char2 = text2[j - 1];

        if (char1 === char2) {
          const dep = { i: i - 1, j: j - 1 };
          const result = dp[i - 1][j - 1] + 1;

          steps.push({
            type: "compare",
            state: { i, j },
            dependencies: [dep],
            candidates: [
              { source: dep, value: result, label: `Match: '${char1}' == '${char2}' → dp[${i - 1}][${j - 1}] + 1 = ${dp[i - 1][j - 1]} + 1 = ${result}` },
            ],
            activeLine: 7,
            explanation: `text1[${i - 1}] = '${char1}' matches text2[${j - 1}] = '${char2}'. Extend the diagonal: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${result}.`,
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
            activeLine: 7,
            explanation: `dp[${i}][${j}] = ${result}. Characters match, so we extend the LCS by 1.`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [{ i, j }],
          });
        } else {
          const dep1 = { i: i - 1, j };
          const dep2 = { i, j: j - 1 };
          const val1 = dp[i - 1][j];
          const val2 = dp[i][j - 1];
          const result = Math.max(val1, val2);

          steps.push({
            type: "compare",
            state: { i, j },
            dependencies: [dep1, dep2],
            candidates: [
              { source: dep1, value: val1, label: `Skip text1[${i - 1}]: dp[${i - 1}][${j}] = ${val1}` },
              { source: dep2, value: val2, label: `Skip text2[${j - 1}]: dp[${i}][${j - 1}] = ${val2}` },
            ],
            activeLine: 9,
            explanation: `text1[${i - 1}] = '${char1}' ≠ text2[${j - 1}] = '${char2}'. Take max of top (${val1}) and left (${val2}).`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [dep1, dep2, { i, j }],
          });

          dp[i][j] = result;
          steps.push({
            type: "cell_update",
            state: { i, j },
            dependencies: [dep1, dep2],
            candidates: [
              { source: dep1, value: val1, label: `Top` },
              { source: dep2, value: val2, label: `Left` },
            ],
            result,
            activeLine: 9,
            explanation: `dp[${i}][${j}] = max(${val1}, ${val2}) = ${result}.`,
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
      activeLine: 11,
      explanation: `Final result: LCS length = ${dp[m][n]}.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: m, j: n }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def longestCommonSubsequence(text1, text2):",
        "    m, n = len(text1), len(text2)",
        "    dp = [[0] * (n + 1) for _ in range(m + 1)]",
        "    for i in range(1, m + 1):",
        "        for j in range(1, n + 1):",
        "            if text1[i-1] == text2[j-1]:",
        "                dp[i][j] = dp[i-1][j-1] + 1",
        "            else:",
        "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "    return dp[m][n]",
      ];
    }
    if (language === "java") {
      return [
        "public int longestCommonSubsequence(String text1, String text2) {",
        "    int m = text1.length(), n = text2.length();",
        "    int[][] dp = new int[m + 1][n + 1];",
        "    for (int i = 1; i <= m; i++) {",
        "        for (int j = 1; j <= n; j++) {",
        "            if (text1.charAt(i-1) == text2.charAt(j-1))",
        "                dp[i][j] = dp[i-1][j-1] + 1;",
        "            else",
        "                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);",
        "        }",
        "    }",
        "    return dp[m][n];",
        "}",
      ];
    }
    return [
      "int longestCommonSubsequence(string text1, string text2) {",
      "    int m = text1.size(), n = text2.size();",
      "    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));",
      "    for (int i = 1; i <= m; i++) {",
      "        for (int j = 1; j <= n; j++) {",
      "            if (text1[i-1] == text2[j-1])",
      "                dp[i][j] = dp[i-1][j-1] + 1;",
      "            else",
      "                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);",
      "        }",
      "    }",
      "    return dp[m][n];",
      "}",
    ];
  },
};
