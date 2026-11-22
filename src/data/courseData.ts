import type { CourseModule } from '../types/course';

export const COURSE_METADATA = {
  videoId: 'ygXn5nV5qFc',
  videoUrl: 'https://youtu.be/ygXn5nV5qFc',
  title: 'Python for AI — Full Beginner Course',
  instructor: 'Dave Ebbelaar',
  totalDurationLabel: '4h 58m',
  totalMinutes: 298,
  phases: [
    { phase: 1 as const, title: 'Phase 1: Professional AI Dev Setup' },
    { phase: 2 as const, title: 'Phase 2: Core Python & Control Flow' },
    { phase: 3 as const, title: 'Phase 3: Data Structures & Modularity' },
    { phase: 4 as const, title: 'Phase 4: Production & AI-Ready Python' },
  ],
};

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-01-overview',
    order: 1,
    phase: 1,
    phaseTitle: 'Phase 1: Professional AI Dev Setup',
    title: '01. Course Overview & How AI Engineers Think',
    startSeconds: 0,
    endSeconds: 750,
    durationMinutes: 12,
    overview:
      'Sets the roadmap for learning Python specifically to build AI systems, avoiding tutorial purgatory by focusing on practical developer habits and high-leverage concepts.',
    concepts: ['AI Engineering Mindset', 'Active Practice Loop', 'Reading Documentation', 'Using AI as a Tutor'],
    transcript: [
      {
        id: 't-01-1',
        timestampSeconds: 0,
        timestampLabel: '00:00',
        heading: 'Why Python dominates modern AI engineering',
        summary:
          'Every major AI SDK, orchestration framework, and data library ships Python-first. Learning core Python fluency unlocks APIs, RAG pipelines, and autonomous agents.',
        takeaway: 'Focus on the 20% of Python syntax used in 90% of real AI codebases.',
      },
      {
        id: 't-01-2',
        timestampSeconds: 265,
        timestampLabel: '04:25',
        heading: 'Escaping tutorial hell with deliberate friction',
        summary:
          'Passively watching 5 hours of syntax produces an illusion of competence. Pause after every concept to write small scripts, break them intentionally, and read tracebacks.',
        takeaway: 'Typing and debugging small exercises builds durable recall far faster than passive watching.',
      },
      {
        id: 't-01-3',
        timestampSeconds: 520,
        timestampLabel: '08:40',
        heading: 'Using LLMs as a Socratic study partner',
        summary:
          'Instead of asking an AI to solve problems blindly, paste your broken attempt and traceback and ask it to explain the root cause before revealing a fix.',
        takeaway: 'Treat AI debugging assistance as a senior reviewer, never as a copy-paste shortcut.',
      },
    ],
    excerpts: [
      {
        id: 'ex-01-1',
        timestampSeconds: 180,
        timestampLabel: '03:00',
        quote: 'You do not need to memorize every standard library method—you need sharp mental models for data flow and debugging.',
        whyItMatters: 'Shifts study energy from rote memorization to debugging fluency and pattern recognition.',
      },
      {
        id: 'ex-01-2',
        timestampSeconds: 560,
        timestampLabel: '09:20',
        quote: 'Read the very last line of a Python traceback first; it tells you what broke, while the lines above tell you where.',
        whyItMatters: 'Cuts beginner debugging time in half on day one.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-01-1',
        title: 'From Prompt Prototyping to Production Python Script',
        domain: 'AI Engineering Workflow',
        scenario:
          'A product team tests prompts manually in a web chat interface, but needs to classify 10,000 customer support tickets overnight with consistent JSON output.',
        solutionSummary:
          'Moving the prompt into a repeatable Python script lets engineers loop over inputs, validate schemas, retry failed API requests, and measure accuracy systematically.',
        codeSnippet: `# Minimal repeatable workflow pattern\ntickets = ["Billing issue on invoice #402", "App crashes on export"]\nfor idx, text in enumerate(tickets, start=1):\n    print(f"Processing ticket {idx}: {text[:32]}...")`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-01-1',
        question: 'Why is Python preferred over lower-level languages for orchestrating AI and LLM workflows?',
        difficulty: 'Foundational',
        keyPoints: [
          'First-class SDK and ecosystem support (PyTorch, Pydantic, NumPy, LLM SDKs)',
          'Rapid iteration speed with clean, readable syntax',
          'Heavy math runs in C/CUDA extensions underneath while Python handles orchestration',
        ],
        modelAnswer:
          'Python excels as the orchestration layer for AI: its concise syntax accelerates experimentation, while performance-critical tensor and matrix computations delegate to compiled C, C++, or CUDA backends under the hood.',
      },
    ],
    linkedDsaIds: ['dsa-normalize-prompt'],
  },
  {
    id: 'mod-02-setup',
    order: 2,
    phase: 1,
    phaseTitle: 'Phase 1: Professional AI Dev Setup',
    title: '02. Professional Setup: Python, VS Code & Extensions',
    startSeconds: 750,
    endSeconds: 2200,
    durationMinutes: 24,
    overview:
      'Installs Python cleanly across macOS/Windows, configures VS Code with Python, Pylance, Ruff, and Jupyter extensions, and establishes a reliable terminal execution workflow.',
    concepts: ['Python Interpreter Selection', 'VS Code Pylance', 'Integrated Terminal', 'Interactive REPL vs Scripts'],
    transcript: [
      {
        id: 't-02-1',
        timestampSeconds: 750,
        timestampLabel: '12:30',
        heading: 'Installing Python and verifying PATH',
        summary:
          'Verify your Python installation using `python3 --version` in the terminal. Always keep a clear separation between your OS system Python and project interpreters.',
        takeaway: 'Never modify or rely on system-managed OS Python binaries for application code.',
      },
      {
        id: 't-02-2',
        timestampSeconds: 1290,
        timestampLabel: '21:30',
        heading: 'Configuring VS Code for fast feedback',
        summary:
          'Install the official Microsoft Python extension, Pylance for static type checking, and Ruff for instant formatting and linting on save.',
        takeaway: 'Static diagnostics catch undefined variables and type mismatches before you even run the file.',
      },
      {
        id: 't-02-3',
        timestampSeconds: 1810,
        timestampLabel: '30:10',
        heading: 'Running scripts vs interactive cells',
        summary:
          'Use `.py` files for reusable production modules and interactive `# %%` cells or notebooks when inspecting API responses or exploring datasets.',
        takeaway: 'Interactive cells speed up exploration; clean `.py` scripts keep production reproducible.',
      },
    ],
    excerpts: [
      {
        id: 'ex-02-1',
        timestampSeconds: 1410,
        timestampLabel: '23:30',
        quote: 'If VS Code shows a squiggly underline, pause and read it—Pylance is catching a runtime crash before it happens.',
        whyItMatters: 'Builds the habit of treating editor diagnostics as immediate learning feedback.',
      },
      {
        id: 'ex-02-2',
        timestampSeconds: 1950,
        timestampLabel: '32:30',
        quote: 'Check the bottom-right interpreter selector whenever an import unexpectedly fails.',
        whyItMatters: 'Solves the #1 beginner environment issue ("ModuleNotFoundError" despite installing a package).',
      },
    ],
    caseStudies: [
      {
        id: 'cs-02-1',
        title: 'Standardizing Team Editor Formatting with Ruff',
        domain: 'Developer Experience',
        scenario:
          'Three engineers contribute to a shared RAG evaluation repo with conflicting indentation, unused imports, and inconsistent quotes, polluting every Git diff.',
        solutionSummary:
          'Enabling Ruff format-on-save enforces PEP 8 style automatically in milliseconds so code reviews focus strictly on logic rather than formatting.',
        codeSnippet: `# pyproject.toml snippet\n[tool.ruff]\nline-length = 88\n[tool.ruff.lint]\nselect = ["E", "F", "I"]  # pycodestyle, pyflakes, isort`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-02-1',
        question: 'What is the difference between a linter (like Ruff/Flake8) and a static type checker (like Pylance/MyPy)?',
        difficulty: 'Foundational',
        keyPoints: [
          'Linters catch stylistic issues, unused imports, and suspicious patterns',
          'Static type checkers verify that values match declared type annotations across function calls',
          'Both run statically without executing the code',
        ],
        modelAnswer:
          'A linter flags code smells, unused variables, and style violations, whereas a static type checker analyzes type annotations across call sites to catch mismatched types before runtime.',
      },
    ],
    linkedDsaIds: ['dsa-normalize-prompt'],
  },
  {
    id: 'mod-03-environments',
    order: 3,
    phase: 1,
    phaseTitle: 'Phase 1: Professional AI Dev Setup',
    title: '03. Virtual Environments, pip & Modern uv Tooling',
    startSeconds: 2200,
    endSeconds: 3495,
    durationMinutes: 22,
    overview:
      'Explains why global installs break AI projects, how to isolate dependencies with `venv` and `uv`, and how lockfiles keep builds reproducible across machines.',
    concepts: ['Virtual Environments (.venv)', 'requirements.txt vs pyproject.toml', 'uv Package Manager', 'Dependency Pinning'],
    transcript: [
      {
        id: 't-03-1',
        timestampSeconds: 2200,
        timestampLabel: '36:40',
        heading: 'Why isolated virtual environments are non-negotiable',
        summary:
          'AI SDKs evolve weekly. Project A might require Pydantic v1 while Project B requires Pydantic v2. A per-project `.venv` folder keeps each project’s packages isolated.',
        takeaway: 'Create a dedicated virtual environment for every single Python project.',
      },
      {
        id: 't-03-2',
        timestampSeconds: 2740,
        timestampLabel: '45:40',
        heading: 'Installing dependencies with pip vs modern uv',
        summary:
          'Traditional `python -m venv .venv` and `pip install` work everywhere, while `uv` (written in Rust) resolves and installs dependency trees 10–100x faster with a deterministic lockfile.',
        takeaway: 'Know standard `venv` + `pip` fundamentals, and adopt `uv` for fast modern AI repositories.',
      },
      {
        id: 't-03-3',
        timestampSeconds: 3210,
        timestampLabel: '53:30',
        heading: 'Freezing and reproducing environments',
        summary:
          'Never commit `.venv/` to Git. Commit `pyproject.toml` and `uv.lock` (or `requirements.txt`) so teammates and cloud servers install exact matching versions.',
        takeaway: 'Add `.venv/` to `.gitignore` on day one and track dependencies declaratively.',
      },
    ],
    excerpts: [
      {
        id: 'ex-03-1',
        timestampSeconds: 2450,
        timestampLabel: '40:50',
        quote: 'Treat a virtual environment as disposable—you should be able to delete `.venv` and rebuild it in seconds from your lockfile.',
        whyItMatters: 'Prevents "works on my machine" failures when deploying AI backends to Cloud Run or Docker.',
      },
      {
        id: 'ex-03-2',
        timestampSeconds: 3020,
        timestampLabel: '50:20',
        quote: 'Pinning exact versions prevents silent upstream SDK updates from breaking production prompts overnight.',
        whyItMatters: 'AI SDKs frequently rename parameters between minor releases.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-03-1',
        title: 'Eliminating "Works on My Laptop" in an Agent Deployment',
        domain: 'MLOps & Deployment',
        scenario:
          'An LLM extraction script passes locally, but crashes in production CI because a transitive HTTP library upgraded overnight and changed timeout defaults.',
        solutionSummary:
          'Switching to `pyproject.toml` + `uv.lock` guarantees byte-for-byte identical dependency resolution across local macOS laptops and Linux containers.',
        codeSnippet: `# Modern reproducible AI project bootstrap\n# uv init ai-extractor\n# uv add google-genai pydantic python-dotenv\n# uv run python main.py`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-03-1',
        question: 'Why should you never commit your `.venv` directory to Git, and how do teammates recreate your environment instead?',
        difficulty: 'Foundational',
        keyPoints: [
          '`.venv` contains thousands of OS- and architecture-specific binary files and hardcoded paths',
          'Commit `pyproject.toml` + lockfile (`uv.lock` or pinned `requirements.txt`)',
          'Teammates run `uv sync` or `pip install -r requirements.txt` to recreate identically',
        ],
        modelAnswer:
          'A `.venv` folder is platform-specific, huge, and embeds absolute filesystem paths. Instead, commit declarative manifests and lockfiles (`pyproject.toml` / `uv.lock`) so any machine reconstructs the exact environment cleanly.',
      },
    ],
    linkedDsaIds: ['dsa-dedup-doc-ids'],
  },
  {
    id: 'mod-04-variables-types',
    order: 4,
    phase: 2,
    phaseTitle: 'Phase 2: Core Python & Control Flow',
    title: '04. Variables, Primitive Types & F-Strings',
    startSeconds: 3495,
    endSeconds: 5170,
    durationMinutes: 28,
    overview:
      'Covers dynamic typing, naming conventions, integers, floats, booleans, `None`, string slicing/methods, and building dynamic LLM prompt templates with f-strings.',
    concepts: ['Dynamic Typing', 'snake_case Naming', 'String Immutability', 'f-Strings & Formatting', 'None Sentinel'],
    transcript: [
      {
        id: 't-04-1',
        timestampSeconds: 3495,
        timestampLabel: '58:15',
        heading: 'Variables as labeled references to objects',
        summary:
          'In Python, variables are names bound to typed objects in memory. Use descriptive `snake_case` names like `max_tokens` or `system_prompt` instead of cryptic single letters.',
        takeaway: 'Clear variable names make prompt pipelines self-documenting.',
      },
      {
        id: 't-04-2',
        timestampSeconds: 4120,
        timestampLabel: '1:08:40',
        heading: 'Numbers, floating-point precision, and booleans',
        summary:
          'Distinguish `int` (token counts, indices) from `float` (temperature `0.2`, similarity scores `0.87`). Use `round()` or `f"{cost:.4f}"` when formatting dollar estimates.',
        takeaway: 'Watch for float rounding quirks (`0.1 + 0.2 != 0.3`); format currency and latency explicitly.',
      },
      {
        id: 't-04-3',
        timestampSeconds: 4680,
        timestampLabel: '1:18:00',
        heading: 'String methods and f-strings for prompt engineering',
        summary:
          'Strings are immutable: `.strip()`, `.lower()`, and `.replace()` return new strings. Triple-quoted f-strings (`f"""..."""`) let you compose clean multi-line LLM prompts.',
        takeaway: 'Always `.strip()` user inputs before injecting them into prompts or token estimators.',
      },
    ],
    excerpts: [
      {
        id: 'ex-04-1',
        timestampSeconds: 3910,
        timestampLabel: '1:05:10',
        quote: 'Check for `None` using `is None` or `is not None`, never `== None`.',
        whyItMatters: 'Identity checks (`is`) are faster, idiomatic PEP 8, and immune to custom `__eq__` overrides.',
      },
      {
        id: 'ex-04-2',
        timestampSeconds: 4850,
        timestampLabel: '1:20:50',
        quote: 'An f-string lets you embed expressions directly: `f"Cost: ${tokens * 0.000002:.4f}"`.',
        whyItMatters: 'Eliminates brittle string concatenation and type-conversion boilerplate.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-04-1',
        title: 'Sanitizing User Queries & Formatting Structured Prompts',
        domain: 'Prompt Engineering',
        scenario:
          'Raw text copied from PDFs contains erratic newlines, trailing spaces, and mixed casing that waste tokens and degrade embedding cosine similarity.',
        solutionSummary:
          'Normalizing whitespace with `.split()` + `" ".join(...)` and interpolating into a clean f-string template reduces wasted tokens by 12–18% before calling an LLM.',
        codeSnippet: `raw_query = "   Explain   vector   embeddings\\n\\n  in Python  "\nclean_query = " ".join(raw_query.split())\nprompt = f"Role: Senior AI Tutor\\nQuestion: {clean_query}\\nLimit: 3 sentences."\nprint(prompt)`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-04-1',
        question: 'What does it mean that Python strings are immutable, and what performance pitfall can this cause inside loops?',
        difficulty: 'Intermediate',
        keyPoints: [
          'You cannot modify a character in-place; operations allocate a new string object',
          'Repeated `result += chunk` inside a large loop can degrade to O(n^2) memory copying',
          'Collect pieces in a list and combine once with `"".join(parts)` for O(n) linear performance',
        ],
        modelAnswer:
          'String immutability means every concatenation creates a new string object. In tight loops over many chunks, appending to a list and calling `"".join(chunks)` avoids quadratic reallocation overhead.',
      },
      {
        id: 'iq-04-2',
        question: 'Why does Python recommend `if value is None:` instead of `if not value:` when checking optional parameters?',
        difficulty: 'Foundational',
        keyPoints: [
          '`not value` treats `0`, `0.0`, `""`, and `[]` as falsy',
          'A valid parameter like `temperature=0.0` would accidentally trigger a fallback if checked with `if not temperature:`',
          '`is None` checks strictly for the absence of a value',
        ],
        modelAnswer:
          'Using `if not value:` conflates `None` with valid falsy values like `0` or `0.0`. Checking `if value is None:` preserves legitimate zero values such as `temperature=0.0`.',
      },
    ],
    linkedDsaIds: ['dsa-normalize-prompt', 'dsa-valid-palindrome-clean'],
  },
  {
    id: 'mod-05-control-flow',
    order: 5,
    phase: 2,
    phaseTitle: 'Phase 2: Core Python & Control Flow',
    title: '05. Control Flow: Conditionals, Boolean Logic & Guards',
    startSeconds: 5170,
    endSeconds: 6665,
    durationMinutes: 25,
    overview:
      'Teaches `if`/`elif`/`else` branching, truthiness, short-circuit boolean evaluation, comparison chaining, and writing flat guard clauses instead of deeply nested pyramids.',
    concepts: ['if / elif / else', 'Truthiness & Falsiness', 'Short-Circuit Evaluation', 'Guard Clauses', 'Chained Comparisons'],
    transcript: [
      {
        id: 't-05-1',
        timestampSeconds: 5170,
        timestampLabel: '1:26:10',
        heading: 'Decision trees and chained comparisons',
        summary:
          'Python lets you write readable mathematical bounds like `0.0 <= confidence <= 1.0` directly rather than duplicating variables with `and`.',
        takeaway: 'Use chained comparisons for threshold routing in model confidence classifiers.',
      },
      {
        id: 't-05-2',
        timestampSeconds: 5790,
        timestampLabel: '1:36:30',
        heading: 'Short-circuit evaluation with `and` / `or`',
        summary:
          'Python stops evaluating as soon as the boolean outcome is known. Writing `if user and user.get("active"):` safely prevents AttributeError when `user` is `None`.',
        takeaway: 'Put cheap or null-safety checks on the left side of `and`.',
      },
      {
        id: 't-05-3',
        timestampSeconds: 6250,
        timestampLabel: '1:44:10',
        heading: 'Replacing deep nesting with early-return guard clauses',
        summary:
          'Validate invalid edge cases first and return early. This keeps the primary "happy path" unindented and effortless to read.',
        takeaway: 'Flat is better than nested—check failure conditions upfront.',
      },
    ],
    excerpts: [
      {
        id: 'ex-05-1',
        timestampSeconds: 6320,
        timestampLabel: '1:45:20',
        quote: 'When your indentation drifts past three levels, look for an early return guard clause.',
        whyItMatters: 'Makes business logic and agent routing dramatically easier to test and debug.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-05-1',
        title: 'LLM Confidence-Based Model Routing',
        domain: 'Cost & Latency Optimization',
        scenario:
          'Sending every customer query to a frontier reasoning model blows the monthly budget. Most simple queries can be handled by a fast, low-cost model.',
        solutionSummary:
          'A clean guard-clause router inspects query length, complexity flags, and confidence score to route fast queries cheaply while escalating ambiguous cases.',
        codeSnippet: `def select_model(prompt: str, confidence: float, require_reasoning: bool) -> str:\n    if not prompt.strip():\n        return "invalid"\n    if require_reasoning or confidence < 0.65:\n        return "pro-reasoning"\n    return "fast-flash"`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-05-1',
        question: 'Explain short-circuit evaluation in Python boolean expressions and give a bug-preventing example.',
        difficulty: 'Foundational',
        keyPoints: [
          '`A and B` skips evaluating `B` if `A` is falsy',
          '`A or B` skips evaluating `B` if `A` is truthy',
          'Example: `if count > 0 and total / count > 5:` avoids `ZeroDivisionError`',
        ],
        modelAnswer:
          'In `A and B`, Python never evaluates `B` if `A` is falsy. Placing guards like `count > 0` before `total / count > 5` prevents runtime exceptions such as `ZeroDivisionError`.',
      },
    ],
    linkedDsaIds: ['dsa-balanced-prompt-tags', 'dsa-retry-backoff'],
  },
  {
    id: 'mod-06-loops',
    order: 6,
    phase: 2,
    phaseTitle: 'Phase 2: Core Python & Control Flow',
    title: '06. Loops, Iteration & Comprehensions',
    startSeconds: 6665,
    endSeconds: 8400,
    durationMinutes: 29,
    overview:
      'Covers `for` and `while` loops, `enumerate()`, `zip()`, `break`/`continue`, and writing concise Pythonic list and dictionary comprehensions.',
    concepts: ['for & while Loops', 'enumerate() & zip()', 'break / continue', 'List & Dict Comprehensions', 'Sliding Windows'],
    transcript: [
      {
        id: 't-06-1',
        timestampSeconds: 6665,
        timestampLabel: '1:51:05',
        heading: 'Idiomatic iteration with `enumerate` and `zip`',
        summary:
          'Avoid manual `i = 0; i += 1` counters or `range(len(items))`. Use `enumerate(items)` when you need indices and `zip(questions, answers)` to walk paired lists cleanly.',
        takeaway: 'Let Python drive the index so you eliminate off-by-one bugs.',
      },
      {
        id: 't-06-2',
        timestampSeconds: 7380,
        timestampLabel: '2:03:00',
        heading: 'Safe `while` loops with bounded retry counters',
        summary:
          'Whenever polling a job or retrying an API in a `while` loop, always pair the condition with a strict `max_attempts` cap so a stuck network call never loops forever.',
        takeaway: 'Every `while` loop in production needs a guaranteed termination invariant.',
      },
      {
        id: 't-06-3',
        timestampSeconds: 7890,
        timestampLabel: '2:11:30',
        heading: 'List and dictionary comprehensions',
        summary:
          'Transform and filter collections in one expressive line: `[doc["text"] for doc in docs if doc["score"] > 0.8]`. Keep comprehensions readable—drop back to a normal loop if nested more than twice.',
        takeaway: 'Comprehensions shine for clean 1-step map/filter transformations.',
      },
    ],
    excerpts: [
      {
        id: 'ex-06-1',
        timestampSeconds: 7980,
        timestampLabel: '2:13:00',
        quote: 'If a list comprehension wraps onto three lines with nested loops, rewrite it as an explicit `for` loop for your future self.',
        whyItMatters: 'Balances Pythonic conciseness with real-world maintainability.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-06-1',
        title: 'Batching Document Chunks for Embedding APIs',
        domain: 'RAG Ingestion Pipeline',
        scenario:
          'An embedding endpoint accepts at most 100 text chunks per HTTP call, but your knowledge base contains 2,450 paragraphs.',
        solutionSummary:
          'Stepping with `range(0, len(chunks), batch_size)` slices the corpus into clean, predictable batches with zero leftover drops.',
        codeSnippet: `chunks = [f"chunk_{i}" for i in range(25)]\nbatch_size = 10\nbatches = [chunks[i : i + batch_size] for i in range(0, len(chunks), batch_size)]\nprint([len(b) for b in batches])  # [10, 10, 5]`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-06-1',
        question: 'When would you prefer a generator expression `(x for x in data)` over a list comprehension `[x for x in data]`?',
        difficulty: 'Intermediate',
        keyPoints: [
          'List comprehensions materialize the entire result in memory immediately (O(n) space)',
          'Generator expressions yield items lazily one at a time (O(1) memory overhead)',
          'Use generators when streaming huge log files, JSONL datasets, or passing directly into `sum()`/`any()`',
        ],
        modelAnswer:
          'A list comprehension allocates all items in RAM at once, whereas a generator expression computes items lazily on demand—critical when scanning multi-gigabyte training files or logs.',
      },
    ],
    linkedDsaIds: ['dsa-sliding-window-chunks', 'dsa-merge-sorted-latencies'],
  },
  {
    id: 'mod-07-lists-tuples-sets',
    order: 7,
    phase: 3,
    phaseTitle: 'Phase 3: Data Structures & Modularity',
    title: '07. Data Structures: Lists, Tuples & Sets',
    startSeconds: 8400,
    endSeconds: 10215,
    durationMinutes: 30,
    overview:
      'Compares Python’s core sequence and collection types, slicing mechanics, mutability pitfalls (aliasing), tuple unpacking, and O(1) set membership lookups.',
    concepts: ['Lists & Slicing', 'Mutability & Aliasing', 'Immutable Tuples & Unpacking', 'Sets & O(1) Membership'],
    transcript: [
      {
        id: 't-07-1',
        timestampSeconds: 8400,
        timestampLabel: '2:20:00',
        heading: 'Lists, slicing, and shallow copy gotchas',
        summary:
          'Assigning `b = a` copies the reference, not the list—mutating `b` silently mutates `a`. Use `a.copy()` or `list(a)` when you need an independent list.',
        takeaway: 'Understand reference aliasing early to prevent mysterious shared-state bugs.',
      },
      {
        id: 't-07-2',
        timestampSeconds: 9120,
        timestampLabel: '2:32:00',
        heading: 'Tuples for fixed records and clean unpacking',
        summary:
          'Tuples communicate intent ("this structure should not change") and support crisp unpacking: `model_name, latency_ms = ("gemini-flash", 142)`.',
        takeaway: 'Return tuples from helper functions when pairing fixed outputs like `(result, error)`.',
      },
      {
        id: 't-07-3',
        timestampSeconds: 9660,
        timestampLabel: '2:41:00',
        heading: 'Sets for deduplication and instant O(1) lookups',
        summary:
          'Checking `item in my_list` scans linearly in O(n). Converting to a `set` makes membership checks O(1) average time and unlocks set intersection/difference operations.',
        takeaway: 'Whenever you check `if x in seen:` inside a loop, `seen` should almost always be a `set`.',
      },
    ],
    excerpts: [
      {
        id: 'ex-07-1',
        timestampSeconds: 9740,
        timestampLabel: '2:42:20',
        quote: 'Swapping a list for a set in a membership check can turn a 12-second script into a 4-millisecond script.',
        whyItMatters: 'Directly bridges everyday Python code with Big-O algorithmic efficiency.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-07-1',
        title: 'Deduplicating Retrieved Vector Search Results',
        domain: 'Hybrid Search / RAG',
        scenario:
          'Combining keyword search (BM25) and semantic vector search returns overlapping document IDs, causing duplicate paragraphs to waste LLM context tokens.',
        solutionSummary:
          'Tracking emitted document IDs in a `set` preserves ranked order while skipping duplicates in O(1) time per candidate.',
        codeSnippet: `def dedup_ranked_ids(ranked_ids: list[str]) -> list[str]:\n    seen: set[str] = set()\n    unique: list[str] = []\n    for doc_id in ranked_ids:\n        if doc_id not in seen:\n            seen.add(doc_id)\n            unique.append(doc_id)\n    return unique`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-07-1',
        question: 'Compare the average time complexity of `x in container` for a Python `list` vs a `set`, and explain why they differ.',
        difficulty: 'Foundational',
        keyPoints: [
          '`list` lookup is O(n) because Python scans elements sequentially',
          '`set` lookup is O(1) average because sets are backed by hash tables',
          'Elements in a `set` must be hashable (immutable like `str`, `int`, `tuple`)',
        ],
        modelAnswer:
          'Membership testing in a `list` takes O(n) linear time via sequential scan, whereas a `set` hashes the element to jump directly to its bucket in O(1) average time, requiring hashable elements.',
      },
    ],
    linkedDsaIds: ['dsa-dedup-doc-ids', 'dsa-top-k-chunks'],
  },
  {
    id: 'mod-08-dicts-json',
    order: 8,
    phase: 3,
    phaseTitle: 'Phase 3: Data Structures & Modularity',
    title: '08. Dictionaries & JSON Payloads for LLM APIs',
    startSeconds: 10215,
    endSeconds: 11780,
    durationMinutes: 26,
    overview:
      'Masters Python dictionaries—the backbone of every REST API and LLM message payload—covering `.get()`, `.items()`, nested JSON traversal, frequency maps, and `json.loads`/`dumps`.',
    concepts: ['Key-Value Hash Maps', 'Safe .get() Access', 'Nested Dict / JSON Parsing', 'Frequency Counting', 'json Module'],
    transcript: [
      {
        id: 't-08-1',
        timestampSeconds: 10215,
        timestampLabel: '2:50:15',
        heading: 'Why dictionaries mirror JSON API payloads',
        summary:
          'Every chat completion request (`{"role": "user", "content": "..."}`) and response maps 1-to-1 to Python dicts and lists. Mastering nested access makes working with any AI API second nature.',
        takeaway: 'Every JSON object you receive from an LLM API becomes a Python dictionary.',
      },
      {
        id: 't-08-2',
        timestampSeconds: 10840,
        timestampLabel: '3:00:40',
        heading: 'Preventing `KeyError` crashes with `.get()`',
        summary:
          'Direct indexing `response["usage"]["total_tokens"]` crashes if a field is omitted. Chaining `response.get("usage", {}).get("total_tokens", 0)` handles missing keys gracefully.',
        takeaway: 'Prefer `.get(key, default)` when parsing external API or user-supplied JSON.',
      },
      {
        id: 't-08-3',
        timestampSeconds: 11350,
        timestampLabel: '3:09:10',
        heading: 'Grouping and counting patterns with dicts',
        summary:
          'Hash maps solve an enormous share of coding interview problems: counting frequencies, grouping items by category, and caching computed results in O(1).',
        takeaway: 'Frequency counting (`counts[k] = counts.get(k, 0) + 1`) is a core DSA building block.',
      },
    ],
    excerpts: [
      {
        id: 'ex-08-1',
        timestampSeconds: 10910,
        timestampLabel: '3:01:50',
        quote: 'If you master dictionaries, lists, and functions, you can understand 85% of modern AI SDK codebases.',
        whyItMatters: 'Highlights the highest-ROI data structure combination in Python.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-08-1',
        title: 'Parsing Tool-Call Payloads Safely from LLM Responses',
        domain: 'AI Agents & Function Calling',
        scenario:
          'An AI agent returns structured JSON specifying tool arguments, but occasional responses omit optional fields like `currency` or `filters`.',
        solutionSummary:
          'Using `json.loads()` with `.get()` defaults extracts reliable typed values without crashing the agent execution loop.',
        codeSnippet: `import json\n\nraw = '{"tool": "search_docs", "args": {"query": "python venv"}}'\npayload = json.loads(raw)\nargs = payload.get("args", {})\nlimit = args.get("limit", 5)\nprint(payload["tool"], args.get("query"), limit)`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-08-1',
        question: 'Can a Python `list` be used as a dictionary key? Why or why not?',
        difficulty: 'Foundational',
        keyPoints: [
          'No—lists are mutable and therefore unhashable (`TypeError: unhashable type: list`)',
          'Dictionary keys must have a stable hash across their lifetime',
          'Use an immutable `tuple` (e.g., `(user_id, session_id)`) for composite keys',
        ],
        modelAnswer:
          'Lists cannot be dictionary keys because they are mutable; changing a list after insertion would invalidate its hash bucket. Convert composite keys into immutable tuples instead.',
      },
    ],
    linkedDsaIds: ['dsa-token-frequency', 'dsa-group-prompts-intent', 'dsa-two-sum-budget'],
  },
  {
    id: 'mod-09-functions',
    order: 9,
    phase: 3,
    phaseTitle: 'Phase 3: Data Structures & Modularity',
    title: '09. Functions, Type Hints & Modular Architecture',
    startSeconds: 11780,
    endSeconds: 13390,
    durationMinutes: 27,
    overview:
      'Builds clean, reusable functions with default arguments, `*args`/`**kwargs`, return values vs side effects, type annotations, docstrings, and splitting scripts into modules.',
    concepts: ['Pure Functions vs Side Effects', 'Default Arguments Pitfall', 'Type Hints', 'Modules & Imports', '*args / **kwargs'],
    transcript: [
      {
        id: 't-09-1',
        timestampSeconds: 11780,
        timestampLabel: '3:16:20',
        heading: 'Returning values instead of just calling `print()`',
        summary:
          'Beginners often print inside functions and return `None`. Returning data makes functions composable, testable, and reusable across CLI scripts, APIs, and notebooks.',
        takeaway: 'Functions should compute and return values; callers decide whether to print or store them.',
      },
      {
        id: 't-09-2',
        timestampSeconds: 12450,
        timestampLabel: '3:27:30',
        heading: 'Type hints and avoiding mutable default arguments',
        summary:
          'Never write `def add_msg(msg, history=[]):` because default lists are created once at function definition time and shared across calls! Always default to `None` and initialize inside.',
        takeaway: 'Use `history: list[str] | None = None` to avoid cross-request state leaks.',
      },
      {
        id: 't-09-3',
        timestampSeconds: 12960,
        timestampLabel: '3:36:00',
        heading: 'Structuring reusable modules and `if __name__ == "__main__":`',
        summary:
          'Split helpers into dedicated files (`prompts.py`, `client.py`) and guard runnable entrypoints with `if __name__ == "__main__":` so importing a file does not trigger side effects.',
        takeaway: 'Always wrap script execution under `if __name__ == "__main__":`.',
      },
    ],
    excerpts: [
      {
        id: 'ex-09-1',
        timestampSeconds: 12520,
        timestampLabel: '3:28:40',
        quote: 'Mutable default arguments (`items=[]`) are the most famous silent bug in Python interviews and production APIs.',
        whyItMatters: 'Causes User A’s chat history to accidentally leak into User B’s request.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-09-1',
        title: 'Fixing a Cross-User Chat History Leak',
        domain: 'Production Debugging',
        scenario:
          'A FastAPI chatbot endpoint defined `def build_messages(prompt: str, history: list = [])`, causing subsequent users to receive previous users’ conversation context.',
        solutionSummary:
          'Changing the signature to `history: list[dict] | None = None` and allocating `history = [] if history is None else list(history)` completely isolates every session.',
        codeSnippet: `def build_messages(prompt: str, history: list[dict] | None = None) -> list[dict]:\n    msgs = list(history) if history is not None else []\n    msgs.append({"role": "user", "content": prompt})\n    return msgs`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-09-1',
        question: 'Why is `def append_item(x, target=[]):` dangerous in Python, and what is the correct pattern?',
        difficulty: 'Intermediate',
        keyPoints: [
          'Default argument values are evaluated once when the `def` statement executes, not on each call',
          'Every call omitting `target` mutates the exact same list object in memory',
          'Fix by using `target: list | None = None` and initializing inside the function body',
        ],
        modelAnswer:
          'Python evaluates default arguments once at function definition time. A mutable default like `[]` persists across calls and leaks state. Default to `None` and instantiate a fresh list inside the function.',
      },
    ],
    linkedDsaIds: ['dsa-deep-json-extractor', 'dsa-retry-backoff'],
  },
  {
    id: 'mod-10-error-handling',
    order: 10,
    phase: 4,
    phaseTitle: 'Phase 4: Production & AI-Ready Python',
    title: '10. Error Handling (try/except) & Resilient API Calls',
    startSeconds: 13390,
    endSeconds: 14645,
    durationMinutes: 21,
    overview:
      'Teaches defensive error handling with specific exception types, `else`/`finally`, raising meaningful errors, and building retry-with-backoff wrappers around flaky external APIs.',
    concepts: ['Specific Exceptions', 'try / except / else / finally', 'Raising ValueError', 'Retry & Exponential Backoff'],
    transcript: [
      {
        id: 't-10-1',
        timestampSeconds: 13390,
        timestampLabel: '3:43:10',
        heading: 'Catch specific exceptions, never bare `except:`',
        summary:
          'Swallowing every error with `except:` hides typos, keyboard interrupts, and logic bugs. Catch specific types like `json.JSONDecodeError`, `TimeoutError`, or `KeyError`.',
        takeaway: 'Narrow `except` blocks keep real bugs loud while gracefully recovering from expected faults.',
      },
      {
        id: 't-10-2',
        timestampSeconds: 14010,
        timestampLabel: '3:53:30',
        heading: 'Using `else` and `finally` cleanly',
        summary:
          'Put only the risky operation inside `try`, post-success steps in `else`, and guaranteed cleanup (closing connections or files) in `finally`.',
        takeaway: 'Keeping the `try` block minimal makes it obvious which line actually threw the exception.',
      },
      {
        id: 't-10-3',
        timestampSeconds: 14340,
        timestampLabel: '3:59:00',
        heading: 'Resilient LLM calls with retries',
        summary:
          'External AI endpoints occasionally return HTTP 429 rate limits or transient 503 timeouts. Retrying with exponential backoff turns fragile demos into reliable pipelines.',
        takeaway: 'Wait `base * (2 ** attempt)` seconds between retries and fail fast on 400/401 auth errors.',
      },
    ],
    excerpts: [
      {
        id: 'ex-10-1',
        timestampSeconds: 13620,
        timestampLabel: '3:47:00',
        quote: 'A bare `except: pass` is how a 2-minute bug turns into a 4-hour production outage.',
        whyItMatters: 'Reinforces explicit, observable error handling.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-10-1',
        title: 'Recovering from Malformed JSON in LLM Structured Outputs',
        domain: 'LLM Reliability',
        scenario:
          'A batch document parser processes 500 invoices; one response wraps JSON inside Markdown fences and triggers `JSONDecodeError`.',
        solutionSummary:
          'Catching `json.JSONDecodeError` lets the worker strip Markdown fences or log the single failed invoice to a dead-letter list instead of aborting the other 499 items.',
        codeSnippet: `import json\n\ndef safe_parse_json(raw: str) -> dict | None:\n    cleaned = raw.strip().removeprefix("\`\`\`json").removesuffix("\`\`\`").strip()\n    try:\n        return json.loads(cleaned)\n    except json.JSONDecodeError:\n        return None`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-10-1',
        question: 'Why is catching `Exception` or bare `except:` discouraged in Python, and when is catching `Exception` acceptable?',
        difficulty: 'Intermediate',
        keyPoints: [
          'Bare `except:` catches `SystemExit` and `KeyboardInterrupt`, preventing clean shutdown',
          'Broad `except Exception:` can silently hide programmer errors like `TypeError` or `NameError`',
          'Acceptable only at top-level request/worker boundaries where you log the full traceback and return a structured error response',
        ],
        modelAnswer:
          'Bare `except:` traps even `KeyboardInterrupt`. Catch narrow exceptions locally so logic bugs fail loudly; reserve broad `except Exception:` strictly for top-level server or worker boundaries that log and report failures.',
      },
    ],
    linkedDsaIds: ['dsa-retry-backoff', 'dsa-balanced-prompt-tags'],
  },
  {
    id: 'mod-11-oop-dataclasses',
    order: 11,
    phase: 4,
    phaseTitle: 'Phase 4: Production & AI-Ready Python',
    title: '11. Object-Oriented Programming & Dataclasses',
    startSeconds: 14645,
    endSeconds: 16095,
    durationMinutes: 24,
    overview:
      'Introduces classes, `__init__`, instance attributes and methods, composition over deep inheritance, and modern `@dataclass` models used throughout AI libraries.',
    concepts: ['Classes & Instances', 'self & __init__', '@dataclass', 'Composition vs Inheritance', 'Method Encapsulation'],
    transcript: [
      {
        id: 't-11-1',
        timestampSeconds: 14645,
        timestampLabel: '4:04:05',
        heading: 'When to reach for a class vs a plain function',
        summary:
          'Use plain functions for stateless transformations. Use a class when multiple operations share persistent state—such as an API client holding a base URL, timeout, and session metrics.',
        takeaway: 'Bundle state and the behavior that operates on that state together.',
      },
      {
        id: 't-11-2',
        timestampSeconds: 15320,
        timestampLabel: '4:15:20',
        heading: 'Modern `@dataclass` for clean AI schemas',
        summary:
          'Instead of writing repetitive `__init__` and `__repr__` boilerplate, `@dataclass` generates them automatically and bridges directly into Pydantic models used in structured AI outputs.',
        takeaway: '`@dataclass` makes structured domain objects concise, readable, and type-safe.',
      },
      {
        id: 't-11-3',
        timestampSeconds: 15810,
        timestampLabel: '4:23:30',
        heading: 'Composition over deep inheritance trees',
        summary:
          'Rather than building 4-level class hierarchies, pass collaborating components (like a retriever or logger) into a class constructor.',
        takeaway: 'Composition makes AI agents easy to swap and unit-test with mock clients.',
      },
    ],
    excerpts: [
      {
        id: 'ex-11-1',
        timestampSeconds: 15410,
        timestampLabel: '4:16:50',
        quote: 'If your class only has `__init__` and one other method, it probably just wants to be a function.',
        whyItMatters: 'Prevents over-engineered Java-style boilerplate in Python projects.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-11-1',
        title: 'Modeling a Token-Aware Conversation Buffer',
        domain: 'AI Agent Memory',
        scenario:
          'Passing unbounded conversation arrays to an LLM eventually exceeds the context window and inflates per-turn cost.',
        solutionSummary:
          'Encapsulating messages inside a `ConversationBuffer` class enforces a clean token ceiling automatically whenever a new message is appended.',
        codeSnippet: `from dataclasses import dataclass, field\n\n@dataclass\nclass Message:\n    role: str\n    content: str\n\n@dataclass\nclass ConversationBuffer:\n    max_messages: int = 10\n    items: list[Message] = field(default_factory=list)\n\n    def add(self, role: str, content: str) -> None:\n        self.items.append(Message(role, content))\n        self.items = self.items[-self.max_messages:]`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-11-1',
        question: 'What problem does `@dataclass` solve compared to a regular Python class, and why do you use `field(default_factory=list)` inside one?',
        difficulty: 'Intermediate',
        keyPoints: [
          'Auto-generates `__init__`, `__repr__`, and `__eq__` from type-annotated attributes',
          '`default_factory=list` prevents mutable defaults from being shared across all instances',
          'Makes data-holding objects concise and readable',
        ],
        modelAnswer:
          '`@dataclass` removes boilerplate by generating `__init__`, `__repr__`, and `__eq__`. Using `field(default_factory=list)` ensures every new instance receives its own fresh list instead of sharing one mutable object.',
      },
    ],
    linkedDsaIds: ['dsa-lru-prompt-cache'],
  },
  {
    id: 'mod-12-files-env-git',
    order: 12,
    phase: 4,
    phaseTitle: 'Phase 4: Production & AI-Ready Python',
    title: '12. Files, pathlib, .env Secrets & Git Workflows',
    startSeconds: 16095,
    endSeconds: 17170,
    durationMinutes: 18,
    overview:
      'Covers cross-platform file handling with `pathlib` and `with open(...)`, protecting API keys using `.env` + `python-dotenv`, and essential Git habits for AI projects.',
    concepts: ['Context Managers (with)', 'pathlib.Path', '.env & os.getenv', '.gitignore Secret Hygiene', 'Git Commit Workflow'],
    transcript: [
      {
        id: 't-12-1',
        timestampSeconds: 16095,
        timestampLabel: '4:28:15',
        heading: 'Context managers (`with`) and `pathlib.Path`',
        summary:
          'Always open files with `with open(...) as f:` so file descriptors close even if an exception occurs. Prefer `Path("data") / "prompts.json"` over fragile manual slash concatenation.',
        takeaway: '`pathlib` works identically on Windows, macOS, and Linux.',
      },
      {
        id: 't-12-2',
        timestampSeconds: 16580,
        timestampLabel: '4:36:20',
        heading: 'Managing API keys safely with `.env`',
        summary:
          'Never hardcode API keys inside `.py` files. Store secrets in `.env`, list `.env` in `.gitignore`, commit a safe `.env.example`, and load values via `load_dotenv()` + `os.getenv()`.',
        takeaway: 'Leaked keys in public Git repos are scraped by bots within seconds.',
      },
      {
        id: 't-12-3',
        timestampSeconds: 16910,
        timestampLabel: '4:41:50',
        heading: 'Clean Git discipline for iterative experiments',
        summary:
          'Make small, atomic commits after each working milestone (`git status`, `git diff`, `git commit`). Always inspect `git diff` before pushing so secrets and large temp datasets stay out.',
        takeaway: 'Frequent small commits let you revert broken prompt experiments effortlessly.',
      },
    ],
    excerpts: [
      {
        id: 'ex-12-1',
        timestampSeconds: 16650,
        timestampLabel: '4:37:30',
        quote: 'If an API key touches Git history even once, consider it compromised and rotate it immediately.',
        whyItMatters: 'Instills production security hygiene before building real API integrations.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-12-1',
        title: 'Loading Prompt Templates & Configuration Safely Across Environments',
        domain: 'Application Configuration',
        scenario:
          'A project runs on a developer’s Windows laptop and deploys to Linux cloud containers, needing clean file paths and environment-driven API keys.',
        solutionSummary:
          'Combining `pathlib.Path(__file__).parent` with `os.getenv` eliminates relative-path breakage and keeps secrets strictly outside source control.',
        codeSnippet: `from pathlib import Path\nimport os\n\nBASE_DIR = Path(__file__).resolve().parent\nprompt_file = BASE_DIR / "prompts" / "summarize.txt"\napi_key = os.getenv("GEMINI_API_KEY")\nif not api_key:\n    raise RuntimeError("Missing GEMINI_API_KEY environment variable")`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-12-1',
        question: 'What does the `with` statement (context manager) guarantee when reading or writing files in Python?',
        difficulty: 'Foundational',
        keyPoints: [
          'Invokes `__enter__` on entry and guarantees `__exit__` runs when leaving the block',
          'Automatically flushes buffers and closes the file handle even if an exception is raised inside',
          'Prevents resource/file-descriptor leaks',
        ],
        modelAnswer:
          'A `with` block guarantees resource cleanup via `__exit__`, ensuring file handles are flushed and closed immediately—even when an unhandled exception interrupts the block.',
      },
    ],
    linkedDsaIds: ['dsa-deep-json-extractor'],
  },
  {
    id: 'mod-13-apis-ai',
    order: 13,
    phase: 4,
    phaseTitle: 'Phase 4: Production & AI-Ready Python',
    title: '13. REST APIs, Requests & Structured AI Pipelines',
    startSeconds: 17170,
    endSeconds: 17880,
    durationMinutes: 14,
    overview:
      'Brings every module together—calling REST APIs with timeouts and status checks, parsing JSON responses, validating outputs, and transitioning into full AI agent development.',
    concepts: ['HTTP Requests & Timeouts', 'response.raise_for_status()', 'Structured JSON Outputs', 'End-to-End AI Pipeline'],
    transcript: [
      {
        id: 't-13-1',
        timestampSeconds: 17170,
        timestampLabel: '4:46:10',
        heading: 'Making reliable HTTP API requests',
        summary:
          'Always pass an explicit `timeout=10` to `requests.get/post` and call `response.raise_for_status()` before decoding `.json()` so 4xx/5xx failures surface cleanly.',
        takeaway: 'Never omit `timeout` on network calls—otherwise a hung socket freezes your process indefinitely.',
      },
      {
        id: 't-13-2',
        timestampSeconds: 17520,
        timestampLabel: '4:52:00',
        heading: 'Connecting Python fundamentals to AI agents',
        summary:
          'An AI agent is simply a Python loop: maintain a list of message dicts, call a model API with typed tool definitions, parse JSON tool arguments, execute Python functions, and append results back.',
        takeaway: 'Everything you learned in these 5 hours—dicts, loops, functions, errors, dataclasses, `.env`—is the entire foundation of AI agents.',
      },
    ],
    excerpts: [
      {
        id: 'ex-13-1',
        timestampSeconds: 17610,
        timestampLabel: '4:53:30',
        quote: 'Strip away the hype and an AI agent is a `while` loop, a list of dictionaries, structured JSON, and solid error handling.',
        whyItMatters: 'Demystifies AI engineering and shows how foundational Python directly powers modern agents.',
      },
    ],
    caseStudies: [
      {
        id: 'cs-13-1',
        title: 'End-to-End Document Triage Micro-Pipeline',
        domain: 'Applied AI Systems',
        scenario:
          'Ingest incoming customer feedback via webhook, normalize text, classify priority via an LLM JSON schema, and store structured summaries.',
        solutionSummary:
          'Combining every concept from Modules 1–13 yields a 40-line resilient Python service with clear separation between data models, HTTP transport, and prompt logic.',
        codeSnippet: `from dataclasses import dataclass\n\n@dataclass\nclass TriageResult:\n    category: str\n    priority: str\n    summary: str\n\ndef format_alert(item: TriageResult) -> str:\n    return f"[{item.priority.upper()}] ({item.category}) {item.summary}"`,
      },
    ],
    interviewQuestions: [
      {
        id: 'iq-13-1',
        question: 'Walk through the core Python control loop behind a tool-calling AI agent and name two safeguards you must include.',
        difficulty: 'Applied',
        keyPoints: [
          'Loop: send message history + tool specs -> inspect if model requested tool call -> execute local Python function -> append tool result -> repeat until final answer',
          'Safeguard 1: Hard `max_iterations` cap to prevent infinite tool-calling loops',
          'Safeguard 2: Argument schema validation + `try/except` around tool execution so failures return structured errors to the model',
        ],
        modelAnswer:
          'An agent runs a bounded `while` loop sending conversation history to an LLM, executing requested tool functions with validated JSON arguments, and appending results until a terminal answer is returned. Essential safeguards include a strict `max_iterations` cap, network timeouts, and exception catching around every tool invocation.',
      },
    ],
    linkedDsaIds: ['dsa-top-k-chunks', 'dsa-lru-prompt-cache'],
  },
];
