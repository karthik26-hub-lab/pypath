/**
 * Bespoke, storytelling SVG visual infographics for each of the 13 course chapters.
 * Designed to communicate the core mental model at a glance—used both inside the
 * interactive Ruled Notebook UI and embedded directly into downloaded Visual Book exports.
 */

export function getTopicInfographicSvg(moduleId: string, dark = false): string {
  const stroke = dark ? '#A39A8E' : '#4C453D';
  const muted = dark ? '#8C8175' : '#696056';
  const text = dark ? '#F4EFE6' : '#1B1815';
  const surface = dark ? '#221E1A' : '#FCFBF8';
  const accent = dark ? '#E5A93C' : '#B8621B';
  const accentSoft = dark ? 'rgba(229,169,60,0.16)' : '#FBF2E1';
  const emerald = dark ? '#4EA87E' : '#236B4E';
  const emeraldSoft = dark ? 'rgba(78,168,126,0.16)' : '#EAF5EF';
  const amber = dark ? '#E5A93C' : '#A66315';
  const amberSoft = dark ? 'rgba(229,169,60,0.14)' : '#FDF4E3';
  const rose = dark ? '#DF7A66' : '#B94A38';
  const roseSoft = dark ? 'rgba(223,122,102,0.15)' : '#FBECE9';

  const wrap = (inner: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 220" role="img" style="width:100%;height:auto;display:block;font-family:'DM Sans',system-ui,sans-serif;">
      <defs>
        <marker id="arr-${moduleId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="${stroke}"/>
        </marker>
      </defs>
      ${inner}
    </svg>`;

  switch (moduleId) {
    case 'mod-01-overview':
      return wrap(`
        <rect x="24" y="42" width="170" height="130" rx="12" fill="${surface}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="109" y="74" text-anchor="middle" font-size="13" font-weight="700" fill="${accent}">Python Layer (20%)</text>
        <text x="109" y="102" text-anchor="middle" font-size="11.5" fill="${text}">Prompts · Loops · APIs</text>
        <text x="109" y="122" text-anchor="middle" font-size="11.5" fill="${text}">JSON · Error Guards</text>
        <text x="109" y="148" text-anchor="middle" font-size="10.5" fill="${muted}">Fast to read &amp; iterate</text>

        <line x1="202" y1="107" x2="254" y2="107" stroke="${stroke}" stroke-width="1.8" marker-end="url(#arr-${moduleId})"/>

        <rect x="262" y="42" width="166" height="130" rx="12" fill="${accentSoft}" stroke="${accent}" stroke-width="1.5"/>
        <text x="345" y="74" text-anchor="middle" font-size="13" font-weight="700" fill="${accent}">C / CUDA Engines</text>
        <text x="345" y="102" text-anchor="middle" font-size="11.5" fill="${text}">PyTorch · NumPy</text>
        <text x="345" y="122" text-anchor="middle" font-size="11.5" fill="${text}">Vector Math · GPUs</text>
        <text x="345" y="148" text-anchor="middle" font-size="10.5" fill="${muted}">Compiled speed underneath</text>

        <line x1="436" y1="107" x2="488" y2="107" stroke="${stroke}" stroke-width="1.8" marker-end="url(#arr-${moduleId})"/>

        <rect x="496" y="42" width="160" height="130" rx="12" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="576" y="74" text-anchor="middle" font-size="13" font-weight="700" fill="${emerald}">Production AI</text>
        <text x="576" y="102" text-anchor="middle" font-size="11.5" fill="${text}">RAG Pipelines</text>
        <text x="576" y="122" text-anchor="middle" font-size="11.5" fill="${text}">Autonomous Agents</text>
        <text x="576" y="148" text-anchor="middle" font-size="10.5" fill="${muted}">Shipped, not just watched</text>
      `);

    case 'mod-02-setup':
      return wrap(`
        <rect x="30" y="34" width="620" height="152" rx="14" fill="${surface}" stroke="${stroke}" stroke-width="1.4" stroke-dasharray="5 4"/>
        <text x="54" y="60" font-size="11.5" font-weight="700" fill="${muted}">VS CODE FAST-FEEDBACK LOOP</text>
        <rect x="54" y="76" width="150" height="82" rx="10" fill="${accentSoft}" stroke="${accent}" stroke-width="1.5"/>
        <text x="129" y="108" text-anchor="middle" font-size="12.5" font-weight="700" fill="${text}">1. Write .py</text>
        <text x="129" y="130" text-anchor="middle" font-size="11" fill="${muted}">Select .venv interpreter</text>

        <line x1="210" y1="117" x2="254" y2="117" stroke="${stroke}" stroke-width="1.6" marker-end="url(#arr-${moduleId})"/>

        <rect x="262" y="76" width="156" height="82" rx="10" fill="${amberSoft}" stroke="${amber}" stroke-width="1.5"/>
        <text x="340" y="108" text-anchor="middle" font-size="12.5" font-weight="700" fill="${text}">2. Pylance + Ruff</text>
        <text x="340" y="130" text-anchor="middle" font-size="11" fill="${muted}">Catch types &amp; format</text>

        <line x1="424" y1="117" x2="468" y2="117" stroke="${stroke}" stroke-width="1.6" marker-end="url(#arr-${moduleId})"/>

        <rect x="476" y="76" width="150" height="82" rx="10" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="551" y="108" text-anchor="middle" font-size="12.5" font-weight="700" fill="${text}">3. Run / Cell</text>
        <text x="551" y="130" text-anchor="middle" font-size="11" fill="${muted}">Verify live output</text>
      `);

    case 'mod-03-environments':
      return wrap(`
        <rect x="24" y="28" width="260" height="164" rx="12" fill="${roseSoft}" stroke="${rose}" stroke-width="1.5"/>
        <text x="154" y="54" text-anchor="middle" font-size="12.5" font-weight="700" fill="${rose}">Global Python (Conflict Zone)</text>
        <rect x="46" y="70" width="216" height="44" rx="8" fill="${surface}" stroke="${rose}" stroke-width="1"/>
        <text x="154" y="96" text-anchor="middle" font-size="11" fill="${text}">App A wants pydantic==1.10</text>
        <rect x="46" y="126" width="216" height="44" rx="8" fill="${surface}" stroke="${rose}" stroke-width="1"/>
        <text x="154" y="152" text-anchor="middle" font-size="11" fill="${text}">App B overwrites pydantic==2.9 ✕</text>

        <line x1="296" y1="110" x2="346" y2="110" stroke="${stroke}" stroke-width="1.8" marker-end="url(#arr-${moduleId})"/>

        <rect x="358" y="28" width="298" height="164" rx="12" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="507" y="54" text-anchor="middle" font-size="12.5" font-weight="700" fill="${emerald}">Isolated .venv + uv.lock</text>
        <rect x="378" y="72" width="122" height="96" rx="8" fill="${surface}" stroke="${emerald}" stroke-width="1.2"/>
        <text x="439" y="102" text-anchor="middle" font-size="11.5" font-weight="700" fill="${text}">Project A</text>
        <text x="439" y="124" text-anchor="middle" font-size="10.5" fill="${muted}">.venv/</text>
        <text x="439" y="144" text-anchor="middle" font-size="10.5" fill="${emerald}">pydantic 1.10 ✓</text>

        <rect x="514" y="72" width="122" height="96" rx="8" fill="${surface}" stroke="${emerald}" stroke-width="1.2"/>
        <text x="575" y="102" text-anchor="middle" font-size="11.5" font-weight="700" fill="${text}">Project B</text>
        <text x="575" y="124" text-anchor="middle" font-size="10.5" fill="${muted}">.venv/</text>
        <text x="575" y="144" text-anchor="middle" font-size="10.5" fill="${emerald}">pydantic 2.9 ✓</text>
      `);

    case 'mod-04-variables-types':
      return wrap(`
        <rect x="28" y="36" width="150" height="44" rx="8" fill="${accentSoft}" stroke="${accent}" stroke-width="1.5"/>
        <text x="103" y="63" text-anchor="middle" font-size="12" font-family="JetBrains Mono,monospace" fill="${text}">model = "flash"</text>

        <rect x="28" y="96" width="150" height="44" rx="8" fill="${amberSoft}" stroke="${amber}" stroke-width="1.5"/>
        <text x="103" y="123" text-anchor="middle" font-size="12" font-family="JetBrains Mono,monospace" fill="${text}">temp = 0.0</text>

        <rect x="28" y="154" width="150" height="40" rx="8" fill="${surface}" stroke="${stroke}" stroke-width="1.4"/>
        <text x="103" y="179" text-anchor="middle" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${muted}">cache = None</text>

        <line x1="184" y1="58" x2="256" y2="92" stroke="${stroke}" stroke-width="1.5" marker-end="url(#arr-${moduleId})"/>
        <line x1="184" y1="118" x2="256" y2="114" stroke="${stroke}" stroke-width="1.5" marker-end="url(#arr-${moduleId})"/>
        <line x1="184" y1="174" x2="256" y2="138" stroke="${stroke}" stroke-width="1.5" marker-end="url(#arr-${moduleId})"/>

        <rect x="266" y="42" width="384" height="142" rx="12" fill="${surface}" stroke="${accent}" stroke-width="1.6"/>
        <text x="290" y="72" font-size="12" font-weight="700" fill="${accent}">Clean f-String Prompt Composition</text>
        <text x="290" y="102" font-size="12" font-family="JetBrains Mono,monospace" fill="${text}">f"Model: {model} | Temp: {temp:.1f}"</text>
        <line x1="290" y1="120" x2="624" y2="120" stroke="${stroke}" stroke-opacity="0.25"/>
        <text x="290" y="144" font-size="11.5" fill="${emerald}">✓ Use: if cache is None   (keeps temp=0.0 safe!)</text>
        <text x="290" y="166" font-size="11.5" fill="${rose}">✕ Avoid: if not temp      (0.0 looks falsy!)</text>
      `);

    case 'mod-05-control-flow':
      return wrap(`
        <rect x="26" y="74" width="124" height="68" rx="10" fill="${surface}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="88" y="104" text-anchor="middle" font-size="12" font-weight="700" fill="${text}">Incoming</text>
        <text x="88" y="124" text-anchor="middle" font-size="11" fill="${muted}">Prompt + Score</text>

        <line x1="154" y1="108" x2="196" y2="108" stroke="${stroke}" stroke-width="1.6" marker-end="url(#arr-${moduleId})"/>

        <rect x="204" y="24" width="194" height="50" rx="9" fill="${roseSoft}" stroke="${rose}" stroke-width="1.4"/>
        <text x="301" y="54" text-anchor="middle" font-size="11.5" font-weight="600" fill="${text}">Guard 1: empty? → return invalid</text>

        <rect x="204" y="85" width="194" height="50" rx="9" fill="${amberSoft}" stroke="${amber}" stroke-width="1.4"/>
        <text x="301" y="115" text-anchor="middle" font-size="11.5" font-weight="600" fill="${text}">Guard 2: conf &lt; 0.65 → Pro Model</text>

        <rect x="204" y="146" width="194" height="50" rx="9" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="301" y="176" text-anchor="middle" font-size="11.5" font-weight="700" fill="${text}">Happy Path → Fast Flash</text>

        <line x1="404" y1="171" x2="466" y2="171" stroke="${emerald}" stroke-width="1.8" marker-end="url(#arr-${moduleId})"/>
        <rect x="474" y="142" width="180" height="58" rx="10" fill="${surface}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="564" y="168" text-anchor="middle" font-size="12" font-weight="700" fill="${emerald}">Flat, Readable Code</text>
        <text x="564" y="186" text-anchor="middle" font-size="10.5" fill="${muted}">Zero 4-level nesting</text>
      `);

    case 'mod-06-loops':
      return wrap(`
        <text x="36" y="40" font-size="12" font-weight="700" fill="${accent}">SLIDING WINDOW (k = 3) — O(n) SINGLE PASS</text>
        <g font-family="JetBrains Mono,monospace" font-size="13" font-weight="600">
          <rect x="36" y="64" width="76" height="56" rx="8" fill="${surface}" stroke="${stroke}" stroke-width="1.4"/>
          <text x="74" y="97" text-anchor="middle" fill="${muted}">2</text>

          <rect x="122" y="58" width="256" height="68" rx="12" fill="${accentSoft}" stroke="${accent}" stroke-width="2"/>
          <rect x="132" y="68" width="72" height="48" rx="7" fill="${surface}" stroke="${accent}" stroke-width="1.2"/>
          <text x="168" y="97" text-anchor="middle" fill="${text}">1</text>
          <rect x="214" y="68" width="72" height="48" rx="7" fill="${surface}" stroke="${accent}" stroke-width="1.2"/>
          <text x="250" y="97" text-anchor="middle" fill="${text}">5</text>
          <rect x="296" y="68" width="72" height="48" rx="7" fill="${surface}" stroke="${accent}" stroke-width="1.2"/>
          <text x="332" y="97" text-anchor="middle" fill="${text}">3</text>

          <rect x="392" y="64" width="76" height="56" rx="8" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.6"/>
          <text x="430" y="97" text-anchor="middle" fill="${emerald}">+4</text>
        </g>
        <text x="168" y="152" text-anchor="middle" font-size="11.5" fill="${rose}">− drop left (1)</text>
        <text x="430" y="152" text-anchor="middle" font-size="11.5" fill="${emerald}">+ add right (4)</text>
        <rect x="498" y="56" width="154" height="84" rx="10" fill="${surface}" stroke="${stroke}" stroke-width="1.4"/>
        <text x="575" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="${text}">Window Sum</text>
        <text x="575" y="114" text-anchor="middle" font-size="13" font-family="JetBrains Mono,monospace" fill="${accent}">9 → 12</text>
        <text x="36" y="194" font-size="11.5" fill="${muted}">Re-use the running sum instead of re-adding all k elements on every step.</text>
      `);

    case 'mod-07-lists-tuples-sets':
      return wrap(`
        <rect x="24" y="30" width="194" height="162" rx="12" fill="${surface}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="121" y="58" text-anchor="middle" font-size="13" font-weight="700" fill="${text}">List  [a, b, c]</text>
        <text x="121" y="84" text-anchor="middle" font-size="11.5" fill="${muted}">Ordered · Mutable</text>
        <text x="121" y="118" text-anchor="middle" font-size="12.5" font-family="JetBrains Mono,monospace" fill="${amber}">x in list → O(n)</text>
        <text x="121" y="154" text-anchor="middle" font-size="11" fill="${muted}">Scans item by item</text>

        <rect x="242" y="30" width="194" height="162" rx="12" fill="${surface}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="339" y="58" text-anchor="middle" font-size="13" font-weight="700" fill="${text}">Tuple  (a, b)</text>
        <text x="339" y="84" text-anchor="middle" font-size="11.5" fill="${muted}">Ordered · Immutable</text>
        <text x="339" y="118" text-anchor="middle" font-size="12.5" font-family="JetBrains Mono,monospace" fill="${accent}">Hashable Key ✓</text>
        <text x="339" y="154" text-anchor="middle" font-size="11" fill="${muted}">Fixed records &amp; unpacking</text>

        <rect x="460" y="30" width="196" height="162" rx="12" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.6"/>
        <text x="558" y="58" text-anchor="middle" font-size="13" font-weight="700" fill="${emerald}">Set  {a, b, c}</text>
        <text x="558" y="84" text-anchor="middle" font-size="11.5" fill="${muted}">Unique · Hash Table</text>
        <text x="558" y="118" text-anchor="middle" font-size="12.5" font-family="JetBrains Mono,monospace" fill="${emerald}">x in set → O(1)</text>
        <text x="558" y="154" text-anchor="middle" font-size="11" fill="${text}">Instant dedup &amp; lookup</text>
      `);

    case 'mod-08-dicts-json':
      return wrap(`
        <rect x="24" y="34" width="234" height="152" rx="12" fill="${surface}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="44" y="60" font-size="11.5" font-weight="700" fill="${muted}">RAW JSON API RESPONSE</text>
        <text x="44" y="88" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">{"role": "assistant",</text>
        <text x="44" y="110" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}"> "usage": {"tokens": 412}}</text>
        <text x="44" y="156" font-size="11" fill="${accent}">json.loads(raw) → dict</text>

        <line x1="266" y1="110" x2="318" y2="110" stroke="${stroke}" stroke-width="1.8" marker-end="url(#arr-${moduleId})"/>

        <rect x="328" y="34" width="328" height="152" rx="12" fill="${accentSoft}" stroke="${accent}" stroke-width="1.5"/>
        <text x="348" y="62" font-size="12" font-weight="700" fill="${accent}">Safe Nested Dict Access (Zero KeyError)</text>
        <rect x="348" y="78" width="288" height="40" rx="8" fill="${surface}" stroke="${accent}" stroke-width="1.2"/>
        <text x="362" y="103" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${emerald}">data.get("usage", {}).get("tokens", 0)</text>
        <text x="348" y="144" font-size="11.5" fill="${text}">• O(1) lookup by hashable key</text>
        <text x="348" y="166" font-size="11.5" fill="${text}">• Powers counting, grouping &amp; Two-Sum</text>
      `);

    case 'mod-09-functions':
      return wrap(`
        <rect x="24" y="30" width="300" height="162" rx="12" fill="${roseSoft}" stroke="${rose}" stroke-width="1.5"/>
        <text x="44" y="56" font-size="12" font-weight="700" fill="${rose}">✕ The Mutable Default Trap</text>
        <text x="44" y="86" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">def add(msg, history=[]):</text>
        <text x="44" y="116" font-size="11.5" fill="${text}">User A → ["hi"]</text>
        <text x="44" y="140" font-size="11.5" fill="${rose}">User B → ["hi", "secret"]  ← LEAK!</text>
        <text x="44" y="170" font-size="10.5" fill="${muted}">Same list reused across every call</text>

        <rect x="352" y="30" width="304" height="162" rx="12" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="372" y="56" font-size="12" font-weight="700" fill="${emerald}">✓ The Clean Pythonic Pattern</text>
        <text x="372" y="86" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">def add(msg, history=None):</text>
        <text x="372" y="110" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">  msgs = list(history or [])</text>
        <text x="372" y="142" font-size="11.5" fill="${emerald}">User A → ["hi"]  |  User B → ["hello"]</text>
        <text x="372" y="170" font-size="10.5" fill="${muted}">Fresh isolated list on every call</text>
      `);

    case 'mod-10-error-handling':
      return wrap(`
        <text x="32" y="38" font-size="12" font-weight="700" fill="${accent}">EXPONENTIAL BACKOFF ON HTTP 429 / 503</text>
        <line x1="44" y1="168" x2="628" y2="168" stroke="${stroke}" stroke-width="1.4"/>
        <rect x="64" y="138" width="84" height="30" rx="6" fill="${accentSoft}" stroke="${accent}" stroke-width="1.5"/>
        <text x="106" y="158" text-anchor="middle" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">200ms</text>
        <text x="106" y="188" text-anchor="middle" font-size="10.5" fill="${muted}">Try 1</text>

        <rect x="184" y="114" width="84" height="54" rx="6" fill="${accentSoft}" stroke="${accent}" stroke-width="1.5"/>
        <text x="226" y="146" text-anchor="middle" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">400ms</text>
        <text x="226" y="188" text-anchor="middle" font-size="10.5" fill="${muted}">Try 2</text>

        <rect x="304" y="80" width="84" height="88" rx="6" fill="${amberSoft}" stroke="${amber}" stroke-width="1.5"/>
        <text x="346" y="128" text-anchor="middle" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">800ms</text>
        <text x="346" y="188" text-anchor="middle" font-size="10.5" fill="${muted}">Try 3</text>

        <rect x="424" y="64" width="84" height="104" rx="6" fill="${amberSoft}" stroke="${amber}" stroke-width="1.5"/>
        <text x="466" y="120" text-anchor="middle" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">1000ms</text>
        <text x="466" y="188" text-anchor="middle" font-size="10.5" fill="${muted}">Cap hit</text>

        <rect x="536" y="64" width="112" height="84" rx="10" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="592" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="${emerald}">200 OK ✓</text>
        <text x="592" y="124" text-anchor="middle" font-size="10.5" fill="${text}">Pipeline survives</text>
      `);

    case 'mod-11-oop-dataclasses':
      return wrap(`
        <rect x="32" y="34" width="268" height="154" rx="12" fill="${surface}" stroke="${accent}" stroke-width="1.6"/>
        <text x="52" y="62" font-size="12" font-weight="700" fill="${accent}">@dataclass  ConversationBuffer</text>
        <line x1="48" y1="74" x2="282" y2="74" stroke="${stroke}" stroke-opacity="0.25"/>
        <text x="52" y="98" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">max_messages: int = 10</text>
        <text x="52" y="120" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${text}">items: list[Message] = field(...)</text>
        <line x1="48" y1="136" x2="282" y2="136" stroke="${stroke}" stroke-opacity="0.25"/>
        <text x="52" y="162" font-size="11.5" font-family="JetBrains Mono,monospace" fill="${emerald}">+ add(role, content) → caps len</text>

        <line x1="308" y1="110" x2="366" y2="110" stroke="${stroke}" stroke-width="1.8" marker-end="url(#arr-${moduleId})"/>

        <rect x="376" y="42" width="274" height="138" rx="12" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="396" y="72" font-size="12" font-weight="700" fill="${emerald}">Auto-Generated For Free</text>
        <text x="396" y="102" font-size="11.5" fill="${text}">• __init__() constructor</text>
        <text x="396" y="126" font-size="11.5" fill="${text}">• __repr__() clean debug print</text>
        <text x="396" y="150" font-size="11.5" fill="${text}">• __eq__() value comparison</text>
      `);

    case 'mod-12-files-env-git':
      return wrap(`
        <rect x="26" y="34" width="280" height="154" rx="12" fill="${roseSoft}" stroke="${rose}" stroke-width="1.5"/>
        <text x="48" y="62" font-size="12" font-weight="700" fill="${rose}">LOCAL ONLY (.gitignore)</text>
        <text x="48" y="96" font-size="12" font-family="JetBrains Mono,monospace" fill="${text}">.env</text>
        <text x="48" y="122" font-size="11" font-family="JetBrains Mono,monospace" fill="${rose}">GEMINI_API_KEY="AIza...secret"</text>
        <text x="48" y="160" font-size="11" fill="${muted}">Never leaves your machine or secrets vault</text>

        <line x1="314" y1="110" x2="364" y2="110" stroke="${stroke}" stroke-width="1.8" stroke-dasharray="4 3" marker-end="url(#arr-${moduleId})"/>

        <rect x="374" y="34" width="280" height="154" rx="12" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="396" y="62" font-size="12" font-weight="700" fill="${emerald}">SAFE IN GIT REPO</text>
        <text x="396" y="96" font-size="12" font-family="JetBrains Mono,monospace" fill="${text}">app.py  +  .env.example</text>
        <text x="396" y="122" font-size="11" font-family="JetBrains Mono,monospace" fill="${emerald}">key = os.getenv("GEMINI_API_KEY")</text>
        <text x="396" y="160" font-size="11" fill="${text}">Loaded at runtime + pathlib paths</text>
      `);

    case 'mod-13-apis-ai':
    default:
      return wrap(`
        <text x="32" y="34" font-size="12" font-weight="700" fill="${accent}">THE AI AGENT LOOP (BOUNDED WHILE + JSON + TOOLS)</text>
        <rect x="32" y="64" width="136" height="72" rx="10" fill="${surface}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="100" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="${text}">1. Messages</text>
        <text x="100" y="116" text-anchor="middle" font-size="10.5" fill="${muted}">list[dict]</text>

        <line x1="172" y1="100" x2="206" y2="100" stroke="${stroke}" stroke-width="1.6" marker-end="url(#arr-${moduleId})"/>

        <rect x="212" y="64" width="136" height="72" rx="10" fill="${accentSoft}" stroke="${accent}" stroke-width="1.5"/>
        <text x="280" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="${accent}">2. LLM API</text>
        <text x="280" y="116" text-anchor="middle" font-size="10.5" fill="${muted}">timeout + retry</text>

        <line x1="352" y1="100" x2="386" y2="100" stroke="${stroke}" stroke-width="1.6" marker-end="url(#arr-${moduleId})"/>

        <rect x="392" y="64" width="136" height="72" rx="10" fill="${amberSoft}" stroke="${amber}" stroke-width="1.5"/>
        <text x="460" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="${text}">3. Tool Call?</text>
        <text x="460" y="116" text-anchor="middle" font-size="10.5" fill="${muted}">Run Python fn</text>

        <line x1="532" y1="100" x2="562" y2="100" stroke="${emerald}" stroke-width="1.6" marker-end="url(#arr-${moduleId})"/>

        <rect x="568" y="64" width="88" height="72" rx="10" fill="${emeraldSoft}" stroke="${emerald}" stroke-width="1.5"/>
        <text x="612" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="${emerald}">Final</text>
        <text x="612" y="116" text-anchor="middle" font-size="10.5" fill="${text}">Answer ✓</text>

        <path d="M 460 138 L 460 176 L 100 176 L 100 142" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arr-${moduleId})"/>
        <text x="280" y="196" text-anchor="middle" font-size="11" fill="${accent}">Append tool result &amp; loop (guard: step &lt; max_iterations)</text>
      `);
  }
}

interface TopicInfographicProps {
  moduleId: string;
  dark: boolean;
  caption?: string;
}

export function TopicInfographic({ moduleId, dark, caption }: TopicInfographicProps) {
  const svgMarkup = getTopicInfographicSvg(moduleId, dark);
  return (
    <figure className="space-y-2.5">
      <div
        className={`w-full rounded-xl border p-3.5 sm:p-5 overflow-hidden transition-colors ${
          dark
            ? 'border-[#2E2924] bg-[#141210]/90'
            : 'border-[#E5DEC9] bg-[#FCFBF8]/95'
        }`}
        // Safe: strictly controlled internal static SVG markup keyed by moduleId
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
      {caption && (
        <figcaption
          className={`text-xs italic text-center ${
            dark ? 'text-[#A39A8E]' : 'text-[#696056]'
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
