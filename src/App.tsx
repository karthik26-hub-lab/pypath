import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TopBar } from './components/TopBar';
import { StudyStudio } from './components/StudyStudio';
import { ChaptersHomeView } from './components/ChaptersHomeView';
import { VisualBookView } from './components/VisualBookView';
import { DsaLabView } from './components/DsaLabView';
import { RoadmapView } from './components/RoadmapView';
import { ProgressView } from './components/ProgressView';
import { StudyProvider, useStudy } from './context/StudyContext';
import { COURSE_MODULES } from './data/courseData';
import { DSA_PROBLEMS } from './data/dsaProblems';
import type { AppView } from './types/course';

function WorkspaceShell() {
  const { progress, setLastModuleId, syncError } = useStudy();

  const initialModule =
    COURSE_MODULES.find((m) => m.id === progress.lastModuleId) ?? COURSE_MODULES[0];

  const [activeView, setActiveView] = useState<AppView>('chapters');
  const [activeModuleId, setActiveModuleId] = useState<string>(initialModule.id);
  const [seekSeconds, setSeekSeconds] = useState<number>(initialModule.startSeconds);
  const [seekVersion, setSeekVersion] = useState<number>(0);
  const [selectedDsaId, setSelectedDsaId] = useState<string>(DSA_PROBLEMS[0].id);

  const handleSelectModule = (moduleId: string, startSeconds?: number) => {
    const mod = COURSE_MODULES.find((m) => m.id === moduleId) ?? COURSE_MODULES[0];
    setActiveModuleId(mod.id);
    setLastModuleId(mod.id);
    setSeekSeconds(typeof startSeconds === 'number' ? startSeconds : mod.startSeconds);
    setSeekVersion((v) => v + 1);
    setActiveView('chapter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeekVideo = (seconds: number) => {
    setSeekSeconds(seconds);
    setSeekVersion((v) => v + 1);
  };

  const handleOpenDsaProblem = (problemId: string) => {
    setSelectedDsaId(problemId);
    setActiveView('dsa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F2EA] text-[#1B1815] dark:bg-[#12100E] dark:text-[#F4EFE6] transition-colors duration-200">
      <TopBar activeView={activeView} onSelectView={setActiveView} />

      {syncError && (
        <div
          role="alert"
          className="no-print max-w-[1200px] w-full mx-auto px-5 sm:px-8 pt-4 text-xs text-[#9A5316] dark:text-[#E5A93C]"
        >
          Cloud sync notice: {syncError} (changes remain saved locally).
        </div>
      )}

      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeView === 'chapter' ? `chapter-${activeModuleId}` : activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeView === 'chapters' && (
              <ChaptersHomeView
                onOpenChapter={handleSelectModule}
                onOpenVisualBook={() => setActiveView('book')}
              />
            )}

            {activeView === 'chapter' && (
              <StudyStudio
                activeModuleId={activeModuleId}
                seekSeconds={seekSeconds}
                seekVersion={seekVersion}
                onBackToChapters={() => setActiveView('chapters')}
                onSelectModule={handleSelectModule}
                onSeekVideo={handleSeekVideo}
                onOpenDsaProblem={handleOpenDsaProblem}
              />
            )}

            {activeView === 'book' && (
              <VisualBookView onJumpToModule={handleSelectModule} />
            )}

            {activeView === 'dsa' && (
              <DsaLabView
                selectedProblemId={selectedDsaId}
                onSelectProblem={setSelectedDsaId}
                onJumpToModule={(mid) => handleSelectModule(mid)}
              />
            )}

            {activeView === 'roadmap' && (
              <RoadmapView
                onJumpToModule={(mid) => handleSelectModule(mid)}
                onOpenDsaProblem={handleOpenDsaProblem}
              />
            )}

            {activeView === 'progress' && (
              <ProgressView
                onJumpToModule={handleSelectModule}
                onOpenDsaProblem={handleOpenDsaProblem}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StudyProvider>
        <WorkspaceShell />
      </StudyProvider>
    </ErrorBoundary>
  );
}
