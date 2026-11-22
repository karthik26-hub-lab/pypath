import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  MessageSquare,
  NotebookPen,
  Play,
  Plus,
  Sparkles,
  Trash2,
  Trophy,
  Video,
  X,
} from 'lucide-react';
import { COURSE_METADATA, COURSE_MODULES } from '../data/courseData';
import { DSA_PROBLEMS } from '../data/dsaProblems';
import { CHAPTER_STORIES } from '../data/storyContent';
import { useStudy } from '../context/StudyContext';
import type { CourseModule, InterviewEvaluationResponse } from '../types/course';
import {
  buildYoutubeEmbedUrl,
  computeRewardSummary,
  findActiveTranscriptSegmentIndex,
  formatSecondsToTimestamp,
} from '../utils/studyLogic';
import { RuledNotebookSheet } from './RuledNotebookSheet';

interface StudyStudioProps {
  activeModuleId: string;
  seekSeconds: number;
  seekVersion: number;
  onBackToChapters: () => void;
  onSelectModule: (moduleId: string, startSeconds?: number) => void;
  onSeekVideo: (seconds: number) => void;
  onOpenDsaProblem: (problemId: string) => void;
}

type ChapterStep = 'watch' | 'notes' | 'practice';
type CompanionTab = 'points' | 'code' | 'transcript' | 'notes';

interface CelebrationState {
  moduleId: string;
  xpEarned: number;
  quip: string;
}

