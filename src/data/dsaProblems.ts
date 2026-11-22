import type { DsaProblem } from '../types/course';

export const DSA_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-normalize-prompt',
    title: 'Clean & Normalize Training Text',
    moduleId: 'mod-04-variables-types',
    difficulty: 'Easy',
    pattern: 'String Parsing',
    estimatedMinutes: 8,
    aiContext:
      'Before sending scraped documents to an embedding model, clean extra spaces, newlines, and normalize casing so identical queries produce identical vectors.',
    description:
      'Write a function `normalize_prompt(text: str) -> str` that strips leading/trailing whitespace, collapses any consecutive whitespace (spaces, tabs, newlines) into a single space, and converts the result to lowercase.',
    constraints: [
      '0 <= len(text) <= 10,000',
      'Must handle empty strings or whitespace-only strings by returning ""',
    ],
    functionName: 'normalize_prompt',
    starterCode: `def normalize_prompt(text: str) -> str:
    # Return lowercase text with single spaces between words
    pass
`,
    solutionCode: `def normalize_prompt(text: str) -> str:
    return " ".join(text.split()).lower()
`,
    complexity: 'Time O(n) · Space O(n)',
    testCases: [
      {
        name: 'Collapses spaces and newlines',
        callExpression: 'normalize_prompt("  Learn   Python\\nfor   AI  ")',
        expectedJson: '"learn python for ai"',
      },
      {
        name: 'Handles tabs and mixed case',
        callExpression: 'normalize_prompt("\\tRAG\\tPipeline\\tV2 ")',
        expectedJson: '"rag pipeline v2"',
      },
      {
        name: 'Handles whitespace-only string',
        callExpression: 'normalize_prompt("   \\n\\t  ")',
        expectedJson: '""',
      },
    ],
  },
  {
    id: 'dsa-valid-palindrome-clean',
    title: 'Alphanumeric Palindrome Check',
    moduleId: 'mod-04-variables-types',
    difficulty: 'Easy',
    pattern: 'Two Pointers',
    estimatedMinutes: 10,
    aiContext:
      'Classic two-pointer string scanning technique used in token validation and technical coding interviews.',
    description:
      'Write `is_clean_palindrome(s: str) -> bool` that returns `True` if `s` reads the same forward and backward after ignoring all non-alphanumeric characters and case differences.',
    constraints: ['Ignore spaces, punctuation, and letter casing', 'Empty or single alphanumeric character counts as True'],
    functionName: 'is_clean_palindrome',
    starterCode: `def is_clean_palindrome(s: str) -> bool:
    # Use two pointers or filtered characters
    pass
`,
    solutionCode: `def is_clean_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
`,
    complexity: 'Time O(n) · Space O(1)',
    testCases: [
      {
        name: 'Classic phrase with punctuation',
        callExpression: 'is_clean_palindrome("A man, a plan, a canal: Panama")',
        expectedJson: 'true',
      },
      {
        name: 'Non-palindrome phrase',
        callExpression: 'is_clean_palindrome("python for ai")',
        expectedJson: 'false',
      },
      {
        name: 'Only punctuation is palindrome',
        callExpression: 'is_clean_palindrome(".,!")',
        expectedJson: 'true',
      },
    ],
  },
  {
    id: 'dsa-token-frequency',
    title: 'Token Frequency Counter',
    moduleId: 'mod-08-dicts-json',
    difficulty: 'Easy',
    pattern: 'Hash Map',
    estimatedMinutes: 10,
    aiContext:
      'Counting term frequencies is the core first step of TF-IDF retrieval, keyword indexing, and stop-word analysis.',
    description:
      'Write `count_tokens(text: str, stop_words: list[str]) -> dict[str, int]` that splits `text` by whitespace, lowercases each token, ignores any token present in `stop_words` (case-insensitive), and returns a dictionary mapping each remaining token to its count.',
    constraints: ['Use a set for stop_words for O(1) lookup', 'Return {} for empty text'],
    functionName: 'count_tokens',
    starterCode: `def count_tokens(text: str, stop_words: list[str]) -> dict[str, int]:
    # Count non-stopword lowercase tokens
    pass
`,
    solutionCode: `def count_tokens(text: str, stop_words: list[str]) -> dict[str, int]:
    blocked = {w.lower() for w in stop_words}
    counts: dict[str, int] = {}
    for token in text.lower().split():
        if token not in blocked:
            counts[token] = counts.get(token, 0) + 1
    return counts
`,
    complexity: 'Time O(n + m) · Space O(n + m)',
    testCases: [
      {
        name: 'Counts tokens excluding stop words',
        callExpression: 'count_tokens("AI agents use Python and Python powers AI", ["and", "use"])',
        expectedJson: '{"ai": 2, "agents": 1, "python": 2, "powers": 1}',
      },
      {
        name: 'Case-insensitive stop word matching',
        callExpression: 'count_tokens("The model and the prompt", ["THE", "and"])',
        expectedJson: '{"model": 1, "prompt": 1}',
      },
      {
        name: 'Empty input returns empty dict',
        callExpression: 'count_tokens("", ["the"])',
        expectedJson: '{}',
      },
    ],
  },
  {
    id: 'dsa-two-sum-budget',
    title: 'Two-Sum Token Budget Pair',
    moduleId: 'mod-08-dicts-json',
    difficulty: 'Easy',
    pattern: 'Hash Map',
    estimatedMinutes: 12,
    aiContext:
      'Packing two candidate context chunks whose token counts sum exactly to a remaining budget slot—also the #1 most frequent coding interview warm-up.',
    description:
      'Given a list of integer chunk sizes `tokens` and an integer `budget`, write `find_budget_pair(tokens: list[int], budget: int) -> list[int]` returning the two distinct indices `[i, j]` (`i < j`) whose values sum to `budget`. Return `[]` if no such pair exists.',
    constraints: ['Aim for O(n) single-pass hash map solution', 'Each element may be used at most once'],
    functionName: 'find_budget_pair',
    starterCode: `def find_budget_pair(tokens: list[int], budget: int) -> list[int]:
    # Map seen token size -> index for O(n) lookup
    pass
`,
    solutionCode: `def find_budget_pair(tokens: list[int], budget: int) -> list[int]:
    seen: dict[int, int] = {}
    for idx, val in enumerate(tokens):
        needed = budget - val
        if needed in seen:
            return [seen[needed], idx]
        seen[val] = idx
    return []
`,
    complexity: 'Time O(n) · Space O(n)',
    testCases: [
      {
        name: 'Finds valid pair indices',
        callExpression: 'find_budget_pair([120, 450, 380, 200], 500)',
        expectedJson: '[0, 2]',
      },
      {
        name: 'Handles duplicate values properly',
        callExpression: 'find_budget_pair([250, 100, 250], 500)',
        expectedJson: '[0, 2]',
      },
      {
        name: 'Returns empty list when no pair matches',
        callExpression: 'find_budget_pair([100, 200, 350], 999)',
        expectedJson: '[]',
      },
    ],
  },
  {
    id: 'dsa-dedup-doc-ids',
    title: 'Order-Preserving RAG Deduplication',
    moduleId: 'mod-07-lists-tuples-sets',
    difficulty: 'Easy',
    pattern: 'Set',
    estimatedMinutes: 8,
    aiContext:
      'Merging hybrid search results often yields duplicate document IDs; you must strip duplicates without scrambling relevance rank order.',
    description:
      'Write `dedup_preserve_order(doc_ids: list[str]) -> list[str]` that returns a new list containing only the first occurrence of each ID in its original order.',
    constraints: ['Must run in O(n) time', 'Do not mutate the input list'],
    functionName: 'dedup_preserve_order',
    starterCode: `def dedup_preserve_order(doc_ids: list[str]) -> list[str]:
    # Track seen IDs in a set while preserving order
    pass
`,
    solutionCode: `def dedup_preserve_order(doc_ids: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for doc_id in doc_ids:
        if doc_id not in seen:
            seen.add(doc_id)
            result.append(doc_id)
    return result
`,
    complexity: 'Time O(n) · Space O(n)',
    testCases: [
      {
        name: 'Preserves relevance order while removing duplicates',
        callExpression: 'dedup_preserve_order(["d3", "d1", "d3", "d2", "d1"])',
        expectedJson: '["d3", "d1", "d2"]',
      },
      {
        name: 'Empty list returns empty list',
        callExpression: 'dedup_preserve_order([])',
        expectedJson: '[]',
      },
      {
        name: 'All unique items unchanged',
        callExpression: 'dedup_preserve_order(["a", "b", "c"])',
        expectedJson: '["a", "b", "c"]',
      },
    ],
  },
  {
    id: 'dsa-balanced-prompt-tags',
    title: 'Balanced Prompt Brackets Validator',
    moduleId: 'mod-05-control-flow',
    difficulty: 'Easy',
    pattern: 'Stack',
    estimatedMinutes: 12,
    aiContext:
      'Prompt templates mix `{variables}`, `[lists]`, and `(groups)`. Validating nested delimiters with a stack prevents malformed JSON and template injection bugs.',
    description:
      'Write `has_balanced_brackets(template: str) -> bool` that ignores non-bracket characters and returns `True` if all `()`, `[]`, and `{}` pairs in `template` are properly opened and closed in LIFO order.',
    constraints: ['Ignore ordinary text characters inside template', 'Empty string returns True'],
    functionName: 'has_balanced_brackets',
    starterCode: `def has_balanced_brackets(template: str) -> bool:
    # Use a list as a LIFO stack
    pass
`,
    solutionCode: `def has_balanced_brackets(template: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    opens = set(pairs.values())
    stack: list[str] = []
    for ch in template:
        if ch in opens:
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return len(stack) == 0
`,
    complexity: 'Time O(n) · Space O(n)',
    testCases: [
      {
        name: 'Valid nested JSON prompt template',
        callExpression: 'has_balanced_brackets("Respond with {\\"items\\": [1, (2 + 3)]}")',
        expectedJson: 'true',
      },
      {
        name: 'Mismatched closing bracket',
        callExpression: 'has_balanced_brackets("Prompt {var] broken")',
        expectedJson: 'false',
      },
      {
        name: 'Unclosed opening bracket',
        callExpression: 'has_balanced_brackets("List: [a, b")',
        expectedJson: 'false',
      },
    ],
  },
  {
    id: 'dsa-sliding-window-chunks',
    title: 'Max Token Window Sum',
    moduleId: 'mod-06-loops',
    difficulty: 'Medium',
    pattern: 'Sliding Window',
    estimatedMinutes: 14,
    aiContext:
      'Sliding windows power overlapping text chunkers and help find the highest-density segment of consecutive sentences within a fixed context window.',
    description:
      'Given a list of sentence scores `scores: list[int]` and window length `k: int`, write `max_window_score(scores: list[int], k: int) -> int` returning the maximum sum of any `k` consecutive elements. Return `0` if `k <= 0` or `k > len(scores)`.',
    constraints: ['Solve in O(n) using a sliding window rather than O(n*k) nested loops'],
    functionName: 'max_window_score',
    starterCode: `def max_window_score(scores: list[int], k: int) -> int:
    # Maintain a running window sum in O(n)
    pass
`,
    solutionCode: `def max_window_score(scores: list[int], k: int) -> int:
    if k <= 0 or k > len(scores):
        return 0
    window_sum = sum(scores[:k])
    best = window_sum
    for i in range(k, len(scores)):
        window_sum += scores[i] - scores[i - k]
        if window_sum > best:
            best = window_sum
    return best
`,
    complexity: 'Time O(n) · Space O(1)',
    testCases: [
      {
        name: 'Finds peak contiguous window',
        callExpression: 'max_window_score([2, 1, 5, 1, 3, 2], 3)',
        expectedJson: '9',
      },
      {
        name: 'Handles negative scores cleanly',
        callExpression: 'max_window_score([-4, -1, -2, -5], 2)',
        expectedJson: '-3',
      },
      {
        name: 'Returns 0 when k exceeds length',
        callExpression: 'max_window_score([4, 5], 4)',
        expectedJson: '0',
      },
    ],
  },
  {
    id: 'dsa-merge-sorted-latencies',
    title: 'Merge Sorted Latency Logs',
    moduleId: 'mod-06-loops',
    difficulty: 'Easy',
    pattern: 'Two Pointers',
    estimatedMinutes: 12,
    aiContext:
      'Merging pre-sorted timestamped telemetry streams from two inference servers without re-sorting from scratch.',
    description:
      'Write `merge_sorted(a: list[int], b: list[int]) -> list[int]` that merges two already-sorted integer lists into a single sorted list in O(n + m) linear time without calling `.sort()` or `sorted()`.',
    constraints: ['Both input lists are sorted in ascending order', 'Do not mutate inputs'],
    functionName: 'merge_sorted',
    starterCode: `def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    # Merge two sorted lists using two indices i and j
    pass
`,
    solutionCode: `def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    i, j = 0, 0
    merged: list[int] = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            merged.append(a[i])
            i += 1
        else:
            merged.append(b[j])
            j += 1
    merged.extend(a[i:])
    merged.extend(b[j:])
    return merged
`,
    complexity: 'Time O(n + m) · Space O(n + m)',
    testCases: [
      {
        name: 'Interleaves two sorted lists',
        callExpression: 'merge_sorted([12, 45, 90], [20, 45, 110])',
        expectedJson: '[12, 20, 45, 45, 90, 110]',
      },
      {
        name: 'Handles one empty list',
        callExpression: 'merge_sorted([], [5, 10])',
        expectedJson: '[5, 10]',
      },
      {
        name: 'Handles different lengths',
        callExpression: 'merge_sorted([1, 2], [3, 4, 5, 6])',
        expectedJson: '[1, 2, 3, 4, 5, 6]',
      },
    ],
  },
  {
    id: 'dsa-group-prompts-intent',
    title: 'Group Prompts by Intent',
    moduleId: 'mod-08-dicts-json',
    difficulty: 'Easy',
    pattern: 'Hash Map',
    estimatedMinutes: 10,
    aiContext:
      'Evaluation suites group logged user queries by predicted intent label so you can measure accuracy per category.',
    description:
      'Given a list of dicts `records` where each dict has `"intent"` and `"text"` keys, write `group_by_intent(records: list[dict]) -> dict[str, list[str]]` grouping each `"text"` under its `"intent"` key while preserving encounter order.',
    constraints: ['Return {} for empty list', 'Every record has string "intent" and "text" keys'],
    functionName: 'group_by_intent',
    starterCode: `def group_by_intent(records: list[dict]) -> dict[str, list[str]]:
    # Group text entries under their intent key
    pass
`,
    solutionCode: `def group_by_intent(records: list[dict]) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = {}
    for rec in records:
        intent = rec["intent"]
        grouped.setdefault(intent, []).append(rec["text"])
    return grouped
`,
    complexity: 'Time O(n) · Space O(n)',
    testCases: [
      {
        name: 'Groups multiple intents preserving order',
        callExpression:
          'group_by_intent([{"intent": "bug", "text": "Crash"}, {"intent": "qa", "text": "How?"}, {"intent": "bug", "text": "404"}])',
        expectedJson: '{"bug": ["Crash", "404"], "qa": ["How?"]}',
      },
      {
        name: 'Handles empty input',
        callExpression: 'group_by_intent([])',
        expectedJson: '{}',
      },
    ],
  },
  {
    id: 'dsa-retry-backoff',
    title: 'Exponential Retry Schedule Generator',
    moduleId: 'mod-10-error-handling',
    difficulty: 'Easy',
    pattern: 'Control Flow',
    estimatedMinutes: 10,
    aiContext:
      'Rate-limited AI APIs (HTTP 429) require capped exponential backoff so clients back off cleanly without stalling forever.',
    description:
      'Write `backoff_delays(attempts: int, base_ms: int, cap_ms: int) -> list[int]` returning a list of wait durations in milliseconds for `attempts` retries where attempt `i` (0-indexed) waits `min(cap_ms, base_ms * (2 ** i))`. Return `[]` if `attempts <= 0`.',
    constraints: ['0 <= attempts <= 20', 'base_ms > 0, cap_ms > 0'],
    functionName: 'backoff_delays',
    starterCode: `def backoff_delays(attempts: int, base_ms: int, cap_ms: int) -> list[int]:
    # Compute capped exponential backoff delays
    pass
`,
    solutionCode: `def backoff_delays(attempts: int, base_ms: int, cap_ms: int) -> list[int]:
    if attempts <= 0:
        return []
    return [min(cap_ms, base_ms * (2 ** i)) for i in range(attempts)]
`,
    complexity: 'Time O(attempts) · Space O(attempts)',
    testCases: [
      {
        name: 'Doubles until hitting cap',
        callExpression: 'backoff_delays(5, 200, 1000)',
        expectedJson: '[200, 400, 800, 1000, 1000]',
      },
      {
        name: 'Zero attempts returns empty list',
        callExpression: 'backoff_delays(0, 100, 500)',
        expectedJson: '[]',
      },
      {
        name: 'Single attempt respects cap',
        callExpression: 'backoff_delays(1, 800, 500)',
        expectedJson: '[500]',
      },
    ],
  },
  {
    id: 'dsa-deep-json-extractor',
    title: 'Recursive Nested JSON Key Collector',
    moduleId: 'mod-09-functions',
    difficulty: 'Medium',
    pattern: 'Recursion',
    estimatedMinutes: 15,
    aiContext:
      'Deeply nested LLM API responses and agent traces store usage or citation fields across nested dicts and lists.',
    description:
      'Write `collect_values_by_key(data, target_key: str) -> list` that recursively walks arbitrarily nested dicts and lists and returns all values associated with `target_key` in depth-first traversal order.',
    constraints: ['Input may contain dicts, lists, and primitive values', 'Return [] if key is not present'],
    functionName: 'collect_values_by_key',
    starterCode: `def collect_values_by_key(data, target_key: str) -> list:
    # Recursively traverse dicts and lists to collect target_key values
    pass
`,
    solutionCode: `def collect_values_by_key(data, target_key: str) -> list:
    found = []
    if isinstance(data, dict):
        for k, v in data.items():
            if k == target_key:
                found.append(v)
            found.extend(collect_values_by_key(v, target_key))
    elif isinstance(data, list):
        for item in data:
            found.extend(collect_values_by_key(item, target_key))
    return found
`,
    complexity: 'Time O(nodes) · Space O(depth + matches)',
    testCases: [
      {
        name: 'Extracts keys across nested dicts and lists',
        callExpression:
          'collect_values_by_key({"steps": [{"id": "s1", "meta": {"id": "m1"}}, {"id": "s2"}]}, "id")',
        expectedJson: '["s1", "m1", "s2"]',
      },
      {
        name: 'Returns empty when key is absent',
        callExpression: 'collect_values_by_key({"a": [1, 2, {"b": 3}]}, "missing")',
        expectedJson: '[]',
      },
    ],
  },
  {
    id: 'dsa-top-k-chunks',
    title: 'Top-K Relevant Context Chunks',
    moduleId: 'mod-13-apis-ai',
    difficulty: 'Medium',
    pattern: 'Sorting & Top-K',
    estimatedMinutes: 12,
    aiContext:
      'Retrieval-Augmented Generation ranks candidate snippets by similarity score and breaks ties deterministically by ID before injecting the top `k` into the prompt.',
    description:
      'Given a list of dicts `chunks` each containing `"id"` (str) and `"score"` (float/int), write `top_k_chunk_ids(chunks: list[dict], k: int) -> list[str]` returning the top `k` IDs sorted by descending `"score"`, breaking ties alphabetically by `"id"`.',
    constraints: ['Return [] if k <= 0', 'If k > len(chunks), return all sorted IDs'],
    functionName: 'top_k_chunk_ids',
    starterCode: `def top_k_chunk_ids(chunks: list[dict], k: int) -> list[str]:
    # Sort by (-score, id) and return first k ids
    pass
`,
    solutionCode: `def top_k_chunk_ids(chunks: list[dict], k: int) -> list[str]:
    if k <= 0:
        return []
    ranked = sorted(chunks, key=lambda c: (-c["score"], c["id"]))
    return [c["id"] for c in ranked[:k]]
`,
    complexity: 'Time O(n log n) · Space O(n)',
    testCases: [
      {
        name: 'Ranks by descending score with alphabetical tie-break',
        callExpression:
          'top_k_chunk_ids([{"id": "c2", "score": 0.9}, {"id": "c1", "score": 0.9}, {"id": "c3", "score": 0.95}], 2)',
        expectedJson: '["c3", "c1"]',
      },
      {
        name: 'Handles k = 0',
        callExpression: 'top_k_chunk_ids([{"id": "c1", "score": 0.5}], 0)',
        expectedJson: '[]',
      },
    ],
  },
  {
    id: 'dsa-lru-prompt-cache',
    title: 'Bounded Prompt Cache (OrderedDict)',
    moduleId: 'mod-11-oop-dataclasses',
    difficulty: 'Medium',
    pattern: 'Design & Hashing',
    estimatedMinutes: 15,
    aiContext:
      'Caching frequent prompt responses with Least-Recently-Used eviction avoids redundant LLM bills while bounding server RAM.',
    description:
      'Write `simulate_lru_cache(capacity: int, ops: list[list]) -> list` supporting `["put", key, val]` and `["get", key]` operations on an LRU cache of size `capacity`. Return a list of outputs produced by every `"get"` operation (`-1` if missing).',
    constraints: ['capacity >= 1', 'Use collections.OrderedDict for clean O(1) LRU operations'],
    functionName: 'simulate_lru_cache',
    starterCode: `from collections import OrderedDict

def simulate_lru_cache(capacity: int, ops: list[list]) -> list:
    # Implement O(1) LRU get/put using OrderedDict
    pass
`,
    solutionCode: `from collections import OrderedDict

def simulate_lru_cache(capacity: int, ops: list[list]) -> list:
    cache: OrderedDict = OrderedDict()
    outputs = []
    for op in ops:
        action = op[0]
        if action == "get":
            key = op[1]
            if key not in cache:
                outputs.append(-1)
            else:
                cache.move_to_end(key)
                outputs.append(cache[key])
        elif action == "put":
            key, val = op[1], op[2]
            if key in cache:
                cache.move_to_end(key)
            cache[key] = val
            if len(cache) > capacity:
                cache.popitem(last=False)
    return outputs
`,
    complexity: 'Time O(ops) · Space O(capacity)',
    testCases: [
      {
        name: 'Evicts least recently used prompt key',
        callExpression:
          'simulate_lru_cache(2, [["put", "p1", "a"], ["put", "p2", "b"], ["get", "p1"], ["put", "p3", "c"], ["get", "p2"], ["get", "p3"]])',
        expectedJson: '["a", -1, "c"]',
      },
      {
        name: 'Updating existing key refreshes recency',
        callExpression:
          'simulate_lru_cache(2, [["put", "k1", 1], ["put", "k2", 2], ["put", "k1", 10], ["put", "k3", 3], ["get", "k1"], ["get", "k2"]])',
        expectedJson: '[10, -1]',
      },
    ],
  },
];
