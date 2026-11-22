import { LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import type { AppView } from '../types/course';

interface TopBarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
}

const NAV_ITEMS: Array<{ id: AppView; label: string; mobileLabel: string }> = [
  { id: 'chapters', label: 'Chapters', mobileLabel: 'Chapters' },
  { id: 'book', label: 'Field Book', mobileLabel: 'Book' },
  { id: 'dsa', label: 'DSA Lab', mobileLabel: 'DSA' },
  { id: 'roadmap', label: 'Roadmap', mobileLabel: 'Roadmap' },
  { id: 'progress', label: 'Progress', mobileLabel: 'Progress' },
];

export function TopBar({ activeView, onSelectView }: TopBarProps) {
  const { user, progress, toggleTheme, signInWithGoogle, signOutUser } = useStudy();
  const isDark = progress.theme === 'dark';

  const isNavActive = (itemId: AppView) =>
    itemId === 'chapters'
      ? activeView === 'chapters' || activeView === 'chapter'
      : activeView === itemId;

  return (
    <header className="no-print sticky top-0 z-30 border-b border-[#DDD5C7] dark:border-[#26221E] bg-[#F6F2EA]/95 dark:bg-[#12100E]/95 backdrop-blur-sm">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Editorial Serif Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('chapters')}
          className="font-display italic text-xl font-medium tracking-tight text-[#1B1815] dark:text-[#F4EFE6] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C] rounded"
        >
          PyPath
        </button>

        {/* Zone 2: Clean Single-Line Editorial Navigation */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C] rounded ${
                  active
                    ? 'text-[#1B1815] dark:text-[#FAF6EC]'
                    : 'text-[#696056] dark:text-[#A39A8E] hover:text-[#1B1815] dark:hover:text-[#F4EFE6]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C26D1F] dark:bg-[#E5A93C]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Switch & Sync Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#D8CFC0] dark:border-[#2E2924] bg-[#FCFBF8] dark:bg-[#1B1815] text-[#4C453D] dark:text-[#D5CCC0] hover:border-[#B8AD9D] dark:hover:border-[#4A433B] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C]"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <button
              type="button"
              onClick={() => void signOutUser()}
              aria-label="Sign out of synced account"
              className="h-9 px-3.5 inline-flex items-center gap-2 text-xs font-medium rounded-full border border-[#D8CFC0] dark:border-[#2E2924] bg-[#FCFBF8] dark:bg-[#1B1815] text-[#1B1815] dark:text-[#F4EFE6] hover:bg-[#ECE6DA] dark:hover:bg-[#24201C] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C]"
            >
              <span className="max-w-[90px] truncate hidden sm:inline">
                {user.displayName?.split(' ')[0] || 'Synced'}
              </span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="h-9 px-4 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-[#1B1815] text-[#FAF6EC] dark:bg-[#E5A93C] dark:text-[#12100E] hover:bg-[#322C26] dark:hover:bg-[#EEB954] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26D1F] dark:focus-visible:ring-[#E5A93C]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync Progress</span>
              <span className="sm:hidden">Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Compact Mobile Navigation Row */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden grid grid-cols-5 border-t border-[#DDD5C7] dark:border-[#26221E] px-2"
      >
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative py-2.5 text-xs font-medium text-center whitespace-nowrap transition-colors ${
                active
                  ? 'text-[#1B1815] dark:text-[#FAF6EC]'
                  : 'text-[#696056] dark:text-[#A39A8E]'
              }`}
            >
              {item.mobileLabel}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-0 h-[2px] bg-[#C26D1F] dark:bg-[#E5A93C]"
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
