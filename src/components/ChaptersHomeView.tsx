import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Download, Search, Trophy } from 'lucide-react';
import { COURSE_METADATA, COURSE_MODULES } from '../data/courseData';
import { DSA_PROBLEMS } from '../data/dsaProblems';
import { CHAPTER_STORIES } from '../data/storyContent';
import { useStudy } from '../context/StudyContext';
import {
  computeProgressMetrics,
  computeRewardSummary,
  formatSecondsToTimestamp,
} from '../utils/studyLogic';
import { buildVisualNotebookHtml, triggerHtmlFileDownload } from '../utils/bookExporter';

const HERO_ILLUSTRATION_URL = '/src/assets/images/hero_editorial_desk_1795302831225.jpg';

const ROMAN_PHASES: Record<number, string> = {
  1: 'Part I',
  2: 'Part II',
  3: 'Part III',
  4: 'Part IV',
};

interface ChaptersHomeViewProps {
  onOpenChapter: (moduleId: string, startSeconds?: number) => void;
  onOpenVisualBook: () => void;
}

export function ChaptersHomeView({ onOpenChapter, onOpenVisualBook }: ChaptersHomeViewProps) {
  const { progress, notes } = useStudy();
  const [phaseFilter, setPhaseFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const metrics = useMemo(
    () => computeProgressMetrics(COURSE_MODULES, DSA_PROBLEMS, progress),
    [progress]
  );
  const rewards = useMemo(
    () => computeRewardSummary(progress, notes.length),
    [progress, notes.length]
  );

  const filteredPhases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COURSE_METADATA.phases
      .filter((p) => phaseFilter === 'all' || p.phase === phaseFilter)
      .map((phase) => ({
        ...phase,
        modules: COURSE_MODULES.filter((mod) => {
          if (mod.phase !== phase.phase) return false;
          if (!q) return true;
          const story = CHAPTER_STORIES[mod.id];
          return (
            mod.title.toLowerCase().includes(q) ||
            (story?.storyHook.toLowerCase().includes(q) ?? false) ||
            mod.concepts.some((c) => c.toLowerCase().includes(q))
          );
        }),
      }))
      .filter((g) => g.modules.length > 0);
  }, [phaseFilter, searchQuery]);

  const handleDownloadFullBook = () => {
    const html = buildVisualNotebookHtml(
      COURSE_MODULES,
      notes,
      'Python for AI — Complete Visual Field Book'
    );
    triggerHtmlFileDownload('pypath-python-for-ai-visual-book.html', html);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-20">
      {/* EDITORIAL MAGAZINE HERO — Asymmetric Split with Illustrated Desk Artwork */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="text-xs text-[#696056] dark:text-[#A39A8E] flex flex-wrap items-center gap-2">
              <span>{COURSE_METADATA.title}</span>
              <span aria-hidden="true">·</span>
              <span>{COURSE_METADATA.instructor}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{COURSE_METADATA.totalDurationLabel}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight text-[#1B1815] dark:text-[#FAF6EC] leading-[1.08]">
              Five hours of Python, told like a{' '}
              <em className="italic font-normal text-[#B8621B] dark:text-[#E5A93C]">
                field guide
              </em>{' '}
              you’ll actually finish.
            </h1>

            <p className="text-base sm:text-lg text-[#574F46] dark:text-[#B4ABA0] leading-relaxed max-w-xl">
              Skip the wall of buttons. Choose any chapter below to step inside a quiet study room—lecture video, illustrated handwritten notes, and Python drills one calm step at a time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {metrics.nextRecommendedModule && (
              <button
                type="button"
                onClick={() => onOpenChapter(metrics.nextRecommendedModule!.id)}
                className="h-12 px-7 inline-flex items-center gap-2.5 text-sm font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:bg-[#322C26] dark:hover:bg-[#EEB954] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C]"
              >
                {metrics.completedModulesCount === 0
                  ? 'Begin Chapter 01'
                  : `Continue Chapter ${String(metrics.nextRecommendedModule.order).padStart(2, '0')}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenVisualBook}
              className="h-12 px-5 inline-flex items-center gap-2 text-sm font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#1B1815] dark:text-[#F4EFE6] hover:bg-[#ECE6DA] dark:hover:bg-[#1E1A17] transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              Open Field Book
            </button>

            <button
              type="button"
              onClick={handleDownloadFullBook}
              className="h-10 px-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#FAF6EC] transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download Book
            </button>
          </div>
        </div>

        {/* Right Hero Artwork — Tactile Late-Night Study Desk Illustration */}
        <div className="lg:col-span-6 flex">
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#DDD5C7] dark:border-[#2A2520] bg-[#1B1815] min-h-[260px] lg:min-h-[360px]">
            {!heroImgFailed ? (
              <img
                src={HERO_ILLUSTRATION_URL}
                alt="Warm late-night study desk with an open ruled notebook sketching Python system flows beneath a brass lamp"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#231E1A] to-[#12100E] text-[#E5A93C]">
                <BookOpen className="w-10 h-10 mb-3 opacity-80" />
                <span className="font-display italic text-xl text-[#FAF6EC]">
                  Python for AI Field Guide
                </span>
              </div>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#12100E]/85 via-[#12100E]/35 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 px-6 py-4 flex items-end justify-between gap-4 text-[#FAF6EC]">
              <p className="font-display italic text-sm sm:text-base text-[#F4EFE6]/95">
                “Less tab chaos, more real scripts shipped.”
              </p>
              <span className="text-xs font-mono tabular-nums text-[#E5A93C] shrink-0">
                13 Chapters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUIET EDITORIAL STANDING LEDGER (Horizontal Hairline Ribbon — No Box Clutter) */}
      <section
        aria-label="Your learning standing and reward points"
        className="py-7 border-y border-[#DDD5C7] dark:border-[#26221E] grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
      >
        <div className="md:col-span-5 space-y-1">
          <div className="text-xs text-[#696056] dark:text-[#A39A8E]">Current Field Rank</div>
          <div className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC] flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-[#C26D1F] dark:text-[#E5A93C] shrink-0" />
            <span>{rewards.currentRank.title}</span>
          </div>
          <p className="text-xs text-[#696056] dark:text-[#A39A8E] leading-relaxed">
            {rewards.currentRank.tagline}
          </p>
        </div>

        <div className="md:col-span-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-mono tabular-nums text-[#696056] dark:text-[#A39A8E]">
            <span className="whitespace-nowrap">{rewards.rankProgressPercent}% to next rank</span>
            <span className="whitespace-nowrap">
              {rewards.nextRank
                ? `${rewards.xpToNextRank} XP → ${rewards.nextRank.title}`
                : 'Top rank reached'}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#E5DEC9] dark:bg-[#26221E] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#C26D1F] dark:bg-[#E5A93C] transition-all duration-300"
              style={{ width: `${rewards.rankProgressPercent}%` }}
            />
          </div>
        </div>

        <div className="md:col-span-3 md:text-right flex md:flex-col items-baseline justify-between gap-2">
          <div className="font-display text-3xl font-medium tabular-nums text-[#1B1815] dark:text-[#FAF6EC]">
            {rewards.totalXp}{' '}
            <span className="text-sm font-mono text-[#C26D1F] dark:text-[#E5A93C]">XP</span>
          </div>
          <div className="text-xs font-mono tabular-nums text-[#696056] dark:text-[#A39A8E]">
            {metrics.completedModulesCount} of {metrics.totalModulesCount} topics cleared
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS — Airy Editorial Index (Zero Heavy Cards) */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="font-display text-3xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
              Table of Contents
            </h2>
            <p className="text-sm text-[#696056] dark:text-[#A39A8E]">
              Select any chapter to open its lecture, ruled visual notes, and practice lab.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <label htmlFor="chapter-search" className="sr-only">
              Find a chapter or concept
            </label>
            <Search className="w-4 h-4 text-[#857B6F] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="chapter-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or concepts..."
              className="w-full h-10 pl-7 pr-2 text-sm bg-transparent border-b border-[#D4CBB9] dark:border-[#322D28] text-[#1B1815] dark:text-[#FAF6EC] placeholder:text-[#8C8175] focus:outline-none focus:border-[#C26D1F] dark:focus:border-[#E5A93C] transition-colors"
            />
          </div>
        </div>

        {/* Minimal Underlined Part Filters */}
        <div className="flex items-center gap-6 overflow-x-auto border-b border-[#DDD5C7] dark:border-[#26221E]">
          <button
            type="button"
            onClick={() => setPhaseFilter('all')}
            className={`relative pb-3 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              phaseFilter === 'all'
                ? 'text-[#1B1815] dark:text-[#FAF6EC]'
                : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
            }`}
          >
            All 13 Chapters
            {phaseFilter === 'all' && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C26D1F] dark:bg-[#E5A93C]"
              />
            )}
          </button>

          {COURSE_METADATA.phases.map((p) => {
            const active = phaseFilter === p.phase;
            return (
              <button
                key={p.phase}
                type="button"
                onClick={() => setPhaseFilter(p.phase)}
                className={`relative pb-3 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'text-[#1B1815] dark:text-[#FAF6EC]'
                    : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
                }`}
              >
                {ROMAN_PHASES[p.phase]}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C26D1F] dark:bg-[#E5A93C]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Chapter Index Rows Grouped by Part */}
        {filteredPhases.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="font-display italic text-xl text-[#574F46] dark:text-[#B4ABA0]">
              No chapters match “{searchQuery}”.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPhaseFilter('all');
              }}
              className="text-sm font-medium text-[#B8621B] dark:text-[#E5A93C] hover:underline"
            >
              Show all chapters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredPhases.map((group) => {
              const doneCount = group.modules.filter((m) =>
                progress.completedModuleIds.includes(m.id)
              ).length;
              return (
                <div key={group.phase} className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 pb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display italic text-sm text-[#B8621B] dark:text-[#E5A93C]">
                        {ROMAN_PHASES[group.phase]}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                        {group.title.replace(/^Phase \d+:\s*/, '')}
                      </h3>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#696056] dark:text-[#A39A8E]">
                      {doneCount}/{group.modules.length} completed
                    </span>
                  </div>

                  <div className="border-t border-[#DDD5C7] dark:border-[#26221E] divide-y divide-[#DDD5C7] dark:divide-[#26221E]">
                    {group.modules.map((mod) => {
                      const story = CHAPTER_STORIES[mod.id];
                      const done = progress.completedModuleIds.includes(mod.id);
                      const noteCount = notes.filter((n) => n.moduleId === mod.id).length;
                      const chapterNum = String(mod.order).padStart(2, '0');
                      const cleanTitle = mod.title.replace(/^\d+\.\s*/, '');

                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => onOpenChapter(mod.id)}
                          className="group w-full text-left py-6 sm:py-7 px-3 sm:px-5 -mx-3 sm:-mx-5 rounded-xl hover:bg-[#EDE7DB]/70 dark:hover:bg-[#1B1815] transition-colors duration-150 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start md:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C]"
                        >
                          {/* Large Editorial Chapter Number */}
                          <div className="md:col-span-1 flex items-center justify-between md:block">
                            <span
                              className={`font-display text-3xl sm:text-4xl font-normal tabular-nums leading-none ${
                                done
                                  ? 'text-[#236B4E] dark:text-[#4EA87E]'
                                  : 'text-[#B5AA9B] dark:text-[#4E473F] group-hover:text-[#C26D1F] dark:group-hover:text-[#E5A93C]'
                              } transition-colors`}
                            >
                              {chapterNum}
                            </span>

                            <span className="md:hidden text-xs font-mono tabular-nums text-[#696056] dark:text-[#A39A8E]">
                              {formatSecondsToTimestamp(mod.startSeconds)} · {mod.durationMinutes} min
                            </span>
                          </div>

                          {/* Title + Witty Story Hook */}
                          <div className="md:col-span-8 space-y-1.5">
                            <h4 className="font-display text-xl sm:text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC] group-hover:text-[#B8621B] dark:group-hover:text-[#E5A93C] transition-colors leading-snug">
                              {cleanTitle}
                            </h4>
                            <p className="text-sm sm:text-[15px] text-[#574F46] dark:text-[#A39A8E] leading-relaxed max-w-2xl">
                              {story?.storyHook ?? mod.overview}
                            </p>
                          </div>

                          {/* Right Meta: Timestamp, XP Status & Open Cue */}
                          <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-2 text-xs">
                            <div className="hidden md:flex items-center gap-2 font-mono tabular-nums text-[#696056] dark:text-[#A39A8E]">
                              <span>{formatSecondsToTimestamp(mod.startSeconds)}</span>
                              <span aria-hidden="true">·</span>
                              <span>{mod.durationMinutes} min</span>
                            </div>

                            <div className="flex items-center gap-3">
                              {done ? (
                                <span className="inline-flex items-center gap-1 font-medium text-[#236B4E] dark:text-[#4EA87E]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Earned +{story?.xpReward ?? 120} XP
                                </span>
                              ) : (
                                <span className="font-mono tabular-nums text-[#8C6D3B] dark:text-[#D9B166]">
                                  +{story?.xpReward ?? 120} XP
                                  {noteCount > 0 ? ` · ${noteCount} notes` : ''}
                                </span>
                              )}

                              <span className="inline-flex items-center gap-1 font-medium text-[#1B1815] dark:text-[#FAF6EC] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                                Open <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