export function StudyStudio({
  activeModuleId,
  seekSeconds,
  seekVersion,
  onBackToChapters,
  onSelectModule,
  onSeekVideo,
  onOpenDsaProblem,
}: StudyStudioProps) {
  const {
    progress,
    notes,
    toggleModuleComplete,
    toggleInterviewMastered,
    addNote,
    deleteNote,
  } = useStudy();

  const [activeStep, setActiveStep] = useState<ChapterStep>('watch');
  const [companionTab, setCompanionTab] = useState<CompanionTab>('points');
  const [paperTheme, setPaperTheme] = useState<'warm' | 'dark'>('warm');
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const [quickNoteDraft, setQuickNoteDraft] = useState('');
  const [quickNoteSavedNotice, setQuickNoteSavedNotice] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [userInterviewDrafts, setUserInterviewDrafts] = useState<Record<string, string>>({});
  const [evalLoadingId, setEvalLoadingId] = useState<string | null>(null);
  const [evalResults, setEvalResults] = useState<Record<string, InterviewEvaluationResponse>>({});
  const [evalErrors, setEvalErrors] = useState<Record<string, string>>({});

  const activeIndex = useMemo(() => {
    const idx = COURSE_MODULES.findIndex((m) => m.id === activeModuleId);
    return idx >= 0 ? idx : 0;
  }, [activeModuleId]);

  const activeModule: CourseModule = COURSE_MODULES[activeIndex];
  const prevModule = activeIndex > 0 ? COURSE_MODULES[activeIndex - 1] : null;
  const nextModule = activeIndex < COURSE_MODULES.length - 1 ? COURSE_MODULES[activeIndex + 1] : null;
  const story = CHAPTER_STORIES[activeModule.id];
  const chapterNum = String(activeModule.order).padStart(2, '0');
  const cleanTitle = activeModule.title.replace(/^\d+\.\s*/, '');

  const isCompleted = progress.completedModuleIds.includes(activeModule.id);
  const rewards = useMemo(
    () => computeRewardSummary(progress, notes.length),
    [progress, notes.length]
  );

  const moduleNotes = useMemo(
    () => notes.filter((n) => n.moduleId === activeModule.id),
    [notes, activeModule.id]
  );
  const linkedProblems = useMemo(
    () => DSA_PROBLEMS.filter((p) => activeModule.linkedDsaIds.includes(p.id)),
    [activeModule.linkedDsaIds]
  );

  const activeSegmentIndex = useMemo(
    () => findActiveTranscriptSegmentIndex(activeModule.transcript, seekSeconds),
    [activeModule.transcript, seekSeconds]
  );
  const activeSegment =
    activeSegmentIndex >= 0 ? activeModule.transcript[activeSegmentIndex] : null;
  const prevSegment =
    activeSegmentIndex > 0 ? activeModule.transcript[activeSegmentIndex - 1] : null;
  const nextSegment =
    activeSegmentIndex >= 0 && activeSegmentIndex < activeModule.transcript.length - 1
      ? activeModule.transcript[activeSegmentIndex + 1]
      : null;

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteDraft.trim()) return;
    addNote(activeModule.id, seekSeconds, quickNoteDraft);
    setQuickNoteDraft('');
    setQuickNoteSavedNotice(true);
    window.setTimeout(() => setQuickNoteSavedNotice(false), 2200);
  };

  const handleCopySnippet = async (snippetId: string, snippet: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = snippet;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // Ignore clipboard denial in restricted iframe contexts
      }
    }
    setCopiedSnippetId(snippetId);
    window.setTimeout(() => setCopiedSnippetId(null), 1600);
  };

  const prevModuleIdRef = useRef<string>(activeModule.id);
  useEffect(() => {
    if (prevModuleIdRef.current !== activeModule.id) {
      prevModuleIdRef.current = activeModule.id;
      setCelebration(null);
    }
  }, [activeModule.id]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const initialStartRef = useRef<number>(seekSeconds);

  const embedUrl = useMemo(
    () => buildYoutubeEmbedUrl(COURSE_METADATA.videoId, initialStartRef.current, false),
    []
  );

  useEffect(() => {
    if (seekVersion === 0) return;
    const win = iframeRef.current?.contentWindow;
    if (win) {
      win.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [Math.max(0, Math.floor(seekSeconds)), true],
        }),
        '*'
      );
    }
  }, [seekSeconds, seekVersion]);

  const handleToggleComplete = () => {
    const wasCompleted = isCompleted;
    toggleModuleComplete(activeModule.id);
    if (!wasCompleted) {
      setCelebration({
        moduleId: activeModule.id,
        xpEarned: story?.xpReward ?? 120,
        quip:
          story?.completionQuip ??
          'Chapter cleared. Another solid piece of Python engineering locked in.',
      });
    } else {
      setCelebration(null);
    }
  };

  const handleSeekAndWatch = (seconds: number) => {
    onSeekVideo(seconds);
    setActiveStep('watch');
  };

  const handleEvaluateInterview = async (
    questionId: string,
    question: string,
    modelAnswer: string
  ) => {
    const draft = (userInterviewDrafts[questionId] || '').trim();
    if (draft.length < 8) {
      setEvalErrors((prev) => ({
        ...prev,
        [questionId]: 'Write at least a sentence before requesting AI feedback.',
      }));
      return;
    }
    setEvalErrors((prev) => ({ ...prev, [questionId]: '' }));
    setEvalLoadingId(questionId);
    try {
      const res = await fetch('/api/ai/evaluate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, modelAnswer, userAnswer: draft }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not evaluate answer.');
      }
      setEvalResults((prev) => ({ ...prev, [questionId]: data }));
    } catch (err) {
      setEvalErrors((prev) => ({
        ...prev,
        [questionId]: err instanceof Error ? err.message : 'Evaluation failed.',
      }));
    } finally {
      setEvalLoadingId(null);
    }
  };

  return (
    <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-10 sm:py-12 space-y-10">
      {/* Editorial Chapter Masthead */}
      <header className="space-y-6 pb-8 border-b border-[#DDD5C7] dark:border-[#26221E]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToChapters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#FAF6EC] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Table of Contents
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
            <span>{activeModule.phaseTitle}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {formatSecondsToTimestamp(activeModule.startSeconds)} –{' '}
              {formatSecondsToTimestamp(activeModule.endSeconds)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{activeModule.durationMinutes} min</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-display italic text-sm text-[#B8621B] dark:text-[#E5A93C]">
              Chapter {chapterNum}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1B1815] dark:text-[#FAF6EC] leading-[1.12]">
              {cleanTitle}
            </h1>
            <p className="text-base text-[#574F46] dark:text-[#B4ABA0] leading-relaxed">
              {story?.storyHook ?? activeModule.overview}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleComplete}
            className={`h-11 px-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold rounded-full border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C] ${
              isCompleted
                ? 'border-[#236B4E]/40 dark:border-[#4EA87E]/40 bg-[#EAF5EF] dark:bg-[#192820] text-[#236B4E] dark:text-[#7CD0A5] hover:bg-[#DCF0E4] dark:hover:bg-[#1F3429]'
                : 'border-transparent bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:bg-[#322C26] dark:hover:bg-[#EEB954]'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Completed (+{story?.xpReward ?? 120} XP)
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Complete &amp; Claim +{story?.xpReward ?? 120} XP
              </>
            )}
          </button>
        </div>
      </header>

      {/* Editorial XP Reward Celebration Ribbon */}
      <AnimatePresence>
        {celebration && celebration.moduleId === activeModule.id && (
          <motion.section
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-7 rounded-2xl border border-[#236B4E]/30 dark:border-[#4EA87E]/35 bg-[#EEF6F1] dark:bg-[#17221B] flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#236B4E] dark:text-[#6EC79B]">
                <Trophy className="w-4 h-4 text-[#C26D1F] dark:text-[#E5A93C]" />
                <span>+{celebration.xpEarned} XP Earned</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{rewards.totalXp} XP Total</span>
                <span aria-hidden="true">·</span>
                <span>Rank: {rewards.currentRank.title}</span>
              </div>
              <p className="font-display italic text-lg sm:text-xl text-[#1B1815] dark:text-[#FAF6EC] leading-snug">
                {celebration.quip}
              </p>
              {rewards.nextRank && (
                <p className="text-xs text-[#574F46] dark:text-[#A39A8E] font-mono tabular-nums">
                  {rewards.xpToNextRank} XP away from {rewards.nextRank.title}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {nextModule && (
                <button
                  type="button"
                  onClick={() => onSelectModule(nextModule.id)}
                  className="h-10 px-5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#4EA87E] dark:text-[#12100E] hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Next Chapter
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setCelebration(null)}
                aria-label="Dismiss reward banner"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#FAF6EC] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Clean Underlined 3-Step Chapter Switcher */}
      <nav
        aria-label="Chapter study steps"
        role="tablist"
        className="flex items-center gap-6 sm:gap-10 border-b border-[#DDD5C7] dark:border-[#26221E] overflow-x-auto"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeStep === 'watch'}
          onClick={() => setActiveStep('watch')}
          className={`relative pb-4 text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
            activeStep === 'watch'
              ? 'text-[#1B1815] dark:text-[#FAF6EC]'
              : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>1. Watch &amp; Companion</span>
          {activeStep === 'watch' && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C26D1F] dark:bg-[#E5A93C]"
            />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeStep === 'notes'}
          onClick={() => setActiveStep('notes')}
          className={`relative pb-4 text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
            activeStep === 'notes'
              ? 'text-[#1B1815] dark:text-[#FAF6EC]'
              : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
          }`}
        >
          <NotebookPen className="w-4 h-4" />
          <span>2. Handwritten Notes</span>
          {activeStep === 'notes' && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C26D1F] dark:bg-[#E5A93C]"
            />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeStep === 'practice'}
          onClick={() => setActiveStep('practice')}
          className={`relative pb-4 text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
            activeStep === 'practice'
              ? 'text-[#1B1815] dark:text-[#FAF6EC]'
              : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Cases &amp; Interview</span>
          {activeStep === 'practice' && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C26D1F] dark:bg-[#E5A93C]"
            />
          )}
        </button>
      </nav>

      {/* STEP 1: WATCH & SIMULTANEOUS COMPANION (Key Points · Code · Transcript · Live Notes) */}
      {activeStep === 'watch' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: 16:9 Lecture Video + Live Synchronized Moment Cue Strip */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-[#DDD5C7] dark:border-[#2A2520] bg-black">
              <div className="aspect-video w-full relative">
                <iframe
                  ref={iframeRef}
                  src={embedUrl}
                  title={`Python for AI Lecture — ${activeModule.title}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="px-5 py-3 bg-[#FCFBF8] dark:bg-[#191715] border-t border-[#DDD5C7] dark:border-[#26221E] flex flex-wrap items-center justify-between gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
                <span className="font-mono tabular-nums text-[#1B1815] dark:text-[#F4EFE6]">
                  Cue: {formatSecondsToTimestamp(seekSeconds)} · {COURSE_METADATA.instructor}
                </span>
                <a
                  href={`https://youtu.be/${COURSE_METADATA.videoId}?t=${Math.floor(seekSeconds)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#B8621B] dark:text-[#E5A93C] hover:underline whitespace-nowrap"
                >
                  Open on YouTube <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Live Synchronized Moment Card under the Video */}
            {activeSegment && (
              <div className="p-5 sm:p-6 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-mono tabular-nums text-[#B8621B] dark:text-[#E5A93C]">
                    Current Moment · {activeSegment.timestampLabel}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!prevSegment}
                      onClick={() => prevSegment && onSeekVideo(prevSegment.timestampSeconds)}
                      aria-label="Previous video moment"
                      className="h-7 px-2.5 inline-flex items-center gap-1 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] disabled:opacity-35 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={!nextSegment}
                      onClick={() => nextSegment && onSeekVideo(nextSegment.timestampSeconds)}
                      aria-label="Next video moment"
                      className="h-7 px-2.5 inline-flex items-center gap-1 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] disabled:opacity-35 disabled:pointer-events-none transition-colors"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h2 className="font-display text-xl font-medium text-[#1B1815] dark:text-[#FAF6EC] leading-snug">
                  {activeSegment.heading}
                </h2>
                <p className="text-sm text-[#574F46] dark:text-[#B4ABA0] leading-relaxed">
                  {activeSegment.takeaway}
                </p>

                <div className="pt-2 border-t border-[#EAE2D6] dark:border-[#26221E] flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#696056] dark:text-[#A39A8E]">
                  {activeModule.concepts.map((concept, idx) => (
                    <span key={concept} className="inline-flex items-center gap-2">
                      <span>{concept}</span>
                      {idx < activeModule.concepts.length - 1 && <span aria-hidden="true">/</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Simultaneous Companion — Key Points, Live Code, Transcript & Handwritten Notes */}
          <aside className="lg:col-span-5 lg:sticky lg:top-20 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] flex flex-col lg:h-[468px]">
            <div
              role="tablist"
              aria-label="Simultaneous video companion"
              className="px-5 pt-4 border-b border-[#DDD5C7] dark:border-[#26221E] flex items-center gap-5 overflow-x-auto shrink-0"
            >
              {(
                [
                  { id: 'points', label: 'Key Points' },
                  { id: 'code', label: 'Code' },
                  { id: 'transcript', label: 'Transcript' },
                  { id: 'notes', label: `Notes (${moduleNotes.length})` },
                ] as const
              ).map((tab) => {
                const active = companionTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCompanionTab(tab.id)}
                    className={`relative pb-3 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'text-[#1B1815] dark:text-[#FAF6EC]'
                        : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
                    }`}
                  >
                    {tab.label}
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

            <div className="p-5 overflow-y-auto flex-1 min-h-0 space-y-5">
              {/* TAB 1: SIMULTANEOUS KEY POINTS & EXCERPTS */}
              {companionTab === 'points' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[#B8621B] dark:text-[#E5A93C]">
                      Key Takeaways While Watching
                    </div>
                    <ul className="space-y-2.5 list-disc pl-5 font-hand text-[23px] leading-[1.35] text-[#1B1815] dark:text-[#FAF6EC]">
                      {(story?.handwrittenBullets ?? activeModule.transcript.map((t) => t.takeaway)).map(
                        (bullet, i) => (
                          <li key={i}>{bullet}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {story?.marginDoodleNote && (
                    <p className="font-hand text-2xl font-bold text-[#236B4E] dark:text-[#4EA87E]">
                      ★ {story.marginDoodleNote}
                    </p>
                  )}

                  <div className="pt-4 border-t border-[#EAE2D6] dark:border-[#26221E] space-y-4">
                    <div className="text-xs font-medium text-[#696056] dark:text-[#A39A8E]">
                      Jump to Key Moments
                    </div>
                    {activeModule.excerpts.map((ex) => (
                      <div key={ex.id} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-[#696056] dark:text-[#A39A8E] inline-flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Excerpt
                          </span>
                          <button
                            type="button"
                            onClick={() => onSeekVideo(ex.timestampSeconds)}
                            aria-label={`Jump video to key excerpt at ${ex.timestampLabel}`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono tabular-nums text-[#B8621B] dark:text-[#E5A93C] bg-[#FBF2E1] dark:bg-[#2A2218] hover:opacity-85 transition-opacity"
                          >
                            <Play className="w-3 h-3" />
                            {ex.timestampLabel}
                          </button>
                        </div>
                        <blockquote className="font-display italic text-[15px] text-[#1B1815] dark:text-[#FAF6EC] leading-relaxed">
                          “{ex.quote}”
                        </blockquote>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SIMULTANEOUS LIVE PYTHON CODE PATTERNS */}
              {companionTab === 'code' && (
                <div className="space-y-5">
                  {activeModule.caseStudies.map((cs) => (
                    <div key={cs.id} className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-medium text-[#B8621B] dark:text-[#E5A93C]">
                            {cs.domain}
                          </div>
                          <h3 className="font-display text-base font-medium text-[#1B1815] dark:text-[#FAF6EC] leading-snug">
                            {cs.title}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopySnippet(cs.id, cs.codeSnippet)}
                          aria-label={`Copy Python snippet for ${cs.title}`}
                          className="h-7 px-2.5 inline-flex items-center gap-1 text-[11px] font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] shrink-0"
                        >
                          {copiedSnippetId === cs.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#236B4E] dark:text-[#4EA87E]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 rounded-xl bg-[#151311] text-[#F4EFE6] text-xs font-mono overflow-x-auto leading-relaxed border border-[#2C2722]">
                        <code>{cs.codeSnippet}</code>
                      </pre>

                      <p className="text-xs text-[#574F46] dark:text-[#A39A8E] leading-relaxed">
                        {cs.solutionSummary}
                      </p>
                    </div>
                  ))}

                  {linkedProblems[0] && (
                    <div className="pt-3 border-t border-[#EAE2D6] dark:border-[#26221E] flex items-center justify-between gap-3">
                      <span className="text-xs text-[#696056] dark:text-[#A39A8E] truncate">
                        Try it live: {linkedProblems[0].title}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenDsaProblem(linkedProblems[0].id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8621B] dark:text-[#E5A93C] hover:underline whitespace-nowrap shrink-0"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        Run in DSA Lab
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TIMESTAMPED SUMMARY TRANSCRIPT */}
              {companionTab === 'transcript' && (
                <div className="divide-y divide-[#EAE2D6] dark:divide-[#26221E]">
                  {activeModule.transcript.map((seg, idx) => {
                    const isActiveCue = idx === activeSegmentIndex;
                    return (
                      <div
                        key={seg.id}
                        className={`py-4 first:pt-0 last:pb-0 space-y-2 transition-opacity ${
                          isActiveCue ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-base font-medium text-[#1B1815] dark:text-[#FAF6EC] leading-snug">
                            {seg.heading}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onSeekVideo(seg.timestampSeconds)}
                            aria-label={`Jump video to ${seg.timestampLabel} for ${seg.heading}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono tabular-nums transition-colors shrink-0 ${
                              isActiveCue
                                ? 'bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] font-semibold'
                                : 'text-[#B8621B] dark:text-[#E5A93C] bg-[#FBF2E1] dark:bg-[#2A2218] hover:opacity-85'
                            }`}
                          >
                            <Play className="w-3 h-3" />
                            {seg.timestampLabel}
                          </button>
                        </div>
                        <p className="text-xs sm:text-[13px] leading-relaxed text-[#574F46] dark:text-[#B4ABA0]">
                          {seg.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: LIVE SIMULTANEOUS HANDWRITTEN NOTES */}
              {companionTab === 'notes' && (
                <div className="space-y-4">
                  {moduleNotes.length === 0 ? (
                    <div className="py-8 text-center space-y-2">
                      <p className="font-hand text-2xl text-[#696056] dark:text-[#A39A8E]">
                        No notes for this chapter yet.
                      </p>
                      <p className="text-xs text-[#696056] dark:text-[#A39A8E]">
                        Use the bar below to jot a quick thought while watching—it syncs directly to your ruled notebook sheet and downloadable book.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-[#EAE2D6] dark:divide-[#26221E]">
                      {moduleNotes.map((note) => (
                        <li
                          key={note.id}
                          className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-2.5"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => onSeekVideo(note.timestampSeconds)}
                              className="inline-flex items-center gap-1 text-xs font-mono tabular-nums text-[#B8621B] dark:text-[#E5A93C] hover:underline"
                            >
                              <Play className="w-3 h-3" />
                              {note.timestampLabel}
                            </button>
                            <p className="font-hand text-[22px] leading-snug text-[#1B1815] dark:text-[#FAF6EC] whitespace-pre-wrap">
                              {note.content}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteNote(note.id)}
                            aria-label={`Delete note at ${note.timestampLabel}`}
                            className="p-1 text-[#857B6F] hover:text-[#B94A38] transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep('notes')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8621B] dark:text-[#E5A93C] hover:underline"
                    >
                      Open full ruled page &amp; infographic <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Always-Ready Quick Timestamped Note Bar (Works across all 4 companion tabs!) */}
            <form
              onSubmit={handleQuickNoteSubmit}
              className="p-3.5 border-t border-[#DDD5C7] dark:border-[#26221E] bg-[#F6F2EA]/70 dark:bg-[#141210] rounded-b-2xl space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="live-watch-note" className="sr-only">
                  Capture a note while watching at {formatSecondsToTimestamp(seekSeconds)}
                </label>
                <input
                  id="live-watch-note"
                  type="text"
                  value={quickNoteDraft}
                  onChange={(e) => setQuickNoteDraft(e.target.value)}
                  placeholder={`Jot a note at ${formatSecondsToTimestamp(seekSeconds)} while watching...`}
                  className="flex-1 h-9 px-3.5 text-xs rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#FAF6EC] placeholder:text-[#8C8175] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F]"
                />
                <button
                  type="submit"
                  aria-label="Save note at current timestamp"
                  className="h-9 px-3.5 inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 transition-opacity shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
              {quickNoteSavedNotice && (
                <p className="text-[11px] font-medium text-[#236B4E] dark:text-[#4EA87E] px-2">
                  Pinned to your Handwritten Notes (+15 XP)
                </p>
              )}
            </form>
          </aside>
        </section>
      )}

      {/* STEP 2: RULED HANDWRITTEN VISUAL NOTES */}
      {activeStep === 'notes' && (
        <section className="max-w-[900px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[#574F46] dark:text-[#B4ABA0]">
              Ruled archival sheet with bespoke diagram &amp; handwritten takeaways—download this chapter anytime.
            </p>
            <div
              role="group"
              aria-label="Paper style"
              className="inline-flex items-center p-1 rounded-full bg-[#EAE3D5] dark:bg-[#1E1B18] border border-[#DDD5C7] dark:border-[#2D2823]"
            >
              <button
                type="button"
                onClick={() => setPaperTheme('warm')}
                className={`px-3.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  paperTheme === 'warm'
                    ? 'bg-[#FCFBF8] dark:bg-[#2F2A24] text-[#1B1815] dark:text-[#FAF6EC]'
                    : 'text-[#696056] dark:text-[#A39A8E]'
                }`}
              >
                Warm Paper
              </button>
              <button
                type="button"
                onClick={() => setPaperTheme('dark')}
                className={`px-3.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  paperTheme === 'dark'
                    ? 'bg-[#FCFBF8] dark:bg-[#2F2A24] text-[#1B1815] dark:text-[#FAF6EC]'
                    : 'text-[#696056] dark:text-[#A39A8E]'
                }`}
              >
                Night Ink
              </button>
            </div>
          </div>

          <RuledNotebookSheet
            module={activeModule}
            notes={moduleNotes}
            paperTheme={paperTheme}
            currentCueSeconds={seekSeconds}
            onSeekVideo={handleSeekAndWatch}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
          />
        </section>
      )}

      {/* STEP 3: CASE STUDIES, LINKED DSA & INTERVIEW CHECK */}
      {activeStep === 'practice' && (
        <section className="max-w-[900px] mx-auto space-y-16">
          {/* Real-World Case Studies */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                Real-World Case Studies
              </h2>
              <p className="text-sm text-[#574F46] dark:text-[#A39A8E]">
                How this exact concept shows up in production AI pipelines and backend services.
              </p>
            </div>

            <div className="space-y-8">
              {activeModule.caseStudies.map((cs) => (
                <article
                  key={cs.id}
                  className="p-6 sm:p-8 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-5"
                >
                  <div className="space-y-1">
                    <div className="text-xs text-[#B8621B] dark:text-[#E5A93C] font-medium">
                      {cs.domain}
                    </div>
                    <h3 className="font-display text-xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                      {cs.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                        Scenario
                      </div>
                      <p className="text-[#574F46] dark:text-[#B4ABA0] leading-relaxed">
                        {cs.scenario}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                        Engineering Approach
                      </div>
                      <p className="text-[#574F46] dark:text-[#B4ABA0] leading-relaxed">
                        {cs.solutionSummary}
                      </p>
                    </div>
                  </div>

                  <pre className="p-4 sm:p-5 rounded-xl bg-[#161412] text-[#F4EFE6] text-xs font-mono overflow-x-auto leading-relaxed border border-[#2C2722]">
                    <code>{cs.codeSnippet}</code>
                  </pre>
                </article>
              ))}
            </div>
          </div>

          {/* Linked Bite-Sized DSA Drills */}
          {linkedProblems.length > 0 && (
            <div className="space-y-5 pt-10 border-t border-[#DDD5C7] dark:border-[#26221E]">
              <div className="space-y-1.5">
                <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                  Hands-On Python &amp; DSA Practice (+80 XP each)
                </h2>
                <p className="text-sm text-[#574F46] dark:text-[#A39A8E]">
                  Run real Python 3.11 tests with AI debugging whenever you hit an edge case.
                </p>
              </div>

              <div className="divide-y divide-[#DDD5C7] dark:divide-[#26221E] border-y border-[#DDD5C7] dark:border-[#26221E]">
                {linkedProblems.map((prob) => {
                  const solved = progress.solvedProblemIds.includes(prob.id);
                  return (
                    <div
                      key={prob.id}
                      className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
                          <span>{prob.difficulty}</span>
                          <span aria-hidden="true">·</span>
                          <span>{prob.pattern}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{prob.estimatedMinutes} min</span>
                          {solved && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#236B4E] dark:text-[#4EA87E] font-medium">
                                Solved
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-display text-lg font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                          {prob.title}
                        </h3>
                        <p className="text-xs text-[#574F46] dark:text-[#B4ABA0] leading-relaxed max-w-xl">
                          {prob.aiContext}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenDsaProblem(prob.id)}
                        className="h-10 px-5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        {solved ? 'Review Solution' : 'Open in DSA Lab'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* End-of-Topic Interview Check */}
          <div className="space-y-6 pt-10 border-t border-[#DDD5C7] dark:border-[#26221E]">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                Interview Checkpoint (+40 XP per question)
              </h2>
              <p className="text-sm text-[#574F46] dark:text-[#A39A8E]">
                Explain these cleanly in your own words to lock the mental model in permanently.
              </p>
            </div>

            <div className="space-y-6">
              {activeModule.interviewQuestions.map((iq, idx) => {
                const mastered = progress.masteredInterviewIds.includes(iq.id);
                const revealed = Boolean(revealedAnswers[iq.id]);
                const evaluation = evalResults[iq.id];
                const evalError = evalErrors[iq.id];
                const isEvaluating = evalLoadingId === iq.id;

                return (
                  <article
                    key={iq.id}
                    className="p-6 sm:p-7 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
                          <span>Question {idx + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span>{iq.difficulty}</span>
                          {mastered && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#236B4E] dark:text-[#4EA87E] font-medium">
                                Mastered
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-display text-lg font-medium text-[#1B1815] dark:text-[#FAF6EC] leading-snug">
                          {iq.question}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleInterviewMastered(iq.id)}
                        className={`h-8 px-3.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap shrink-0 ${
                          mastered
                            ? 'border-[#236B4E]/40 bg-[#EAF5EF] dark:bg-[#192820] text-[#236B4E] dark:text-[#7CD0A5]'
                            : 'border-[#D4CBB9] dark:border-[#322D28] text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C]'
                        }`}
                      >
                        {mastered ? 'Mastered' : 'Mark Mastered'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor={`interview-input-${iq.id}`}
                        className="block text-xs font-medium text-[#696056] dark:text-[#A39A8E]"
                      >
                        Draft your explanation
                      </label>
                      <textarea
                        id={`interview-input-${iq.id}`}
                        rows={2}
                        value={userInterviewDrafts[iq.id] || ''}
                        onChange={(e) =>
                          setUserInterviewDrafts((prev) => ({
                            ...prev,
                            [iq.id]: e.target.value,
                          }))
                        }
                        placeholder="Type how you would explain this in an engineering interview..."
                        className="w-full rounded-xl border border-[#DDD5C7] dark:border-[#2E2924] bg-[#F6F2EA] dark:bg-[#12100E] px-4 py-3 text-sm text-[#1B1815] dark:text-[#FAF6EC] placeholder:text-[#8C8175] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C]"
                      />
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          disabled={isEvaluating}
                          onClick={() =>
                            void handleEvaluateInterview(iq.id, iq.question, iq.modelAnswer)
                          }
                          className="h-9 px-4 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {isEvaluating ? 'Evaluating...' : 'Evaluate with AI'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedAnswers((prev) => ({ ...prev, [iq.id]: !prev[iq.id] }))
                          }
                          className="h-9 px-4 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors whitespace-nowrap"
                        >
                          {revealed ? 'Hide Model Answer' : 'Show Model Answer'}
                        </button>
                      </div>
                      {evalError && (
                        <p className="text-xs text-[#B94A38] dark:text-[#DF7A66]">{evalError}</p>
                      )}
                    </div>

                    {evaluation && (
                      <div className="p-4 rounded-xl border border-[#DDD5C7] dark:border-[#2E2924] bg-[#F6F2EA] dark:bg-[#12100E] space-y-2 text-xs">
                        <div className="flex items-center gap-2 font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                          <span>Assessment: {evaluation.verdict}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {evaluation.scoreOutOf5}/5
                          </span>
                        </div>
                        {evaluation.strengths.length > 0 && (
                          <p className="text-[#574F46] dark:text-[#D5CCC0]">
                            <strong className="text-[#236B4E] dark:text-[#4EA87E]">
                              Strengths:
                            </strong>{' '}
                            {evaluation.strengths.join(' ')}
                          </p>
                        )}
                        {evaluation.missingConcepts.length > 0 && (
                          <p className="text-[#574F46] dark:text-[#D5CCC0]">
                            <strong className="text-[#B8621B] dark:text-[#E5A93C]">
                              Add next time:
                            </strong>{' '}
                            {evaluation.missingConcepts.join(' ')}
                          </p>
                        )}
                      </div>
                    )}

                    {revealed && (
                      <div className="p-4 rounded-xl border border-[#DDD5C7] dark:border-[#2E2924] bg-[#F6F2EA] dark:bg-[#12100E] space-y-2.5 text-sm">
                        <p className="text-[#1B1815] dark:text-[#F4EFE6] leading-relaxed">
                          {iq.modelAnswer}
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-[#574F46] dark:text-[#B4ABA0]">
                          {iq.keyPoints.map((kp) => (
                            <li key={kp}>{kp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Editorial Footer Prev / Next Chapter Navigation */}
      <footer className="pt-8 border-t border-[#DDD5C7] dark:border-[#26221E] flex flex-wrap items-center justify-between gap-4">
        {prevModule ? (
          <button
            type="button"
            onClick={() => onSelectModule(prevModule.id)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#FAF6EC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{prevModule.title}</span>
          </button>
        ) : (
          <span />
        )}

        {nextModule && (
          <button
            type="button"
            onClick={() => onSelectModule(nextModule.id)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1B1815] dark:text-[#FAF6EC] hover:text-[#B8621B] dark:hover:text-[#E5A93C] transition-colors"
          >
            <span>{nextModule.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
