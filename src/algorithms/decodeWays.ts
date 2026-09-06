import type { Algorithm, VizStep, Language } from "@/types";

export const decodeWays: Algorithm = {
  metadata: {
    id: "decode-ways",
    title: "Decode Ways",
    leetcode: 91,
    difficulty: "Medium",
    pattern: "string-dp",
    dataStructure: "Array",
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    tableType: "1D",
    description: "A message containing letters from A-Z can be encoded into numbers using the mapping A→1, B→2, ..., Z→26. Given a string of digits, determine how many ways it can be decoded.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The number of ways to decode the substring s[0..i-1] (first i characters).",
    },
    transition: {
      notation: "dp[i] = (dp[i-1] if s[i-1] != '0') + (dp[i-2] if 10 ≤ int(s[i-2..i-1]) ≤ 26)",
      description: "Either decode the current digit alone (if not '0') or decode the last two digits together (if 10-26).",
    },
    baseCases: [
      { notation: "dp[0] = 1", description: "Empty string has 1 way to decode (do nothing)." },
      { notation: "dp[1] = 1 if s[0] != '0'", description: "Single valid digit has 1 way." },
    ],
    complexity: {
      time: "O(n)",
      space: "O(n)",
      optimizedSpace: "O(1)",
      optimizationNote: "Only dp[i-1] and dp[i-2] are needed, so two variables suffice.",
    },
    whyDP: [
      "The number of ways to decode the first i characters depends on decodings of shorter prefixes.",
      "Overlapping subproblems: dp[i-1] and dp[i-2] are reused for multiple i values.",
      "Optimal substructure: the total decodings for i characters = decodings ending with 1 digit + decodings ending with 2 digits.",
      "This is a string DP problem with conditional transitions based on digit validity.",
    ],
    commonMistakes: [
      "Not handling '0' correctly (a single '0' cannot be decoded).",
      "Forgetting to check the two-digit range (only 10-26 are valid).",
      "Incorrect base case dp[0] = 0 instead of dp[0] = 1.",
    ],
    input: {
      type: "string",
      default: "226",
      placeholder: "Enter a digit string (e.g., 226)",
      validate: (input) => {
        const s = input.trim();
        return s.length >= 1 && s.length <= 12 && /^[0-9]+$/.test(s);
      },
      parse: (input) => input.trim(),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const s = input as string;
    const n = s.length;
    const steps: VizStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `String: "${s}" (length ${n}). We'll compute dp[i] = number of ways to decode the first i characters.`,
      tableSnapshot1D: [...dp],
    });

    dp[0] = 1;
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: 1,
      activeLine: 4,
      explanation: "Base case: dp[0] = 1. Empty string has 1 way to decode.",
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    dp[1] = s[0] !== "0" ? 1 : 0;
    steps.push({
      type: "base_case",
      state: { i: 1 },
      dependencies: [],
      result: dp[1],
      activeLine: 5,
      explanation: `Base case: dp[1] = ${dp[1]}. ${s[0] !== "0" ? `First digit '${s[0]}' is valid (1-${"A" === "A" ? "Z" : ""}).` : "First digit '0' is invalid."}`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 1 }],
    });

    for (let i = 2; i <= n; i++) {
      const candidates: { source: { i: number }; value: number; label: string }[] = [];
      let result = 0;

      // Single digit decode
      if (s[i - 1] !== "0") {
        const dep1 = { i: i - 1 };
        const val1 = dp[i - 1];
        candidates.push({
          source: dep1,
          value: val1,
          label: `Single digit '${s[i - 1]}': dp[${i - 1}] = ${val1}`,
        });
        result += val1;
      }

      // Two digit decode
      const twoDigit = parseInt(s.substring(i - 2, i));
      if (twoDigit >= 10 && twoDigit <= 26) {
        const dep2 = { i: i - 2 };
        const val2 = dp[i - 2];
        candidates.push({
          source: dep2,
          value: val2,
          label: `Two digits '${s.substring(i - 2, i)}': dp[${i - 2}] = ${val2}`,
        });
        result += val2;
      }

      const deps = candidates.map((c) => c.source);

      steps.push({
        type: "compare",
        state: { i },
        dependencies: deps,
        candidates: candidates.length > 0 ? candidates : [{ source: { i }, value: 0, label: "No valid decoding" }],
        activeLine: 7,
        explanation: `dp[${i}]: Decoding first ${i} chars. ${candidates.length === 0 ? "No valid single or double digit." : candidates.map((c) => c.label).join(" + ")}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [...deps, { i }],
      });

      dp[i] = result;
      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: deps,
        candidates: candidates.length > 0 ? candidates : [{ source: { i }, value: 0, label: "No valid decoding" }],
        result,
        activeLine: 7,
        explanation: `dp[${i}] = ${result}. ${result === 0 ? "No valid decoding for this prefix." : `${result} way(s) to decode first ${i} characters.`}`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    steps.push({
      type: "result",
      state: { i: n },
      dependencies: [],
      result: dp[n],
      activeLine: 9,
      explanation: `Final result: ${dp[n]} way(s) to decode "${s}".`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: n }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def numDecodings(s):",
        "    n = len(s)",
        "    dp = [0] * (n + 1)",
        "    dp[0] = 1",
        "    dp[1] = 1 if s[0] != '0' else 0",
        "    for i in range(2, n + 1):",
        "        if s[i-1] != '0':",
        "            dp[i] += dp[i-1]",
        "        two = int(s[i-2:i])",
        "        if 10 <= two <= 26:",
        "            dp[i] += dp[i-2]",
        "    return dp[n]",
      ];
    }
    if (language === "java") {
      return [
        "public int numDecodings(String s) {",
        "    int n = s.length();",
        "    int[] dp = new int[n + 1];",
        "    dp[0] = 1;",
        "    dp[1] = s.charAt(0) != '0' ? 1 : 0;",
        "    for (int i = 2; i <= n; i++) {",
        "        if (s.charAt(i-1) != '0')",
        "            dp[i] += dp[i-1];",
        "        int two = Integer.parseInt(s.substring(i-2, i));",
        "        if (two >= 10 && two <= 26)",
        "            dp[i] += dp[i-2];",
        "    }",
        "    return dp[n];",
        "}",
      ];
    }
    return [
      "int numDecodings(string s) {",
      "    int n = s.size();",
      "    vector<int> dp(n + 1, 0);",
      "    dp[0] = 1;",
      "    dp[1] = s[0] != '0' ? 1 : 0;",
      "    for (int i = 2; i <= n; i++) {",
      "        if (s[i-1] != '0')",
      "            dp[i] += dp[i-1];",
      "        int two = stoi(s.substr(i-2, 2));",
      "        if (two >= 10 && two <= 26)",
      "            dp[i] += dp[i-2];",
      "    }",
      "    return dp[n];",
      "}",
    ];
  },
};
