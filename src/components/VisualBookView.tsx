import { useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Layers,
  Printer,
} from 'lucide-react';
import { COURSE_METADATA, COURSE_MODULES } from '../data/courseData';
import { useStudy } from '../context/StudyContext';
import { buildVisualNotebookHtml, triggerHtmlFileDownload } from '../utils/bookExporter';
import { RuledNotebookSheet } from './RuledNotebookSheet';

const BOOK_COVER_URL = '/src/assets/images/book_cover_monograph_1795302837045.jpg';

interface VisualBookViewProps {
  onJumpToModule: (moduleId: string, startSeconds?: number) => void;
}

export function VisualBookView({ onJumpToModule }: VisualBookViewProps) {
  const { progress, notes, addNote, deleteNote } = useStudy();
  const [paperTheme, setPaperTheme] = useState<'warm' | 'dark'>('warm');
  const [viewMode, setViewMode] = useState<'page' | 'all'>('page');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [coverFailed, setCoverFailed] = useState(false);

  const activeModule = COURSE_MODULES[pageIndex] ?? COURSE_MODULES[0];

  const notesByModule = useMemo(() => {
    const map = new Map<string, typeof notes>();
    for (const note of notes) {
      const list = map.get(note.moduleId) ?? [];
      list.push(note);
      map.set(note.moduleId, list);
    }
    return map;
  }, [notes]);

  const handleDownloadFullBook = () => {
    const html = buildVisualNotebookHtml(
      COURSE_MODULES,
      notes,
      `${COURSE_METADATA.title} — Visual Field Book`
    );
    triggerHtmlFileDownload('pypath-python-for-ai-visual-book.html', html);
  };

  const handlePrintBook = () => {
    if (viewMode !== 'all') {
      setViewMode('all');
      window.setTimeout(() => window.print(), 120);
    } else {
      window.print();
    }
  };

  return (
    <div className="max-w-[980px] mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-12">
      {/* Illustrated Monograph Masthead with Generated Book Cover Artwork */}
      <header className="no-print grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-[#DDD5C7] dark:border-[#26221E]">
        <div className="md:col-span-4">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#DDD5C7] dark:border-[#2A2520] bg-[#1B1815]">
            {!coverFailed ? (
              <img
                src={BOOK_COVER_URL}
                alt="Embossed charcoal linen hardcover monograph cover for the Python for AI Field Book"
                referrerPolicy="no-referrer"
                onError={() => setCoverFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#E5A93C]">
                <BookOpen className="w-8 h-8" />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="text-xs text-[#696056] dark:text-[#A39A8E] flex flex-wrap items-center gap-2">
            <span>Illustrated Field Book</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{COURSE_MODULES.length} Ruled Chapters</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{notes.length} Personal Notes Included</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1B1815] dark:text-[#FAF6EC] leading-tight">
            Python for AI —{' '}
            <em className="italic font-normal text-[#B8621B] dark:text-[#E5A93C]">
              Visual Field Book
            </em>
          </h1>

          <p className="text-sm sm:text-base text-[#574F46] dark:text-[#B4ABA0] leading-relaxed">
            Every chapter distilled into one visual story diagram, three handwritten mental models on ruled paper, and your own study notes. Download a single topic sheet or take the whole book offline.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownloadFullBook}
              className="h-10 px-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download Full Book (.html)
            </button>

            <button
              type="button"
              onClick={handlePrintBook}
              className="h-10 px-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#F4EFE6] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
          </div>
        </div>
      </header>

      {/* Book Reading Controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            role="group"
            aria-label="Notebook paper appearance"
            className="inline-flex items-center p-1 rounded-full bg-[#EAE3D5] dark:bg-[#1E1B18] border border-[#DDD5C7] dark:border-[#2D2823]"
          >
            <button
              type="button"
              onClick={() => setPaperTheme('warm')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
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
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                paperTheme === 'dark'
                  ? 'bg-[#FCFBF8] dark:bg-[#2F2A24] text-[#1B1815] dark:text-[#FAF6EC]'
                  : 'text-[#696056] dark:text-[#A39A8E]'
              }`}
            >
              Night Ink
            </button>
          </div>

          <div
            role="group"
            aria-label="Book layout mode"
            className="inline-flex items-center p-1 rounded-full bg-[#EAE3D5] dark:bg-[#1E1B18] border border-[#DDD5C7] dark:border-[#2D2823]"
          >
            <button
              type="button"
              onClick={() => setViewMode('page')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                viewMode === 'page'
                  ? 'bg-[#FCFBF8] dark:bg-[#2F2A24] text-[#1B1815] dark:text-[#FAF6EC]'
                  : 'text-[#696056] dark:text-[#A39A8E]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Page by Page
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                viewMode === 'all'
                  ? 'bg-[#FCFBF8] dark:bg-[#2F2A24] text-[#1B1815] dark:text-[#FAF6EC]'
                  : 'text-[#696056] dark:text-[#A39A8E]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All {COURSE_MODULES.length} Pages
            </button>
          </div>
        </div>

        {viewMode === 'page' && (
          <div className="flex items-center gap-2">
            <label htmlFor="book-chapter-select" className="sr-only">
              Select notebook chapter page
            </label>
            <select
              id="book-chapter-select"
              value={pageIndex}
              onChange={(e) => setPageIndex(Number(e.target.value))}
              className="h-9 max-w-[235px] px-3.5 text-xs font-medium rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] text-[#1B1815] dark:text-[#F4EFE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C]"
            >
              {COURSE_MODULES.map((m, idx) => (
                <option key={m.id} value={idx}>
                  Page {String(idx + 1).padStart(2, '0')} — {m.title.replace(/^\d+\.\s*/, '')}
                </option>
              ))}
            </select>

            <div className="inline-flex items-center rounded-full border border-[#D4CBB9] dark:border-[#322D28] bg-[#FCFBF8] dark:bg-[#191715] overflow-hidden shrink-0">
              <button
                type="button"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                aria-label="Previous notebook page"
                className="h-9 px-3 inline-flex items-center justify-center text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] disabled:opacity-35 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="h-4 w-px bg-[#DDD5C7] dark:bg-[#2D2823]" aria-hidden="true" />
              <button
                type="button"
                disabled={pageIndex === COURSE_MODULES.length - 1}
                onClick={() => setPageIndex((i) => Math.min(COURSE_MODULES.length - 1, i + 1))}
                aria-label="Next notebook page"
                className="h-9 px-3 inline-flex items-center justify-center text-[#574F46] dark:text-[#D5CCC0] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] disabled:opacity-35 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ruled Notebook Sheets */}
      {viewMode === 'page' ? (
        <div className="space-y-6">
          <RuledNotebookSheet
            module={activeModule}
            notes={notesByModule.get(activeModule.id) ?? []}
            paperTheme={paperTheme}
            onSeekVideo={(secs) => onJumpToModule(activeModule.id, secs)}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
          />

          <div className="no-print flex items-center justify-between pt-2 text-xs text-[#696056] dark:text-[#A39A8E]">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-1.5 font-medium text-[#1B1815] dark:text-[#F4EFE6] hover:text-[#B8621B] dark:hover:text-[#E5A93C] disabled:opacity-35 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Page
            </button>

            <span className="font-mono tabular-nums">
              Page {pageIndex + 1} of {COURSE_MODULES.length}
              {progress.completedModuleIds.includes(activeModule.id) ? ' · Completed' : ''}
            </span>

            <button
              type="button"
              disabled={pageIndex === COURSE_MODULES.length - 1}
              onClick={() => setPageIndex((i) => Math.min(COURSE_MODULES.length - 1, i + 1))}
              className="inline-flex items-center gap-1.5 font-medium text-[#1B1815] dark:text-[#F4EFE6] hover:text-[#B8621B] dark:hover:text-[#E5A93C] disabled:opacity-35 disabled:pointer-events-none"
            >
              Next Page
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {COURSE_MODULES.map((mod) => (
            <div key={mod.id} className="print-sheet">
              <RuledNotebookSheet
                module={mod}
                notes={notesByModule.get(mod.id) ?? []}
                paperTheme={paperTheme}
                onSeekVideo={(secs) => onJumpToModule(mod.id, secs)}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
