import { useMemo, useState } from 'react';
import { ArrowRight, Code2, Download, Play, Search, Trash2, Trophy } from 'lucide-react';
import { COURSE_MODULES } from '../data/courseData';
import { DSA_PROBLEMS } from '../data/dsaProblems';
import { useStudy } from '../context/StudyContext';
import { computeProgressMetrics, computeRewardSummary } from '../utils/studyLogic';
import { buildVisualNotebookHtml, triggerHtmlFileDownload } from '../utils/bookExporter';

interface ProgressViewProps {
  onJumpToModule: (moduleId: string, startSeconds?: number) => void;
  onOpenDsaProblem: (problemId: string) => void;
}

export function ProgressView({ onJumpToModule, onOpenDsaProblem }: ProgressViewProps) {
  const { progress, notes, deleteNote } = useStudy();
  const [noteQuery, setNoteQuery] = useState('');

  const metrics = useMemo(
    () => computeProgressMetrics(COURSE_MODULES, DSA_PROBLEMS, progress),
    [progress]
  );
  const rewards = useMemo(
    () => computeRewardSummary(progress, notes.length),
    [progress, notes.length]
  );

  const moduleMap = useMemo(
    () => new Map(COURSE_MODULES.map((m) => [m.id, m])),
    []
  );

  const unsolvedProblems = useMemo(
    () => DSA_PROBLEMS.filter((p) => !progress.solvedProblemIds.includes(p.id)).slice(0, 4),
    [progress.solvedProblemIds]
  );

  const filteredNotes = useMemo(() => {
    const q = noteQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      const modTitle = moduleMap.get(n.moduleId)?.title.toLowerCase() ?? '';
      return n.content.toLowerCase().includes(q) || modTitle.includes(q);
    });
  }, [notes, noteQuery, moduleMap]);

  const handleDownloadBook = () => {
    const html = buildVisualNotebookHtml(
      COURSE_MODULES,
      notes,
      'Python for AI — Complete Visual Field Book'
    );
    triggerHtmlFileDownload('pypath-python-for-ai-visual-book.html', html);
  };

  return (
    <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-12 sm:py-14 space-y-14">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#DDD5C7] dark:border-[#26221E]">
        <div className="space-y-2">
          <div className="text-xs text-[#696056] dark:text-[#A39A8E]">
            Learning Ledger · 5-Hour Python for AI Track
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1B1815] dark:text-[#FAF6EC]">
            Progress &amp;{' '}
            <em className="italic font-normal text-[#B8621B] dark:text-[#E5A93C]">Rewards</em>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleDownloadBook}
            className="h-10 px-4 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#F4EFE6] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Download Visual Book
          </button>

          {metrics.nextRecommendedModule && (
            <button
              type="button"
              onClick={() => onJumpToModule(metrics.nextRecommendedModule!.id)}
              className="h-10 px-5 inline-flex items-center gap-2 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              Continue: {metrics.nextRecommendedModule.title.split(':')[0]}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Hairline Editorial Metric Ledger (Zero Heavy Boxed Stat Cards) */}
      <section
        aria-label="Key progress metrics"
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#DDD5C7] dark:border-[#26221E]"
      >
        <div className="space-y-1.5">
          <div className="text-xs text-[#696056] dark:text-[#A39A8E] inline-flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#C26D1F] dark:text-[#E5A93C]" />
            Reward Points
          </div>
          <div className="font-display text-3xl sm:text-4xl font-medium tabular-nums text-[#1B1815] dark:text-[#FAF6EC]">
            {rewards.totalXp}{' '}
            <span className="text-sm font-mono text-[#B8621B] dark:text-[#E5A93C]">XP</span>
          </div>
          <div className="text-xs text-[#696056] dark:text-[#A39A8E]">
            {rewards.currentRank.title}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs text-[#696056] dark:text-[#A39A8E]">Overall Mastery</div>
          <div className="font-display text-3xl sm:text-4xl font-medium tabular-nums text-[#1B1815] dark:text-[#FAF6EC]">
            {metrics.overallPercent}%
          </div>
          <div className="text-xs text-[#696056] dark:text-[#A39A8E] tabular-nums">
            {metrics.completedModulesCount} of {metrics.totalModulesCount} chapters done
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs text-[#696056] dark:text-[#A39A8E]">DSA Drills Solved</div>
          <div className="font-display text-3xl sm:text-4xl font-medium tabular-nums text-[#1B1815] dark:text-[#FAF6EC]">
            {metrics.solvedDsaCount}/{metrics.totalDsaCount}
          </div>
          <div className="text-xs text-[#696056] dark:text-[#A39A8E]">
            Verified with Python 3.11 tests
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs text-[#696056] dark:text-[#A39A8E]">Interview Readiness</div>
          <div className="font-display text-3xl sm:text-4xl font-medium tabular-nums text-[#1B1815] dark:text-[#FAF6EC]">
            {metrics.masteredInterviewsCount}/{metrics.totalInterviewsCount}
          </div>
          <div className="text-xs text-[#696056] dark:text-[#A39A8E] tabular-nums">
            {notes.length} handwritten notes saved
          </div>
        </div>
      </section>

      {/* Middle Split: Phase Progress + Next DSA Practice Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
            Progress by Curriculum Part
          </h2>
          <div className="space-y-6">
            {metrics.phaseBreakdown.map((phase) => (
              <div key={phase.phase} className="space-y-2">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                    {phase.phaseTitle}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-[#696056] dark:text-[#A39A8E]">
                    {phase.completedCount}/{phase.totalCount} · {phase.percent}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#E5DEC9] dark:bg-[#26221E] overflow-hidden">
                  <div
                    className="h-full bg-[#C26D1F] dark:bg-[#E5A93C] rounded-full transition-all duration-300"
                    style={{ width: `${phase.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 space-y-5">
          <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
            Next DSA Drills
          </h2>
          {unsolvedProblems.length === 0 ? (
            <p className="text-sm text-[#236B4E] dark:text-[#4EA87E] py-4">
              All {DSA_PROBLEMS.length} DSA drills are solved. Revisit any problem in DSA Lab to sharpen speed.
            </p>
          ) : (
            <div className="border-t border-[#DDD5C7] dark:border-[#26221E] divide-y divide-[#DDD5C7] dark:divide-[#26221E]">
              {unsolvedProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-sm font-medium text-[#1B1815] dark:text-[#FAF6EC] truncate">
                      {prob.title}
                    </div>
                    <div className="text-xs text-[#696056] dark:text-[#A39A8E]">
                      {prob.difficulty} · {prob.pattern} · {prob.estimatedMinutes} min
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDsaProblem(prob.id)}
                    className="h-8 px-3.5 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#1B1815] dark:text-[#F4EFE6] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] whitespace-nowrap shrink-0"
                  >
                    <Code2 className="w-3 h-3" />
                    Solve
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Saved Notes Archive */}
      <section className="pt-10 border-t border-[#DDD5C7] dark:border-[#26221E] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
              Handwritten Notes Archive ({notes.length})
            </h2>
            <p className="text-xs text-[#696056] dark:text-[#A39A8E]">
              Click any timestamp to return straight to that moment in the lecture.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <label htmlFor="notes-archive-search" className="sr-only">
              Search saved study notes
            </label>
            <Search className="w-3.5 h-3.5 text-[#857B6F] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="notes-archive-search"
              type="search"
              value={noteQuery}
              onChange={(e) => setNoteQuery(e.target.value)}
              placeholder="Search your notes..."
              className="w-full h-9 pl-6 pr-2 text-xs bg-transparent border-b border-[#D4CBB9] dark:border-[#322D28] text-[#1B1815] dark:text-[#FAF6EC] placeholder:text-[#8C8175] focus:outline-none focus:border-[#C26D1F] dark:focus:border-[#E5A93C]"
            />
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#696056] dark:text-[#A39A8E] border-y border-dashed border-[#D4CBB9] dark:border-[#2E2924]">
            {notes.length === 0
              ? 'No study notes saved yet. Open any chapter’s Handwritten Notes tab to jot down takeaways.'
              : `No notes match “${noteQuery}”.`}
          </div>
        ) : (
          <div className="border-t border-[#DDD5C7] dark:border-[#26221E] divide-y divide-[#DDD5C7] dark:divide-[#26221E]">
            {filteredNotes.map((note) => {
              const mod = moduleMap.get(note.moduleId);
              return (
                <div key={note.id} className="py-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => onJumpToModule(note.moduleId, note.timestampSeconds)}
                        className="inline-flex items-center gap-1 font-mono tabular-nums text-[#B8621B] dark:text-[#E5A93C] hover:underline"
                      >
                        <Play className="w-3 h-3" />
                        {note.timestampLabel}
                      </button>
                      <span aria-hidden="true" className="text-[#857B6F]">
                        ·
                      </span>
                      <span className="text-[#696056] dark:text-[#A39A8E]">
                        {mod ? mod.title : note.moduleId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      aria-label={`Delete saved note from ${note.timestampLabel}`}
                      className="p-1 text-[#857B6F] hover:text-[#B94A38] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-hand text-2xl text-[#1B1815] dark:text-[#FAF6EC] whitespace-pre-wrap leading-snug">
                    {note.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
