import type {
  CourseModule,
  DsaProblem,
  PersonalizedRoadmap,
  RoadmapDay,
  StudyProgressState,
} from '../types/course';
import { CHAPTER_STORIES, RANK_TIERS, type RankTier } from '../data/storyContent';

export interface RewardSummary {
  totalXp: number;
  chapterXp: number;
  dsaXp: number;
  interviewXp: number;
  notesXp: number;
  currentRank: RankTier;
  nextRank: RankTier | null;
  xpToNextRank: number;
  rankProgressPercent: number;
}

export function computeRewardSummary(
  state: StudyProgressState,
  notesCount: number
): RewardSummary {
  const chapterXp = state.completedModuleIds.reduce(
    (sum, id) => sum + (CHAPTER_STORIES[id]?.xpReward ?? 120),
    0
  );
  const dsaXp = state.solvedProblemIds.length * 80;
  const interviewXp = state.masteredInterviewIds.length * 40;
  const notesXp = Math.min(notesCount, 40) * 15;
  const totalXp = chapterXp + dsaXp + interviewXp + notesXp;

  let currentRank = RANK_TIERS[0];
  let nextRank: RankTier | null = RANK_TIERS[1] ?? null;
  for (let i = 0; i < RANK_TIERS.length; i += 1) {
    if (totalXp >= RANK_TIERS[i].minXp) {
      currentRank = RANK_TIERS[i];
      nextRank = RANK_TIERS[i + 1] ?? null;
    }
  }

  const xpToNextRank = nextRank ? Math.max(0, nextRank.minXp - totalXp) : 0;
  const span = nextRank ? Math.max(1, nextRank.minXp - currentRank.minXp) : 1;
  const rankProgressPercent = nextRank
    ? Math.min(100, Math.round(((totalXp - currentRank.minXp) / span) * 100))
    : 100;

  return {
    totalXp,
    chapterXp,
    dsaXp,
    interviewXp,
    notesXp,
    currentRank,
    nextRank,
    xpToNextRank,
    rankProgressPercent,
  };
}

export const VIDEO_ID = 'ygXn5nV5qFc';

export function formatSecondsToTimestamp(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function parseTimestampToSeconds(label: string): number {
  const cleaned = label.trim();
  const parts = cleaned.split(':').map((p) => Number.parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n) || n < 0)) {
    return 0;
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}

export function buildYoutubeEmbedUrl(
  videoId: string,
  startSeconds: number,
  autoplay = false
): string {
  const safeStart = Math.max(0, Math.floor(startSeconds));
  const params = new URLSearchParams({
    start: String(safeStart),
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
  });
  if (autoplay) {
    params.set('autoplay', '1');
  }
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
}

export interface PhaseProgressSummary {
  phase: 1 | 2 | 3 | 4;
  phaseTitle: string;
  completedCount: number;
  totalCount: number;
  percent: number;
}

export interface ComputedProgressMetrics {
  overallPercent: number;
  completedModulesCount: number;
  totalModulesCount: number;
  studiedMinutes: number;
  totalMinutes: number;
  solvedDsaCount: number;
  totalDsaCount: number;
  masteredInterviewsCount: number;
  totalInterviewsCount: number;
  phaseBreakdown: PhaseProgressSummary[];
  nextRecommendedModule: CourseModule | null;
}

