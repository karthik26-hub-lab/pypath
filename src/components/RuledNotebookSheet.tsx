import { useState } from 'react';
import { Download, Play, Plus, Trash2 } from 'lucide-react';
import { CHAPTER_STORIES } from '../data/storyContent';
import type { CourseModule, StudyNote } from '../types/course';
import { formatSecondsToTimestamp } from '../utils/studyLogic';
import { buildVisualNotebookHtml, triggerHtmlFileDownload } from '../utils/bookExporter';
import { TopicInfographic } from './TopicInfographic';

interface RuledNotebookSheetProps {
  module: CourseModule;
  notes: StudyNote[];
  paperTheme: 'warm' | 'dark';
  currentCueSeconds?: number;
  onSeekVideo?: (seconds: number) => void;
  onAddNote?: (moduleId: string, seconds: number, content: string) => void;
  onDeleteNote?: (noteId: string) => void;
}

export function RuledNotebookSheet({
  module,
  notes,
  paperTheme,
  currentCueSeconds,
  onSeekVideo,
  onAddNote,
  onDeleteNote,
}: RuledNotebookSheetProps) {
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState<string | null>(null);

  const story = CHAPTER_STORIES[module.id];
  const isWarm = paperTheme === 'warm';
  const bullets = story?.handwrittenBullets ?? module.transcript.map((t) => t.takeaway);
  const topExcerpt = module.excerpts[0];

  const handleDownloadTopicSheet = () => {
    const html = buildVisualNotebookHtml([module], notes, module.title);
    triggerHtmlFileDownload(`pypath-${module.id}-visual-notes.html`, html);
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddNote) return;
    if (!draft.trim()) {
      setDraftError('Jot down a quick takeaway before pinning it to the page.');
      return;
    }
    setDraftError(null);
    onAddNote(module.id, currentCueSeconds ?? module.startSeconds, draft);
    setDraft('');
  };

  return (
    <article
      className={`rounded-2xl border overflow-hidden transition-colors ${
        isWarm
          ? 'ruled-paper-light border-[#DFD6C5] text-[#1B1815] shadow-sm'
          : 'ruled-paper-dark border-[#2E2924] text-[#F4EFE6]'
      }`}
    >
      <div className="pl-16 pr-6 sm:pl-20 sm:pr-12 py-9 sm:py-11 space-y-8">
        {/* Notebook Page Top Margin */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div
              className={`text-xs font-mono tabular-nums flex flex-wrap items-center gap-2 ${
                isWarm ? 'text-[#696056]' : 'text-[#A39A8E]'
              }`}
            >
              <span>{module.phaseTitle}</span>
              <span aria-hidden="true">·</span>
              <span>
                {formatSecondsToTimestamp(module.startSeconds)} –{' '}
                {formatSecondsToTimestamp(module.endSeconds)}
              </span>
            </div>
            <h2
              className={`font-hand text-3xl sm:text-4xl font-bold leading-tight ${
                isWarm ? 'text-[#1B1815]' : 'text-[#FAF6EC]'
              }`}
            >
              {module.title}
            </h2>
            {story && (
              <p
                className={`text-sm max-w-2xl leading-relaxed ${
                  isWarm ? 'text-[#574F46]' : 'text-[#B4ABA0]'
                }`}
              >
                {story.storyHook}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleDownloadTopicSheet}
            className={`no-print h-9 px-4 inline-flex items-center gap-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap shrink-0 ${
              isWarm
                ? 'border-[#D4CBB9] bg-[#FCFBF8] text-[#1B1815] hover:bg-[#F3ECE0]'
                : 'border-[#38322B] bg-[#24201C] text-[#F4EFE6] hover:bg-[#2F2A24]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Download Topic Sheet
          </button>
        </div>

        {/* Visual Infographic — Tells the Story at a Glance */}
        <TopicInfographic
          moduleId={module.id}
          dark={!isWarm}
          caption={story?.visualCaption}
        />

        {/* Handwritten Core Mental Models on Ruled Lines */}
        <div className="space-y-2">
          <h3
            className={`font-hand text-2xl font-bold ${
              isWarm ? 'text-[#B8621B]' : 'text-[#E5A93C]'
            }`}
          >
            The Story in 3 Lines
          </h3>
          <ul className="space-y-2 list-disc pl-5 font-hand text-[23px] sm:text-[25px] leading-[32px]">
            {bullets.map((line, i) => (
              <li key={i} className={isWarm ? 'text-[#26221E]' : 'text-[#F4EFE6]'}>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Highlighted Margin Quote */}
        {topExcerpt && (
          <div
            className={`p-5 rounded-xl border space-y-2 ${
              isWarm
                ? 'bg-[#FCFBF8]/90 border-[#E5DEC9]'
                : 'bg-[#141210]/85 border-[#2E2924]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className={isWarm ? 'text-[#696056] font-medium' : 'text-[#A39A8E] font-medium'}>
                Key Moment Excerpt
              </span>
              {onSeekVideo ? (
                <button
                  type="button"
                  onClick={() => onSeekVideo(topExcerpt.timestampSeconds)}
                  className={`no-print inline-flex items-center gap-1 font-mono tabular-nums hover:underline ${
                    isWarm ? 'text-[#B8621B]' : 'text-[#E5A93C]'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  {topExcerpt.timestampLabel}
                </button>
              ) : (
                <span className="font-mono tabular-nums text-[#857B6F]">
                  {topExcerpt.timestampLabel}
                </span>
              )}
            </div>
            <blockquote
              className={`font-hand text-2xl sm:text-[26px] leading-snug ${
                isWarm ? 'text-[#1B1815]' : 'text-[#FAF6EC]'
              }`}
            >
              “{topExcerpt.quote}”
            </blockquote>
          </div>
        )}

        {story?.marginDoodleNote && (
          <p
            className={`font-hand text-2xl font-bold ${
              isWarm ? 'text-[#236B4E]' : 'text-[#4EA87E]'
            }`}
          >
            ★ {story.marginDoodleNote}
          </p>
        )}

        {/* Learner's Own Handwritten Notes Section */}
        <div
          className={`pt-6 border-t space-y-4 ${
            isWarm ? 'border-[#DDD5C7]' : 'border-[#2E2924]'
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3
              className={`font-hand text-2xl font-bold ${
                isWarm ? 'text-[#1B1815]' : 'text-[#FAF6EC]'
              }`}
            >
              My Handwritten Notes ({notes.length})
            </h3>
            {onAddNote && (
              <span
                className={`text-xs font-mono tabular-nums ${
                  isWarm ? 'text-[#696056]' : 'text-[#A39A8E]'
                }`}
              >
                +15 XP per note · bundled into downloads
              </span>
            )}
          </div>

          {notes.length > 0 ? (
            <ul className="space-y-2.5">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    {onSeekVideo ? (
                      <button
                        type="button"
                        onClick={() => onSeekVideo(note.timestampSeconds)}
                        className={`no-print text-xs font-mono tabular-nums hover:underline shrink-0 ${
                          isWarm ? 'text-[#B8621B]' : 'text-[#E5A93C]'
                        }`}
                      >
                        [{note.timestampLabel}]
                      </button>
                    ) : (
                      <span
                        className={`text-xs font-mono tabular-nums shrink-0 ${
                          isWarm ? 'text-[#B8621B]' : 'text-[#E5A93C]'
                        }`}
                      >
                        [{note.timestampLabel}]
                      </span>
                    )}
                    <p
                      className={`font-hand text-[24px] leading-[32px] whitespace-pre-wrap ${
                        isWarm ? 'text-[#26221E]' : 'text-[#F4EFE6]'
                      }`}
                    >
                      {note.content}
                    </p>
                  </div>

                  {onDeleteNote && (
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      aria-label={`Delete handwritten note at ${note.timestampLabel}`}
                      className="no-print p-1.5 text-[#857B6F] hover:text-[#B94A38] transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={`font-hand text-xl ${
                isWarm ? 'text-[#7A7065]' : 'text-[#A39A8E]'
              }`}
            >
              Your personal notes for this chapter will appear right here on the ruled lines—and automatically bundle into your downloadable book.
            </p>
          )}

          {onAddNote && (
            <form onSubmit={handleSubmitNote} className="no-print pt-2 space-y-2">
              <label htmlFor={`ruled-note-${module.id}`} className="sr-only">
                Write a handwritten note on this notebook page
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id={`ruled-note-${module.id}`}
                  type="text"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    if (draftError) setDraftError(null);
                  }}
                  placeholder={`Write a note in your own words at ${formatSecondsToTimestamp(
                    currentCueSeconds ?? module.startSeconds
                  )}...`}
                  className={`flex-1 h-10 px-4 rounded-full border text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] ${
                    isWarm
                      ? 'bg-[#FCFBF8] border-[#D4CBB9] text-[#1B1815] placeholder:text-[#8C8175]'
                      : 'bg-[#12100E] border-[#322D28] text-[#F4EFE6] placeholder:text-[#7A7065]'
                  }`}
                />
                <button
                  type="submit"
                  className={`h-10 px-5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-full transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 ${
                    isWarm
                      ? 'bg-[#1B1815] text-[#FAF6EC]'
                      : 'bg-[#E5A93C] text-[#12100E]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Page
                </button>
              </div>
              {draftError && <p className="text-xs text-[#B94A38]">{draftError}</p>}
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
