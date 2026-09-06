import type { Algorithm, VizStep, Language } from "@/types";

export const longestPalindromicSubstring: Algorithm = {
  metadata: {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    leetcode: 5,
    difficulty: "Medium",
    pattern: "string-dp",
    dataStructure: "2D Array",
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    tableType: "2D",
    description: "Given a string s, return the longest palindromic substring in s. A palindrome reads the same forwards and backwards.",
    stateDefinition: {
      notation: "dp[i][j]",
      description: "Whether the substring s[i..j] is a palindrome (true/false).",
    },
    transition: {
      notation: "dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]",
      description: "A substring is a palindrome if its ends match and the inner substring is also a palindrome.",
    },
    baseCases: [
      { notation: "dp[i][i] = true", description: "Every single character is a palindrome." },
      { notation: "dp[i][i+1] = (s[i] == s[i+1])", description: "Two characters form a palindrome if they match." },
    ],
    complexity: {
      time: "O(n²)",
      space: "O(n²)",
      optimizationNote: "An expand-from-center approach can reduce space to O(1), but the DP approach is more systematic.",
    },
    whyDP: [
      "Whether s[i..j] is a palindrome depends on whether s[i+1..j-1] is a palindrome and s[i] == s[j].",
      "Overlapping subproblems: the same inner substrings are checked multiple times.",
      "Optimal substructure: a longer palindrome is built from shorter palindromes.",
      "This is interval DP — we build from smaller intervals to larger ones.",
    ],
    commonMistakes: [
      "Filling the table in the wrong order (must go by interval length, not row-by-row).",
      "Forgetting the two-character base case.",
      "Not tracking the longest palindrome found, just the boolean table.",
    ],
    input: {
      type: "string",
      default: "babad",
      placeholder: "Enter a string (e.g., babad)",
      validate: (input) => {
        const s = input.trim();
        return s.length >= 1 && s.length <= 12;
      },
      parse: (input) => input.trim(),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const s = input as string;
    const n = s.length;
    const steps: VizStep[] = [];
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    let bestStart = 0;
    let bestLen = 1;

    steps.push({
      type: "init",
      state: { i: 0, j: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `String: "${s}" (length ${n}). We'll check all substrings s[i..j] for palindromes, starting from the smallest intervals.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    // Base case: length 1 palindromes
    for (let i = 0; i < n; i++) {
      dp[i][i] = 1;
    }
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 1,
      activeLine: 4,
      explanation: "Base case: dp[i][i] = true for all i. Every single character is a palindrome of length 1.",
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: Array.from({ length: n }, (_, i) => ({ i, j: i })),
    });

    // Base case: length 2 palindromes
    if (n >= 2) {
      for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
          dp[i][i + 1] = 1;
          bestStart = i;
          bestLen = 2;
        }
      }
      steps.push({
        type: "base_case",
        state: { i: 0, j: 1 },
        dependencies: [],
        result: 1,
        activeLine: 5,
        explanation: `Base case: dp[i][i+1] = (s[i] == s[i+1]). Two-character palindromes: ${Array.from({ length: n - 1 }, (_, i) => `${s[i]}${s[i + 1]}`).filter((_, i) => s[i] === s[i + 1]).length} found.`,
        tableSnapshot: dp.map((r) => [...r]),
        highlightedCells: Array.from({ length: n - 1 }, (_, i) => ({ i, j: i + 1 })),
      });
    }

    // Fill by interval length
    for (let len = 3; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        const dep = { i: i + 1, j: j - 1 };
        const innerPalindrome = dp[i + 1][j - 1];
        const endsMatch = s[i] === s[j];
        const result = endsMatch && innerPalindrome ? 1 : 0;

        steps.push({
          type: "compare",
          state: { i, j },
          dependencies: [dep],
          candidates: [
            { source: dep, value: innerPalindrome, label: `Inner s[${i + 1}..${j - 1}] palindrome: ${innerPalindrome ? "yes" : "no"}` },
            { source: { i, j }, value: endsMatch ? 1 : 0, label: `Ends match: s[${i}]='${s[i]}' vs s[${j}]='${s[j]}': ${endsMatch ? "yes" : "no"}` },
          ],
          activeLine: 7,
          explanation: `Checking s[${i}..${j}] = "${s.substring(i, j + 1)}". Ends: '${s[i]}' vs '${s[j]}' ${endsMatch ? "match" : "don't match"}. Inner palindrome: ${innerPalindrome ? "yes" : "no"}.`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [dep, { i, j }],
        });

        dp[i][j] = result;
        if (result && len > bestLen) {
          bestStart = i;
          bestLen = len;
        }
        steps.push({
          type: "cell_update",
          state: { i, j },
          dependencies: [dep],
          candidates: [
            { source: dep, value: innerPalindrome, label: `Inner` },
            { source: { i, j }, value: endsMatch ? 1 : 0, label: `Ends` },
          ],
          result,
          activeLine: 7,
          explanation: `dp[${i}][${j}] = ${result ? "true" : "false"}. "${s.substring(i, j + 1)}" ${result ? "IS a palindrome." : "is NOT a palindrome."} ${result && len > bestLen - 1 ? "New longest!" : ""}`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [{ i, j }],
        });
      }
    }

    const answer = s.substring(bestStart, bestStart + bestLen);
    steps.push({
      type: "result",
      state: { i: bestStart, j: bestStart + bestLen - 1 },
      dependencies: [],
      result: bestLen,
      activeLine: 10,
      explanation: `Final result: Longest palindromic substring = "${answer}" (length ${bestLen}).`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: bestStart, j: bestStart + bestLen - 1 }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def longestPalindrome(s):",
        "    n = len(s)",
        "    dp = [[False] * n for _ in range(n)]",
        "    for i in range(n): dp[i][i] = True",
        "    for i in range(n-1):",
        "        if s[i] == s[i+1]: dp[i][i+1] = True",
        "    for length in range(3, n+1):",
        "        for i in range(n - length + 1):",
        "            j = i + length - 1",
        "            dp[i][j] = (s[i] == s[j]) and dp[i+1][j-1]",
        "    return dp  # find max length true cell",
      ];
    }
    if (language === "java") {
      return [
        "public String longestPalindrome(String s) {",
        "    int n = s.length();",
        "    boolean[][] dp = new boolean[n][n];",
        "    for (int i = 0; i < n; i++) dp[i][i] = true;",
        "    for (int i = 0; i < n - 1; i++)",
        "        if (s.charAt(i) == s.charAt(i+1)) dp[i][i+1] = true;",
        "    for (int len = 3; len <= n; len++) {",
        "        for (int i = 0; i <= n - len; i++) {",
        "            int j = i + len - 1;",
        "            dp[i][j] = s.charAt(i) == s.charAt(j) && dp[i+1][j-1];",
        "        }",
        "    }",
        "    // find max length true cell",
        "    return result;",
        "}",
      ];
    }
    return [
      "string longestPalindrome(string s) {",
      "    int n = s.size();",
      "    vector<vector<bool>> dp(n, vector<bool>(n, false));",
      "    for (int i = 0; i < n; i++) dp[i][i] = true;",
      "    for (int i = 0; i < n-1; i++)",
      "        if (s[i] == s[i+1]) dp[i][i+1] = true;",
      "    for (int len = 3; len <= n; len++) {",
      "        for (int i = 0; i <= n - len; i++) {",
      "            int j = i + len - 1;",
      "            dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1];",
      "        }",
      "    }",
      "    // find max length true cell",
      "    return result;",
      "}",
    ];
  },
};