export function computeProgressMetrics(
  modules: CourseModule[],
  problems: DsaProblem[],
  state: StudyProgressState
): ComputedProgressMetrics {
  const completedSet = new Set(state.completedModuleIds);
  const solvedSet = new Set(state.solvedProblemIds);
  const masteredSet = new Set(state.masteredInterviewIds);

  const totalModulesCount = modules.length;
  const completedModulesCount = modules.filter((m) => completedSet.has(m.id)).length;

  const totalMinutes = modules.reduce((sum, m) => sum + m.durationMinutes, 0);
  const studiedMinutes = modules
    .filter((m) => completedSet.has(m.id))
    .reduce((sum, m) => sum + m.durationMinutes, 0);

  const totalDsaCount = problems.length;
  const solvedDsaCount = problems.filter((p) => solvedSet.has(p.id)).length;

  const allInterviewIds = modules.flatMap((m) => m.interviewQuestions.map((q) => q.id));
  const totalInterviewsCount = allInterviewIds.length;
  const masteredInterviewsCount = allInterviewIds.filter((id) => masteredSet.has(id)).length;

  // Weighted mastery: 55% modules, 30% DSA practice, 15% interview checks
  const moduleRatio = totalModulesCount > 0 ? completedModulesCount / totalModulesCount : 0;
  const dsaRatio = totalDsaCount > 0 ? solvedDsaCount / totalDsaCount : 0;
  const interviewRatio = totalInterviewsCount > 0 ? masteredInterviewsCount / totalInterviewsCount : 0;
  const overallPercent = Math.round((moduleRatio * 0.55 + dsaRatio * 0.3 + interviewRatio * 0.15) * 100);

  const phasesMap = new Map<1 | 2 | 3 | 4, { title: string; total: number; done: number }>();
  for (const mod of modules) {
    const existing = phasesMap.get(mod.phase) ?? { title: mod.phaseTitle, total: 0, done: 0 };
    existing.total += 1;
    if (completedSet.has(mod.id)) {
      existing.done += 1;
    }
    phasesMap.set(mod.phase, existing);
  }

  const phaseBreakdown: PhaseProgressSummary[] = ([1, 2, 3, 4] as const)
    .filter((p) => phasesMap.has(p))
    .map((phase) => {
      const info = phasesMap.get(phase)!;
      return {
        phase,
        phaseTitle: info.title,
        completedCount: info.done,
        totalCount: info.total,
        percent: info.total > 0 ? Math.round((info.done / info.total) * 100) : 0,
      };
    });

  const nextRecommendedModule = modules.find((m) => !completedSet.has(m.id)) ?? modules[0] ?? null;

  return {
    overallPercent,
    completedModulesCount,
    totalModulesCount,
    studiedMinutes,
    totalMinutes,
    solvedDsaCount,
    totalDsaCount,
    masteredInterviewsCount,
    totalInterviewsCount,
    phaseBreakdown,
    nextRecommendedModule,
  };
}

export interface RoadmapConfigInput {
  experienceLevel: 'Complete Beginner' | 'Knows Another Language' | 'Refreshing for AI';
  dailyMinutes: number;
  goal: 'Build AI Agents' | 'Crack Python Interviews' | 'Data & Automation' | 'Full Course Mastery';
  focusTopicIds?: string[];
}

