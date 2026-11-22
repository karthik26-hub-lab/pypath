import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Wand2,
  XCircle,
} from 'lucide-react';
import { COURSE_MODULES } from '../data/courseData';
import { DSA_PROBLEMS } from '../data/dsaProblems';
import { useStudy } from '../context/StudyContext';
import type { DebugAssistResponse, DsaProblem, PythonRunResponse } from '../types/course';

function renderFormattedText(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-[#EAE3D5] dark:bg-[#26221E] text-[#1B1815] dark:text-[#FAF6EC]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

interface DsaLabViewProps {
  selectedProblemId: string;
  onSelectProblem: (problemId: string) => void;
  onJumpToModule: (moduleId: string) => void;
}

export function DsaLabView({
  selectedProblemId,
  onSelectProblem,
  onJumpToModule,
}: DsaLabViewProps) {
  const { progress, submissions, markProblemSolved, saveProblemCode } = useStudy();
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium'>('All');

  const activeProblem: DsaProblem = useMemo(
    () => DSA_PROBLEMS.find((p) => p.id === selectedProblemId) ?? DSA_PROBLEMS[0],
    [selectedProblemId]
  );

  const linkedModule = useMemo(
    () => COURSE_MODULES.find((m) => m.id === activeProblem.moduleId),
    [activeProblem.moduleId]
  );

  const [code, setCode] = useState<string>(
    () => submissions[activeProblem.id]?.code ?? activeProblem.starterCode
  );
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<PythonRunResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const [debugging, setDebugging] = useState(false);
  const [debugPrompt, setDebugPrompt] = useState('');
  const [debugReport, setDebugReport] = useState<DebugAssistResponse | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const prevProblemIdRef = useRef<string>(activeProblem.id);

  useEffect(() => {
    if (prevProblemIdRef.current !== activeProblem.id) {
      prevProblemIdRef.current = activeProblem.id;
      setCode(submissions[activeProblem.id]?.code ?? activeProblem.starterCode);
      setRunResult(null);
      setRunError(null);
      setDebugReport(null);
      setDebugError(null);
      setShowSolution(false);
    }
  }, [activeProblem.id, activeProblem.starterCode, submissions]);

  const filteredProblems = useMemo(() => {
    if (difficultyFilter === 'All') return DSA_PROBLEMS;
    return DSA_PROBLEMS.filter((p) => p.difficulty === difficultyFilter);
  }, [difficultyFilter]);

  const handleRunTests = async () => {
    setRunning(true);
    setRunError(null);
    try {
      const res = await fetch('/api/python/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, problemId: activeProblem.id }),
      });
      const data = (await res.json()) as PythonRunResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute Python tests.');
      }
      setRunResult(data);
      markProblemSolved(activeProblem.id, code, data.passed);
    } catch (err) {
      setRunError(err instanceof Error ? err.message : 'Execution error.');
    } finally {
      setRunning(false);
    }
  };

  const handleDebugWithAi = async () => {
    setDebugging(true);
    setDebugError(null);
    try {
      const res = await fetch('/api/ai/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          stderr: runResult?.stderr || '',
          testResults: runResult?.results || [],
          problemId: activeProblem.id,
          question: debugPrompt.trim() || undefined,
        }),
      });
      const data = (await res.json()) as DebugAssistResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Unable to run AI debugging assistant.');
      }
      setDebugReport(data);
    } catch (err) {
      setDebugError(err instanceof Error ? err.message : 'AI debugger failed.');
    } finally {
      setDebugging(false);
    }
  };

  const handleResetCode = () => {
    setCode(activeProblem.starterCode);
    saveProblemCode(activeProblem.id, activeProblem.starterCode, false);
    setRunResult(null);
    setDebugReport(null);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextCode = `${code.slice(0, start)}    ${code.slice(end)}`;
      setCode(nextCode);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const isSolved = progress.solvedProblemIds.includes(activeProblem.id);

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT RAIL: Bite-Sized DSA Drill Index */}
        <aside className="lg:col-span-3 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] overflow-hidden">
          <div className="p-5 border-b border-[#DDD5C7] dark:border-[#26221E] space-y-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <h1 className="font-display text-lg font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                Python &amp; DSA Lab
              </h1>
              <span className="text-xs font-mono tabular-nums text-[#696056] dark:text-[#A39A8E]">
                {progress.solvedProblemIds.length}/{DSA_PROBLEMS.length}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[#EAE3D5] dark:bg-[#12100E]">
              {(['All', 'Easy', 'Medium'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficultyFilter(level)}
                  className={`py-1 text-xs font-medium rounded-full transition-colors ${
                    difficultyFilter === level
                      ? 'bg-[#FCFBF8] dark:bg-[#2B2621] text-[#1B1815] dark:text-[#FAF6EC]'
                      : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#EAE2D6] dark:divide-[#26221E] max-h-[560px] overflow-y-auto">
            {filteredProblems.map((prob) => {
              const active = prob.id === activeProblem.id;
              const solved = progress.solvedProblemIds.includes(prob.id);
              return (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => onSelectProblem(prob.id)}
                  className={`w-full text-left px-5 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C26D1F] ${
                    active
                      ? 'bg-[#FBF2E1]/80 dark:bg-[#262018] text-[#1B1815] dark:text-[#FAF6EC]'
                      : 'hover:bg-[#F3EDE2] dark:hover:bg-[#201C18] text-[#1B1815] dark:text-[#F4EFE6]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold leading-snug">{prob.title}</span>
                    {solved && (
                      <CheckCircle2
                        aria-label="Solved"
                        className="w-3.5 h-3.5 text-[#236B4E] dark:text-[#4EA87E] shrink-0 mt-0.5"
                      />
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-[#696056] dark:text-[#A39A8E] flex items-center gap-1.5">
                    <span>{prob.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{prob.pattern}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{prob.estimatedMinutes}m</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN AREA: Problem Prompt + Python 3.11 Editor + Test Runner + AI Debugger */}
        <div className="lg:col-span-9 space-y-6">
          <section className="p-6 sm:p-7 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
                  <span>{activeProblem.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProblem.pattern}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{activeProblem.complexity}</span>
                  {isSolved && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#236B4E] dark:text-[#4EA87E] font-medium inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved (+80 XP)
                      </span>
                    </>
                  )}
                </div>
                <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                  {activeProblem.title}
                </h2>
              </div>

              {linkedModule && (
                <button
                  type="button"
                  onClick={() => onJumpToModule(linkedModule.id)}
                  className="text-xs font-medium text-[#B8621B] dark:text-[#E5A93C] hover:underline whitespace-nowrap shrink-0"
                >
                  Review chapter: {linkedModule.title.split(':')[0]}
                </button>
              )}
            </div>

            <p className="text-sm sm:text-[15px] leading-relaxed text-[#4C453D] dark:text-[#D5CCC0]">
              {renderFormattedText(activeProblem.description)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#EAE2D6] dark:border-[#26221E] text-xs">
              <div>
                <h3 className="font-semibold text-[#1B1815] dark:text-[#FAF6EC] mb-1">
                  Why this matters in AI systems
                </h3>
                <p className="text-[#574F46] dark:text-[#A39A8E] leading-relaxed">
                  {activeProblem.aiContext}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1B1815] dark:text-[#FAF6EC] mb-1">
                  Constraints
                </h3>
                <ul className="list-disc pl-4 space-y-0.5 text-[#574F46] dark:text-[#A39A8E]">
                  {activeProblem.constraints.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Code Editor */}
          <section className="rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#DDD5C7] dark:border-[#26221E] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
                <span className="font-mono text-[#1B1815] dark:text-[#FAF6EC]">solution.py</span>
                <span aria-hidden="true">·</span>
                <span>Python 3.11</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSolution((s) => !s)}
                  className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors whitespace-nowrap"
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showSolution ? 'Hide Reference' : 'Reference'}
                </button>
                <button
                  type="button"
                  onClick={handleResetCode}
                  className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  disabled={debugging}
                  onClick={() => void handleDebugWithAi()}
                  className="h-8 px-3.5 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[#C26D1F]/40 dark:border-[#E5A93C]/40 bg-[#FBF2E1] dark:bg-[#2A2218] text-[#9A5316] dark:text-[#E5A93C] hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
                >
                  <Bug className="w-3.5 h-3.5" />
                  {debugging ? 'Analyzing...' : 'Debug with AI'}
                </button>
                <button
                  type="button"
                  disabled={running}
                  onClick={() => void handleRunTests()}
                  className="h-8 px-4 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  {running ? 'Running...' : 'Run Tests'}
                </button>
              </div>
            </div>

            <label htmlFor="python-code-editor" className="sr-only">
              Python code editor for {activeProblem.title}
            </label>
            <textarea
              id="python-code-editor"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleEditorKeyDown}
              rows={12}
              className="code-editor w-full p-5 text-sm leading-relaxed bg-[#151311] text-[#F4EFE6] font-mono focus:outline-none resize-y"
            />

            <div className="px-5 py-3 border-t border-[#DDD5C7] dark:border-[#26221E] bg-[#F6F2EA] dark:bg-[#141210] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <label htmlFor="debug-question-input" className="sr-only">
                Ask the real-time debugger a specific question
              </label>
              <input
                id="debug-question-input"
                type="text"
                value={debugPrompt}
                onChange={(e) => setDebugPrompt(e.target.value)}
                placeholder="Optional: ask the debugger why a test fails or how to improve complexity..."
                className="flex-1 h-9 px-4 text-xs rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#FAF6EC] placeholder:text-[#8C8175] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F]"
              />
              <button
                type="button"
                disabled={debugging}
                onClick={() => void handleDebugWithAi()}
                className="h-9 px-4 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#F4EFE6] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors whitespace-nowrap shrink-0"
              >
                Ask Debugger
              </button>
            </div>
          </section>

          {showSolution && (
            <section className="p-5 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                  Reference Solution ({activeProblem.complexity})
                </h3>
                <button
                  type="button"
                  onClick={() => setCode(activeProblem.solutionCode)}
                  className="text-xs font-medium text-[#B8621B] dark:text-[#E5A93C] hover:underline"
                >
                  Load into editor
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#151311] text-[#F4EFE6] text-xs font-mono overflow-x-auto leading-relaxed">
                <code>{activeProblem.solutionCode}</code>
              </pre>
            </section>
          )}

          {/* Split Output Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <section className="p-5 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                  Test Runner Output
                </h3>
                {runResult && (
                  <span
                    className={`text-xs font-mono tabular-nums font-medium ${
                      runResult.passed
                        ? 'text-[#236B4E] dark:text-[#4EA87E]'
                        : 'text-[#B8621B] dark:text-[#E5A93C]'
                    }`}
                  >
                    {runResult.passed ? 'All Passed' : 'Needs Fix'} · {runResult.executionMs}ms
                  </span>
                )}
              </div>

              {runError && (
                <div className="p-3 rounded-xl border border-[#B94A38]/30 bg-[#FBECE9] dark:bg-[#2A1916] text-xs text-[#B94A38] dark:text-[#DF7A66] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{runError}</span>
                </div>
              )}

              {!runResult && !runError && (
                <p className="text-xs text-[#696056] dark:text-[#A39A8E] py-4">
                  Click <strong>Run Tests</strong> to execute your solution in Python 3.11 against{' '}
                  {activeProblem.testCases.length} automated test cases.
                </p>
              )}

              {runResult && (
                <div className="space-y-2.5">
                  {runResult.results.map((tc) => (
                    <div
                      key={tc.name}
                      className="p-3 rounded-xl border border-[#EAE2D6] dark:border-[#26221E] bg-[#F6F2EA] dark:bg-[#141210] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                          {tc.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-medium shrink-0 ${
                            tc.passed
                              ? 'text-[#236B4E] dark:text-[#4EA87E]'
                              : 'text-[#B94A38] dark:text-[#DF7A66]'
                          }`}
                        >
                          {tc.passed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Fail
                            </>
                          )}
                        </span>
                      </div>
                      {!tc.passed && (
                        <div className="font-mono text-[11px] text-[#574F46] dark:text-[#A39A8E] space-y-0.5 pt-1">
                          <div>Expected: {tc.expected}</div>
                          <div>Actual: {tc.actual}</div>
                          {tc.error && (
                            <div className="text-[#B94A38] dark:text-[#DF7A66]">{tc.error}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {runResult.stdout && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-[#696056] dark:text-[#A39A8E]">
                        Stdout
                      </div>
                      <pre className="p-3 rounded-xl bg-[#151311] text-[#F4EFE6] text-xs font-mono overflow-x-auto">
                        {runResult.stdout}
                      </pre>
                    </div>
                  )}

                  {runResult.stderr && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-[#B94A38] dark:text-[#DF7A66]">
                        Traceback / Error
                      </div>
                      <pre className="p-3 rounded-xl bg-[#2A1916] border border-[#DF7A66]/30 text-[#FAD6CE] text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {runResult.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="p-5 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                  Real-Time AI Debug Assistant
                </h3>
                {debugReport && (
                  <button
                    type="button"
                    onClick={() => setCode(debugReport.fixedCode)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#B8621B] dark:text-[#E5A93C] hover:underline"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Apply Suggested Fix
                  </button>
                )}
              </div>

              {debugError && (
                <div className="p-3 rounded-xl border border-[#B94A38]/30 bg-[#FBECE9] dark:bg-[#2A1916] text-xs text-[#B94A38] dark:text-[#DF7A66] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{debugError}</span>
                </div>
              )}

              {debugging && (
                <div className="py-6 text-xs text-[#696056] dark:text-[#A39A8E]">
                  Inspecting your Python syntax, edge cases, and traceback...
                </div>
              )}

              {!debugReport && !debugError && !debugging && (
                <p className="text-xs text-[#696056] dark:text-[#A39A8E] py-4 leading-relaxed">
                  Stuck on a traceback or failing edge case? Click <strong>Debug with AI</strong> to get a root-cause breakdown, line-level hints, and an optional fix.
                </p>
              )}

              {debugReport && !debugging && (
                <div className="space-y-3 text-xs">
                  <p className="text-sm font-medium text-[#1B1815] dark:text-[#FAF6EC] leading-snug">
                    {debugReport.summary}
                  </p>
                  <p className="text-[#574F46] dark:text-[#D5CCC0] leading-relaxed">
                    {debugReport.rootCause}
                  </p>
                  {debugReport.lineHints.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                        Line-by-Line Hints
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-[#574F46] dark:text-[#D5CCC0]">
                        {debugReport.lineHints.map((hint, i) => (
                          <li key={i}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="p-3.5 rounded-xl bg-[#F6F2EA] dark:bg-[#141210] border border-[#EAE2D6] dark:border-[#26221E] text-[#4C453D] dark:text-[#D5CCC0]">
                    <strong className="text-[#1B1815] dark:text-[#FAF6EC]">Takeaway:</strong>{' '}
                    {debugReport.conceptualTip}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
