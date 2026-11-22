import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  Code2,
  Play,
  Sparkles,
} from 'lucide-react';
import { COURSE_MODULES } from '../data/courseData';
import { DSA_PROBLEMS } from '../data/dsaProblems';
import { useStudy } from '../context/StudyContext';
import type { PersonalizedRoadmap } from '../types/course';
import { generateLocalSpacedRoadmap, type RoadmapConfigInput } from '../utils/studyLogic';

interface RoadmapViewProps {
  onJumpToModule: (moduleId: string) => void;
  onOpenDsaProblem: (problemId: string) => void;
}

export function RoadmapView({ onJumpToModule, onOpenDsaProblem }: RoadmapViewProps) {
  const { progress, roadmap, saveRoadmap, toggleRoadmapDayComplete } = useStudy();

  const [experienceLevel, setExperienceLevel] = useState<RoadmapConfigInput['experienceLevel']>(
    'Complete Beginner'
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(60);
  const [goal, setGoal] = useState<RoadmapConfigInput['goal']>('Build AI Agents');
  const [selectedFocusIds, setSelectedFocusIds] = useState<string[]>([]);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const moduleMap = useMemo(
    () => new Map(COURSE_MODULES.map((m) => [m.id, m])),
    []
  );
  const dsaMap = useMemo(
    () => new Map(DSA_PROBLEMS.map((p) => [p.id, p])),
    []
  );

  const toggleFocusModule = (id: string) => {
    setSelectedFocusIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id].slice(0, 5)
    );
  };

  const handleGenerateLocal = () => {
    setErrorMsg(null);
    const plan = generateLocalSpacedRoadmap(
      COURSE_MODULES,
      DSA_PROBLEMS,
      {
        experienceLevel,
        dailyMinutes,
        goal,
        focusTopicIds: selectedFocusIds,
      },
      progress.completedModuleIds,
      progress.solvedProblemIds
    );
    saveRoadmap(plan);
  };

  const handleGenerateAi = async () => {
    setGeneratingAi(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceLevel,
          dailyMinutes,
          goal,
          completedModuleIds: progress.completedModuleIds,
          solvedProblemIds: progress.solvedProblemIds,
          focusTopicIds: selectedFocusIds,
        }),
      });
      const data = (await res.json()) as PersonalizedRoadmap & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Could not generate AI roadmap.');
      }
      saveRoadmap(data);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Roadmap generation failed.');
    } finally {
      setGeneratingAi(false);
    }
  };

  const completedDaysCount = roadmap
    ? roadmap.days.filter((d) => progress.completedRoadmapDayIds.includes(d.id)).length
    : 0;

  return (
    <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-12 sm:py-14 space-y-12">
      {/* Header */}
      <header className="pb-8 border-b border-[#DDD5C7] dark:border-[#26221E] space-y-2.5">
        <div className="text-xs text-[#696056] dark:text-[#A39A8E]">
          Spaced-Repetition Scheduler · Optimized for Active Recall
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1B1815] dark:text-[#FAF6EC]">
          Personalized{' '}
          <em className="italic font-normal text-[#B8621B] dark:text-[#E5A93C]">Study Roadmap</em>
        </h1>
        <p className="text-sm sm:text-base text-[#574F46] dark:text-[#B4ABA0] max-w-2xl leading-relaxed">
          Turn 5 hours of lectures into calm daily sessions with Day 1 / Day 3 / Day 7 active-recall checkpoints and paired DSA drills.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Configuration */}
        <section className="lg:col-span-4 p-6 rounded-2xl border border-[#DDD5C7] dark:border-[#26221E] bg-[#FCFBF8] dark:bg-[#191715] space-y-6">
          <h2 className="font-display text-xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
            Your Study Cadence
          </h2>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="roadmap-experience"
                className="block text-xs font-medium text-[#574F46] dark:text-[#D5CCC0]"
              >
                Current Python Background
              </label>
              <select
                id="roadmap-experience"
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(e.target.value as RoadmapConfigInput['experienceLevel'])
                }
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-[#D4CBB9] dark:border-[#322D28] bg-[#F6F2EA] dark:bg-[#12100E] text-[#1B1815] dark:text-[#FAF6EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F]"
              >
                <option value="Complete Beginner">Complete Beginner</option>
                <option value="Knows Another Language">Knows Another Language</option>
                <option value="Refreshing for AI">Refreshing for AI</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="roadmap-goal"
                className="block text-xs font-medium text-[#574F46] dark:text-[#D5CCC0]"
              >
                Primary Learning Goal
              </label>
              <select
                id="roadmap-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as RoadmapConfigInput['goal'])}
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-[#D4CBB9] dark:border-[#322D28] bg-[#F6F2EA] dark:bg-[#12100E] text-[#1B1815] dark:text-[#FAF6EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F]"
              >
                <option value="Build AI Agents">Build AI Agents</option>
                <option value="Crack Python Interviews">Crack Python Interviews</option>
                <option value="Data & Automation">Data &amp; Automation</option>
                <option value="Full Course Mastery">Full Course Mastery</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="roadmap-daily-minutes"
                  className="font-medium text-[#574F46] dark:text-[#D5CCC0]"
                >
                  Daily Study Budget
                </label>
                <span className="font-mono tabular-nums text-[#1B1815] dark:text-[#FAF6EC] font-medium">
                  {dailyMinutes} min / day
                </span>
              </div>
              <input
                id="roadmap-daily-minutes"
                type="range"
                min={30}
                max={150}
                step={15}
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full accent-[#C26D1F] dark:accent-[#E5A93C]"
              />
              <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#857B6F]">
                <span>30m</span>
                <span>60m</span>
                <span>90m</span>
                <span>120m</span>
                <span>150m</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-[#574F46] dark:text-[#D5CCC0]">
                Prioritize Chapters (optional, up to 5)
              </div>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {COURSE_MODULES.map((m) => {
                  const checked = selectedFocusIds.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 text-xs text-[#574F46] dark:text-[#D5CCC0] py-1 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFocusModule(m.id)}
                        className="rounded border-[#D4CBB9] dark:border-[#3A342E] accent-[#C26D1F] dark:accent-[#E5A93C]"
                      />
                      <span className="truncate">{m.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl border border-[#B94A38]/30 bg-[#FBECE9] dark:bg-[#2A1916] text-xs text-[#B94A38] dark:text-[#DF7A66] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              disabled={generatingAi}
              onClick={() => void handleGenerateAi()}
              className="w-full h-11 inline-flex items-center justify-center gap-2 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {generatingAi ? 'Generating Personalized Plan...' : 'Generate AI Roadmap'}
            </button>
            <button
              type="button"
              onClick={handleGenerateLocal}
              className="w-full h-10 inline-flex items-center justify-center gap-2 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] text-[#1B1815] dark:text-[#F4EFE6] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Build Instant Spaced Plan
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: Day-by-Day Editorial Itinerary */}
        <section className="lg:col-span-8 space-y-6">
          {!roadmap ? (
            <div className="p-12 rounded-2xl border border-dashed border-[#D4CBB9] dark:border-[#2E2924] text-center space-y-4">
              <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                No study schedule generated yet
              </h2>
              <p className="text-sm text-[#574F46] dark:text-[#A39A8E] max-w-md mx-auto leading-relaxed">
                Pick your daily minutes and goal on the left to build a day-by-day study itinerary synchronized with your completed chapters.
              </p>
              <button
                type="button"
                onClick={handleGenerateLocal}
                className="h-10 px-6 inline-flex items-center gap-2 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 transition-opacity"
              >
                Create My First Plan
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="pb-6 border-b border-[#DDD5C7] dark:border-[#26221E] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{roadmap.goal}</span>
                    <span aria-hidden="true">·</span>
                    <span>{roadmap.experienceLevel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{roadmap.dailyMinutes} min/day</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#1B1815] dark:text-[#FAF6EC] font-medium">
                    {completedDaysCount}/{roadmap.days.length} days complete
                  </span>
                </div>
                <h2 className="font-display text-2xl font-medium text-[#1B1815] dark:text-[#FAF6EC]">
                  {roadmap.title}
                </h2>
                <p className="text-sm text-[#574F46] dark:text-[#B4ABA0] leading-relaxed">
                  {roadmap.summary}
                </p>
              </div>

              <div className="divide-y divide-[#DDD5C7] dark:divide-[#26221E]">
                {roadmap.days.map((day) => {
                  const done = progress.completedRoadmapDayIds.includes(day.id);
                  return (
                    <article key={day.id} className="py-6 first:pt-0 space-y-3">
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => toggleRoadmapDayComplete(day.id)}
                          aria-label={
                            done
                              ? `Mark Day ${day.dayNumber} incomplete`
                              : `Mark Day ${day.dayNumber} complete`
                          }
                          className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            done
                              ? 'bg-[#236B4E] dark:bg-[#4EA87E] border-transparent text-white dark:text-[#12100E]'
                              : 'border-[#B8AD9D] dark:border-[#4A433B] text-transparent hover:border-[#C26D1F]'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </button>

                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#696056] dark:text-[#A39A8E]">
                              <span className="font-mono tabular-nums font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                                Day {day.dayNumber}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={
                                  day.focusType === 'Spaced Review'
                                    ? 'text-[#B8621B] dark:text-[#E5A93C] font-medium'
                                    : ''
                                }
                              >
                                {day.focusType}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                ~{day.estimatedMinutes} min
                              </span>
                            </div>
                            <h3 className="font-display text-xl font-medium text-[#1B1815] dark:text-[#FAF6EC] mt-0.5">
                              {day.title}
                            </h3>
                          </div>

                          <ul className="list-disc pl-5 space-y-1 text-sm text-[#4C453D] dark:text-[#D5CCC0]">
                            {day.checklist.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>

                          <p className="text-xs text-[#696056] dark:text-[#A39A8E]">
                            <span className="font-semibold text-[#1B1815] dark:text-[#FAF6EC]">
                              Retention tactic:
                            </span>{' '}
                            {day.retentionTip}
                          </p>

                          {(day.moduleIds.length > 0 || day.dsaIds.length > 0) && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {day.moduleIds.map((mid) => {
                                const mod = moduleMap.get(mid);
                                if (!mod) return null;
                                return (
                                  <button
                                    key={mid}
                                    type="button"
                                    onClick={() => onJumpToModule(mid)}
                                    className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#F4EFE6] hover:border-[#C26D1F] dark:hover:border-[#E5A93C] transition-colors"
                                  >
                                    <Play className="w-3 h-3 text-[#B8621B] dark:text-[#E5A93C]" />
                                    {mod.title.split(':')[0]}
                                  </button>
                                );
                              })}
                              {day.dsaIds.map((did) => {
                                const prob = dsaMap.get(did);
                                if (!prob) return null;
                                return (
                                  <button
                                    key={did}
                                    type="button"
                                    onClick={() => onOpenDsaProblem(did)}
                                    className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#F4EFE6] hover:border-[#236B4E] dark:hover:border-[#4EA87E] transition-colors"
                                  >
                                    <Code2 className="w-3 h-3 text-[#236B4E] dark:text-[#4EA87E]" />
                                    {prob.title}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