export function generateLocalSpacedRoadmap(
  modules: CourseModule[],
  problems: DsaProblem[],
  config: RoadmapConfigInput,
  completedModuleIds: string[],
  solvedProblemIds: string[]
): PersonalizedRoadmap {
  const safeDaily = Math.min(240, Math.max(20, Math.round(config.dailyMinutes || 45)));
  const completedSet = new Set(completedModuleIds);
  const solvedSet = new Set(solvedProblemIds);
  const focusSet = new Set(config.focusTopicIds ?? []);

  // Prioritize incomplete modules; if all complete, schedule a full mastery review pass
  let pendingModules = modules.filter((m) => !completedSet.has(m.id));
  if (pendingModules.length === 0) {
    pendingModules = [...modules];
  }

  // Boost selected focus topics to front while keeping logical prerequisites intact
  if (focusSet.size > 0) {
    pendingModules = [
      ...pendingModules.filter((m) => focusSet.has(m.id)),
      ...pendingModules.filter((m) => !focusSet.has(m.id)),
    ];
  }

  const days: RoadmapDay[] = [];
  let dayNum = 1;
  let currentBucket: CourseModule[] = [];
  let bucketMinutes = 0;
  const coveredSoFar: CourseModule[] = [];

  const paceMultiplier =
    config.experienceLevel === 'Complete Beginner'
      ? 1.35
      : config.experienceLevel === 'Refreshing for AI'
        ? 0.9
        : 1.1;

  const flushLearnDay = () => {
    if (currentBucket.length === 0) return;
    const modIds = currentBucket.map((m) => m.id);
    const linkedDsas = currentBucket
      .flatMap((m) => m.linkedDsaIds)
      .filter((id) => !solvedSet.has(id))
      .slice(0, 2);

    const firstTitle = currentBucket[0].title;
    const dayTitle =
      currentBucket.length === 1
        ? firstTitle
        : `${firstTitle.split(':')[0]} + ${currentBucket.length - 1} more`;

    days.push({
      id: `day-${dayNum}`,
      dayNumber: dayNum,
      title: dayTitle,
      focusType: 'Learn',
      estimatedMinutes: Math.min(safeDaily + 15, Math.max(25, Math.round(bucketMinutes))),
      moduleIds: modIds,
      dsaIds: linkedDsas,
      retentionTip:
        'Write at least 2 timestamped notes in your own words and solve one linked DSA drill immediately after watching.',
      checklist: [
        ...currentBucket.map((m) => `Watch & summarize: ${m.title}`),
        ...(linkedDsas.length > 0
          ? [`Solve ${linkedDsas.length} linked Python DSA drill${linkedDsas.length > 1 ? 's' : ''}`]
          : ['Review key moments & complete end-of-topic interview questions']),
      ],
    });
    coveredSoFar.push(...currentBucket);
    dayNum += 1;
    currentBucket = [];
    bucketMinutes = 0;

    // Insert a Spaced-Repetition Retrieval Day every 3 learning days (Ebbinghaus Day 1/3/7 rhythm)
    if (coveredSoFar.length >= 3 && days.filter((d) => d.focusType === 'Learn').length % 3 === 0) {
      const reviewMods = coveredSoFar.slice(-3);
      const reviewDsas = reviewMods
        .flatMap((m) => m.linkedDsaIds)
        .filter((id, idx, arr) => arr.indexOf(id) === idx)
        .slice(0, 2);
      days.push({
        id: `day-${dayNum}`,
        dayNumber: dayNum,
        title: `Active Recall Checkpoint: ${reviewMods[0].phaseTitle}`,
        focusType: 'Spaced Review',
        estimatedMinutes: Math.max(25, Math.round(safeDaily * 0.85)),
        moduleIds: reviewMods.map((m) => m.id),
        dsaIds: reviewDsas,
        retentionTip:
          'Close the transcript first and answer the end-of-topic interview questions from memory before checking hints.',
        checklist: [
          'Review your timestamped notes & Key Moment Excerpts without rewatching',
          'Re-code 1 earlier DSA problem from scratch without starter hints',
          'Answer 3 end-of-topic interview questions aloud or in writing',
        ],
      });
      dayNum += 1;
    }
  };

  for (const mod of pendingModules) {
    const estCost = Math.round(mod.durationMinutes * paceMultiplier);
    if (currentBucket.length > 0 && bucketMinutes + estCost > safeDaily * 1.15) {
      flushLearnDay();
    }
    currentBucket.push(mod);
    bucketMinutes += estCost;
  }
  flushLearnDay();

  // Add a final synthesis / interview readiness day if goal includes interviews or mastery
  const unsolvedDsas = problems.filter((p) => !solvedSet.has(p.id)).slice(0, 3);
  days.push({
    id: `day-${dayNum}`,
    dayNumber: dayNum,
    title:
      config.goal === 'Crack Python Interviews'
        ? 'Mock Technical Interview & DSA Timed Sprint'
        : 'AI Pipeline Synthesis & Retention Audit',
    focusType: 'Capstone',
    estimatedMinutes: safeDaily,
    moduleIds: modules.slice(-2).map((m) => m.id),
    dsaIds: unsolvedDsas.map((p) => p.id),
    retentionTip:
      'Explain each concept aloud as if mentoring a teammate—teaching exposes the final 10% of hidden gaps.',
    checklist: [
      'Complete remaining high-priority DSA drills under a 15-minute timer each',
      'Audit all interview questions marked for review',
      'Build a mini Python script combining `.env`, `requests`, dataclasses, and `try/except`',
    ],
  });

  return {
    id: `roadmap-${Date.now()}`,
    title: `${days.length}-Day ${config.goal} Plan`,
    goal: config.goal,
    experienceLevel: config.experienceLevel,
    dailyMinutes: safeDaily,
    totalDays: days.length,
    summary: `Tailored for ${config.experienceLevel.toLowerCase()} learners studying ${safeDaily} min/day. Interleaves the 5-hour Python for AI video segments with hands-on DSA drills and active-recall checkpoints.`,
    days,
    generatedBy: 'local',
    createdAtIso: new Date().toISOString(),
  };
}

export function sanitizeNoteContent(raw: string): string {
  return raw.trim().slice(0, 4000);
}

export function sanitizeIdArray(ids: string[], maxLen: number): string[] {
  const unique = Array.from(
    new Set(ids.filter((id) => typeof id === 'string' && /^[a-zA-Z0-9_\-]{1,64}$/.test(id)))
  );
  return unique.slice(0, maxLen);
}

/**
 * Returns the index of the transcript segment active at `seekSeconds`
 * (the latest segment whose timestampSeconds <= seekSeconds, falling back to 0).
 */
export function findActiveTranscriptSegmentIndex(
  transcript: Array<{ timestampSeconds: number }>,
  seekSeconds: number
): number {
  if (transcript.length === 0) return -1;
  let activeIdx = 0;
  for (let i = 0; i < transcript.length; i += 1) {
    if (transcript[i].timestampSeconds <= seekSeconds) {
      activeIdx = i;
    }
  }
  return activeIdx;
}
