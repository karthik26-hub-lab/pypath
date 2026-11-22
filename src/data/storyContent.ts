export interface ChapterStoryMeta {
  moduleId: string;
  xpReward: number;
  storyHook: string;
  completionQuip: string;
  visualCaption: string;
  handwrittenBullets: string[];
  marginDoodleNote: string;
}

export const CHAPTER_STORIES: Record<string, ChapterStoryMeta> = {
  'mod-01-overview': {
    moduleId: 'mod-01-overview',
    xpReward: 100,
    storyHook:
      'How to stop hoarding 47 half-watched tutorials and start shipping actual Python scripts.',
    completionQuip:
      'Chapter 01 cleared. You officially graduated from passive video watcher to active builder.',
    visualCaption: 'The 20% Python core that drives 90% of real AI systems.',
    handwrittenBullets: [
      'Python is the steering wheel; compiled C & CUDA do the heavy GPU lifting underneath.',
      'Passive watching feels productive until the blank editor stares back—type every pattern yourself.',
      'Read Python tracebacks from the bottom line up: what broke first, where it broke second.',
    ],
    marginDoodleNote: 'Rule #1: Break code on purpose to learn twice as fast.',
  },
  'mod-02-setup': {
    moduleId: 'mod-02-setup',
    xpReward: 110,
    storyHook:
      'Turning VS Code from a glorified notepad into an editor that catches bugs before you hit Run.',
    completionQuip:
      'Environment calibrated. Your editor now spots typos faster than caffeine kicks in.',
    visualCaption: 'Instant static feedback loop inside a modern Python workspace.',
    handwrittenBullets: [
      'Always check the bottom-right Python interpreter in VS Code before panicking over imports.',
      'Pylance catches type mismatches statically; Ruff formats & lints on save in milliseconds.',
      'Use interactive cells for quick experiments, clean .py modules for anything you reuse.',
    ],
    marginDoodleNote: 'Squiggly underline = free senior code review.',
  },
  'mod-03-environments': {
    moduleId: 'mod-03-environments',
    xpReward: 120,
    storyHook:
      'Why installing packages globally eventually turns your laptop into a dependency crime scene.',
    completionQuip:
      'Dependencies quarantined. Your future self just sent a thank-you note from deployment day.',
    visualCaption: 'Isolated project environments vs global dependency collisions.',
    handwrittenBullets: [
      'One project = one disposable .venv. Delete and rebuild anytime from pyproject.toml + uv.lock.',
      'Never commit .venv/ to Git—commit the recipe (lockfile), not the kitchen.',
      'Pin AI SDK versions so a silent Tuesday release never breaks Wednesday’s prompts.',
    ],
    marginDoodleNote: 'uv sync -> reproducible builds in < 1s.',
  },
  'mod-04-variables-types': {
    moduleId: 'mod-04-variables-types',
    xpReward: 120,
    storyHook:
      'Why 0.1 + 0.2 refuses to equal 0.3, and how f-strings turn messy text into crisp LLM prompts.',
    completionQuip:
      'Types tamed. You now know why temperature=0.0 is innocent and should never fail an `if not` check.',
    visualCaption: 'Variables point to typed objects; f-strings compose clean prompt templates.',
    handwrittenBullets: [
      'Variables are sticky notes attached to objects—use clear snake_case like max_tokens.',
      'Strings are immutable: .strip() and .lower() return fresh copies; never mutate in place.',
      'Always test `if val is None:` so legitimate zeros (0, 0.0) are never treated as missing.',
    ],
    marginDoodleNote: 'f"{cost:.4f}" saves you from 0.300000000004.',
  },
  'mod-05-control-flow': {
    moduleId: 'mod-05-control-flow',
    xpReward: 120,
    storyHook:
      'Escaping the five-level-deep `if` pyramid using guard clauses that read like clean English.',
    completionQuip:
      'Nested pyramids demolished. Your code now reads top-to-bottom without horizontal scrolling.',
    visualCaption: 'Early-return guard clauses route fast vs reasoning models cleanly.',
    handwrittenBullets: [
      'Chain bounds naturally: `0.0 <= confidence <= 1.0` beats verbose double conditions.',
      'Short-circuit `and` puts safety guards on the left (`count > 0 and total / count`).',
      'Reject invalid edge cases first and return early—keep the happy path flat.',
    ],
    marginDoodleNote: 'Flat is better than nested (Zen of Python).',
  },
  'mod-06-loops': {
    moduleId: 'mod-06-loops',
    xpReward: 130,
    storyHook:
      'Batching 2,450 RAG chunks without a single off-by-one bug—and knowing when a comprehension goes too far.',
    completionQuip:
      'Loops mastered. Zero infinite `while` loops were harmed during this chapter.',
    visualCaption: 'Chunk batching & sliding windows transform streams linearly.',
    handwrittenBullets: [
      'Reach for `enumerate()` and `zip()` instead of clunky `range(len(items))` index math.',
      'Every `while` loop that talks to an API needs a hard `max_attempts` ceiling.',
      'Comprehensions shine at 1 level deep; if nested past 2, write a clear `for` loop.',
    ],
    marginDoodleNote: 'Generator `(x for x)` = O(1) RAM streaming.',
  },
  'mod-07-lists-tuples-sets': {
    moduleId: 'mod-07-lists-tuples-sets',
    xpReward: 130,
    storyHook:
      'Lists are friendly until `x in list` takes 12 seconds and a Set solves it before you blink.',
    completionQuip:
      'Collection intuition unlocked. You just shaved orders of magnitude off membership lookups.',
    visualCaption: 'Choosing List vs Tuple vs Set by access pattern and Big-O cost.',
    handwrittenBullets: [
      'Assignment `b = a` shares the same list in memory—use `a.copy()` for independence.',
      'Tuples signal immutable fixed records and unpack cleanly: `model, ms = ("flash", 94)`.',
      'Sets give O(1) average lookup—ideal for deduplicating ranked RAG document IDs.',
    ],
    marginDoodleNote: 'List scan = O(n). Hash set jump = O(1).',
  },
  'mod-08-dicts-json': {
    moduleId: 'mod-08-dicts-json',
    xpReward: 140,
    storyHook:
      'Spoiler alert: almost every AI API payload on Earth is just nested Python dictionaries wearing a JSON suit.',
    completionQuip:
      'Dicts & JSON conquered. `KeyError` no longer stands a chance in your API parsers.',
    visualCaption: 'JSON wire payloads map 1-to-1 into nested Python dictionaries.',
    handwrittenBullets: [
      'Chain `.get("usage", {}).get("tokens", 0)` so missing external API fields never crash you.',
      'Hash maps unlock O(n) frequency counters, intent grouping, and Two-Sum lookups.',
      'Dict keys must be hashable (strings, ints, tuples)—never mutable lists.',
    ],
    marginDoodleNote: '85% of AI SDKs = lists + dicts + functions.',
  },
  'mod-09-functions': {
    moduleId: 'mod-09-functions',
    xpReward: 140,
    storyHook:
      'The infamous `history=[]` bug that accidentally leaks User A’s private chat into User B’s session.',
    completionQuip:
      'Clean architecture unlocked. Your functions return real data and guard their entrypoints.',
    visualCaption: 'Pure input -> transform -> return pipelines vs shared mutable defaults.',
    handwrittenBullets: [
      'Return values from functions instead of only calling `print()` so callers can test & compose them.',
      'Never use mutable defaults (`items=[]`); default to `None` and allocate inside the body.',
      'Protect executable script code behind `if __name__ == "__main__":` for safe imports.',
    ],
    marginDoodleNote: 'Default args evaluate ONCE at def-time!',
  },
  'mod-10-error-handling': {
    moduleId: 'mod-10-error-handling',
    xpReward: 130,
    storyHook:
      'How a single lazy `except: pass` turns a 2-minute typo into a 4-hour midnight mystery.',
    completionQuip:
      'Resilience upgraded. Your API pipelines now shrug off HTTP 429 hiccups with exponential backoff.',
    visualCaption: 'Targeted exception handling + capped exponential backoff staircase.',
    handwrittenBullets: [
      'Catch specific errors (`JSONDecodeError`, `TimeoutError`), never bare `except:`.',
      'Keep `try` blocks tiny so you always know which exact line failed.',
      'Back off exponentially (`base * 2**attempt`) on 429/503; fail fast on 401 auth errors.',
    ],
    marginDoodleNote: 'try (risky) -> else (ok) -> finally (cleanup).',
  },
  'mod-11-oop-dataclasses': {
    moduleId: 'mod-11-oop-dataclasses',
    xpReward: 130,
    storyHook:
      'When a class actually earns its keep—and how `@dataclass` deletes 30 lines of boilerplate.',
    completionQuip:
      'Object modeling mastered. Your agent memory buffers now carry clean, self-documenting schemas.',
    visualCaption: 'Dataclass blueprint + composition beats tangled inheritance trees.',
    handwrittenBullets: [
      'Use functions for stateless transforms; use classes when state & behavior live together.',
      '`@dataclass` auto-writes `__init__`, `__repr__`, and `__eq__` from your type hints.',
      'Use `field(default_factory=list)` inside dataclasses so instances never share mutable lists.',
    ],
    marginDoodleNote: 'Prefer composition over deep inheritance.',
  },
  'mod-12-files-env-git': {
    moduleId: 'mod-12-files-env-git',
    xpReward: 120,
    storyHook:
      'Hardcoding an API key into GitHub is the fastest speedrun to an unexpected $4,000 bill.',
    completionQuip:
      'Secrets locked down. `pathlib`, context managers, and `.env` hygiene are now muscle memory.',
    visualCaption: 'Safe secret boundary: `.env` stays local while `.env.example` ships to Git.',
    handwrittenBullets: [
      'Always use `with open(...) as f:` so file handles close automatically even on crashes.',
      '`Path("prompts") / "system.txt"` runs cleanly across Windows, macOS, and Linux.',
      'Keep secrets strictly in `.env`, add `.env` to `.gitignore`, and read via `os.getenv()`.',
    ],
    marginDoodleNote: 'If a key hits Git once -> rotate immediately.',
  },
  'mod-13-apis-ai': {
    moduleId: 'mod-13-apis-ai',
    xpReward: 160,
    storyHook:
      'Plot twist: strip away the sci-fi branding and most AI agents are a `while` loop, JSON, and solid error handling.',
    completionQuip:
      'Final chapter complete! You now hold the complete Python toolkit behind production AI agents.',
    visualCaption: 'The full AI Agent Loop uniting every chapter from 01 to 13.',
    handwrittenBullets: [
      'Always pass `timeout=10` and call `response.raise_for_status()` on every HTTP request.',
      'An AI agent loops: send history -> parse tool JSON -> run Python function -> append result.',
      'Always cap `max_iterations` and validate tool inputs before executing side effects.',
    ],
    marginDoodleNote: 'Loop + Dicts + Tools + Guards = AI Agent.',
  },
};

export interface RankTier {
  title: string;
  minXp: number;
  nextXp: number | null;
  tagline: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    title: 'Script Curious',
    minXp: 0,
    nextXp: 250,
    tagline: 'Warming up the interpreter and banishing tutorial purgatory.',
  },
  {
    title: 'Traceback Whisperer',
    minXp: 250,
    nextXp: 650,
    tagline: 'Reads stack traces bottom-up without flinching.',
  },
  {
    title: 'Dict & Loop Tactician',
    minXp: 650,
    nextXp: 1150,
    tagline: 'Turns messy JSON payloads into O(n) clean pipelines.',
  },
  {
    title: 'Pipeline Plumber',
    minXp: 1150,
    nextXp: 1750,
    tagline: 'Writes modular functions, dataclasses, and rock-solid retries.',
  },
  {
    title: 'Resilient API Crafter',
    minXp: 1750,
    nextXp: 2400,
    tagline: 'Ships fault-tolerant Python services ready for real traffic.',
  },
  {
    title: 'AI Systems Architect',
    minXp: 2400,
    nextXp: null,
    tagline: 'Full 5-hour mastery—ready to design and debug production AI agents.',
  },
];
