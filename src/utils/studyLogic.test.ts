import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildYoutubeEmbedUrl,
  computeProgressMetrics,
  computeRewardSummary,
  findActiveTranscriptSegmentIndex,
  formatSecondsToTimestamp,
  generateLocalSpacedRoadmap,
  parseTimestampToSeconds,
  sanitizeIdArray,
  sanitizeNoteContent,
} from './studyLogic';
import { buildVisualNotebookHtml } from './bookExporter';
import { COURSE_MODULES } from '../data/courseData';
import { DSA_PROBLEMS } from '../data/dsaProblems';

test('timestamp formatting and parsing round-trip cleanly', () => {
  assert.equal(formatSecondsToTimestamp(0), '00:00');
  assert.equal(formatSecondsToTimestamp(750), '12:30');
  assert.equal(formatSecondsToTimestamp(3665), '1:01:05');
  assert.equal(parseTimestampToSeconds('12:30'), 750);
  assert.equal(parseTimestampToSeconds('1:01:05'), 3665);
  assert.equal(parseTimestampToSeconds('invalid'), 0);
});

test('YouTube embed URL includes sanitized start parameter', () => {
  const url = buildYoutubeEmbedUrl('ygXn5nV5qFc', 3495, true);
  assert.ok(url.startsWith('https://www.youtube.com/embed/ygXn5nV5qFc?'));
  assert.ok(url.includes('start=3495'));
  assert.ok(url.includes('autoplay=1'));
  assert.ok(url.includes('rel=0'));
});

test('progress metrics accurately compute completion percentage and phase breakdown', () => {
  const firstTwo = COURSE_MODULES.slice(0, 2).map((m) => m.id);
  const firstDsa = [DSA_PROBLEMS[0].id];
  const firstInterview = [COURSE_MODULES[0].interviewQuestions[0].id];

  const metrics = computeProgressMetrics(COURSE_MODULES, DSA_PROBLEMS, {
    completedModuleIds: firstTwo,
    solvedProblemIds: firstDsa,
    masteredInterviewIds: firstInterview,
    completedRoadmapDayIds: [],
    lastModuleId: COURSE_MODULES[0].id,
    theme: 'dark',
  });

  assert.equal(metrics.completedModulesCount, 2);
  assert.equal(metrics.totalModulesCount, COURSE_MODULES.length);
  assert.equal(metrics.solvedDsaCount, 1);
  assert.equal(metrics.masteredInterviewsCount, 1);
  assert.ok(metrics.overallPercent > 0 && metrics.overallPercent < 100);
  assert.equal(metrics.phaseBreakdown.length, 4);
  assert.equal(metrics.nextRecommendedModule?.id, COURSE_MODULES[2].id);
});

test('reward XP summary computes total XP and advances ranks', () => {
  const starter = computeRewardSummary(
    {
      completedModuleIds: [],
      solvedProblemIds: [],
      masteredInterviewIds: [],
      completedRoadmapDayIds: [],
      lastModuleId: COURSE_MODULES[0].id,
      theme: 'dark',
    },
    0
  );
  assert.equal(starter.totalXp, 0);
  assert.equal(starter.currentRank.title, 'Script Curious');

  const progressed = computeRewardSummary(
    {
      completedModuleIds: [COURSE_MODULES[0].id, COURSE_MODULES[1].id],
      solvedProblemIds: [DSA_PROBLEMS[0].id],
      masteredInterviewIds: [COURSE_MODULES[0].interviewQuestions[0].id],
      completedRoadmapDayIds: [],
      lastModuleId: COURSE_MODULES[0].id,
      theme: 'dark',
    },
    2
  );
  // 100 + 110 + 80 + 40 + 30 = 360 XP -> Traceback Whisperer (min 250)
  assert.equal(progressed.totalXp, 360);
  assert.equal(progressed.currentRank.title, 'Traceback Whisperer');
});

test('visual notebook HTML exporter embeds SVG infographics and user notes', () => {
  const html = buildVisualNotebookHtml(
    [COURSE_MODULES[0]],
    [
      {
        id: 'n1',
        moduleId: COURSE_MODULES[0].id,
        timestampSeconds: 120,
        timestampLabel: '02:00',
        content: 'Read tracebacks from bottom up',
        updatedAtIso: '2026-11-21T00:00:00.000Z',
      },
    ],
    'Chapter 01 Notes'
  );
  assert.ok(html.includes('<svg'));
  assert.ok(html.includes('Caveat'));
  assert.ok(html.includes('Read tracebacks from bottom up'));
  assert.ok(html.includes('window.print()'));
});

test('spaced-repetition roadmap inserts active-recall checkpoints and respects daily budget', () => {
  const plan = generateLocalSpacedRoadmap(
    COURSE_MODULES,
    DSA_PROBLEMS,
    {
      experienceLevel: 'Complete Beginner',
      dailyMinutes: 60,
      goal: 'Build AI Agents',
    },
    [],
    []
  );

  assert.ok(plan.days.length >= 6);
  assert.ok(plan.days.some((d) => d.focusType === 'Spaced Review'));
  assert.equal(plan.days[plan.days.length - 1].focusType, 'Capstone');
  assert.equal(plan.totalDays, plan.days.length);
});

test('Firestore payload sanitizers enforce blueprint constraints', () => {
  assert.equal(sanitizeNoteContent('  hello world  '), 'hello world');
  assert.equal(sanitizeNoteContent('a'.repeat(5000)).length, 4000);

  const cleaned = sanitizeIdArray(['mod-1', 'mod-1', 'bad$id', 'mod-2', 'mod-3'], 2);
  assert.deepEqual(cleaned, ['mod-1', 'mod-2']);
});

test('findActiveTranscriptSegmentIndex tracks the current cue timestamp accurately', () => {
  const segs = [
    { timestampSeconds: 0 },
    { timestampSeconds: 265 },
    { timestampSeconds: 510 },
  ];
  assert.equal(findActiveTranscriptSegmentIndex(segs, 0), 0);
  assert.equal(findActiveTranscriptSegmentIndex(segs, 264), 0);
  assert.equal(findActiveTranscriptSegmentIndex(segs, 265), 1);
  assert.equal(findActiveTranscriptSegmentIndex(segs, 600), 2);
  assert.equal(findActiveTranscriptSegmentIndex([], 100), -1);
});
