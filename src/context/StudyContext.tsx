import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { COURSE_MODULES } from '../data/courseData';
import type {
  PersonalizedRoadmap,
  StudyNote,
  StudyProgressState,
  ThemeMode,
} from '../types/course';
import {
  formatSecondsToTimestamp,
  sanitizeIdArray,
  sanitizeNoteContent,
} from '../utils/studyLogic';

const STORAGE_KEYS = {
  progress: 'pypath_progress_v1',
  notes: 'pypath_notes_v1',
  submissions: 'pypath_submissions_v1',
  roadmap: 'pypath_roadmap_v1',
};

const DEFAULT_PROGRESS: StudyProgressState = {
  completedModuleIds: [],
  solvedProblemIds: [],
  masteredInterviewIds: [],
  completedRoadmapDayIds: [],
  lastModuleId: COURSE_MODULES[0].id,
  theme: 'dark',
};

function loadLocalJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface SubmissionRecord {
  code: string;
  passed: boolean;
}

interface StudyContextValue {
  user: User | null;
  authReady: boolean;
  syncError: string | null;
  progress: StudyProgressState;
  notes: StudyNote[];
  submissions: Record<string, SubmissionRecord>;
  roadmap: PersonalizedRoadmap | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  toggleTheme: () => void;
  setLastModuleId: (moduleId: string) => void;
  toggleModuleComplete: (moduleId: string) => void;
  markProblemSolved: (problemId: string, code: string, passed: boolean) => void;
  saveProblemCode: (problemId: string, code: string, passed: boolean) => void;
  toggleInterviewMastered: (questionId: string) => void;
  toggleRoadmapDayComplete: (dayId: string) => void;
  addNote: (moduleId: string, timestampSeconds: number, content: string) => void;
  deleteNote: (noteId: string) => void;
  saveRoadmap: (plan: PersonalizedRoadmap) => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [progress, setProgress] = useState<StudyProgressState>(() => ({
    ...DEFAULT_PROGRESS,
    ...loadLocalJson<Partial<StudyProgressState>>(STORAGE_KEYS.progress, {}),
  }));
  const [notes, setNotes] = useState<StudyNote[]>(() =>
    loadLocalJson<StudyNote[]>(STORAGE_KEYS.notes, [])
  );
  const [submissions, setSubmissions] = useState<Record<string, SubmissionRecord>>(() =>
    loadLocalJson<Record<string, SubmissionRecord>>(STORAGE_KEYS.submissions, {})
  );
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(() =>
    loadLocalJson<PersonalizedRoadmap | null>(STORAGE_KEYS.roadmap, null)
  );

  // Sync HTML root class with active theme
  useEffect(() => {
    const root = document.documentElement;
    if (progress.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [progress.theme]);

  // Persist local mirror for instant load & offline resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.submissions, JSON.stringify(submissions));
    } catch {
      // Ignore storage quota errors
    }
  }, [submissions]);

  useEffect(() => {
    try {
      if (roadmap) {
        localStorage.setItem(STORAGE_KEYS.roadmap, JSON.stringify(roadmap));
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [roadmap]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Ensure root /users/{uid} document exists before subcollection writes (Master Gate)
  const ensureUserDocExists = useCallback(
    async (uid: string, seed: StudyProgressState) => {
      const userDocPath = `users/${uid}`;
      const userRef = doc(db, 'users', uid);
      try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            userId: uid,
            completedModuleIds: sanitizeIdArray(seed.completedModuleIds, 30),
            solvedProblemIds: sanitizeIdArray(seed.solvedProblemIds, 50),
            masteredInterviewIds: sanitizeIdArray(seed.masteredInterviewIds, 100),
            completedRoadmapDayIds: sanitizeIdArray(seed.completedRoadmapDayIds, 60),
            lastModuleId: seed.lastModuleId || COURSE_MODULES[0].id,
            theme: seed.theme === 'light' ? 'light' : 'dark',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userDocPath);
      }
    },
    []
  );

  // Subscribe to Firestore collections when authenticated & email verified
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      return;
    }

    let cancelled = false;
    const uid = user.uid;
    const unsubscribers: Array<() => void> = [];

    const initSync = async () => {
      try {
        setSyncError(null);
        await ensureUserDocExists(uid, progress);
        if (cancelled) return;

        // 1. Root progress doc
        const userRef = doc(db, 'users', uid);
        unsubscribers.push(
          onSnapshot(
            userRef,
            (snap) => {
              if (!snap.exists()) return;
              const data = snap.data();
              setProgress({
                completedModuleIds: Array.isArray(data.completedModuleIds) ? data.completedModuleIds : [],
                solvedProblemIds: Array.isArray(data.solvedProblemIds) ? data.solvedProblemIds : [],
                masteredInterviewIds: Array.isArray(data.masteredInterviewIds) ? data.masteredInterviewIds : [],
                completedRoadmapDayIds: Array.isArray(data.completedRoadmapDayIds) ? data.completedRoadmapDayIds : [],
                lastModuleId: typeof data.lastModuleId === 'string' ? data.lastModuleId : COURSE_MODULES[0].id,
                theme: data.theme === 'light' ? 'light' : 'dark',
              });
            },
            (err) => handleFirestoreError(err, OperationType.GET, `users/${uid}`)
          )
        );

        // 2. Notes subcollection (strict userId filter matches security rule allow list)
        const notesQuery = query(collection(db, 'users', uid, 'notes'), where('userId', '==', uid));
        unsubscribers.push(
          onSnapshot(
            notesQuery,
            (snap) => {
              const loaded: StudyNote[] = snap.docs
                .map((d) => {
                  const data = d.data();
                  return {
                    id: d.id,
                    moduleId: String(data.moduleId || COURSE_MODULES[0].id),
                    timestampSeconds: Number(data.timestampSeconds) || 0,
                    timestampLabel: String(data.timestampLabel || '00:00'),
                    content: String(data.content || ''),
                    updatedAtIso:
                      data.updatedAt && typeof data.updatedAt.toDate === 'function'
                        ? data.updatedAt.toDate().toISOString()
                        : new Date().toISOString(),
                  };
                })
                .sort((a, b) => b.updatedAtIso.localeCompare(a.updatedAtIso));
              setNotes(loaded);
            },
            (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/notes`)
          )
        );

        // 3. Submissions subcollection
        const subQuery = query(
          collection(db, 'users', uid, 'submissions'),
          where('userId', '==', uid)
        );
        unsubscribers.push(
          onSnapshot(
            subQuery,
            (snap) => {
              const next: Record<string, SubmissionRecord> = {};
              for (const d of snap.docs) {
                const data = d.data();
                next[d.id] = {
                  code: String(data.code || ''),
                  passed: Boolean(data.passed),
                };
              }
              setSubmissions((prev) => ({ ...prev, ...next }));
            },
            (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/submissions`)
          )
        );

        // 4. Active roadmap subcollection
        const roadmapQuery = query(
          collection(db, 'users', uid, 'roadmaps'),
          where('userId', '==', uid)
        );
        unsubscribers.push(
          onSnapshot(
            roadmapQuery,
            (snap) => {
              if (snap.empty) return;
              const latest = snap.docs[0];
              const data = latest.data();
              setRoadmap({
                id: latest.id,
                title: String(data.title || 'Personalized Study Plan'),
                goal: String(data.goal || 'Full Course Mastery'),
                experienceLevel: String(data.experienceLevel || 'Complete Beginner'),
                dailyMinutes: Number(data.dailyMinutes) || 60,
                totalDays: Number(data.totalDays) || (Array.isArray(data.days) ? data.days.length : 0),
                summary: String(data.summary || ''),
                days: Array.isArray(data.days) ? data.days : [],
                generatedBy: 'ai',
                createdAtIso:
                  data.updatedAt && typeof data.updatedAt.toDate === 'function'
                    ? data.updatedAt.toDate().toISOString()
                    : new Date().toISOString(),
              });
            },
            (err) => handleFirestoreError(err, OperationType.LIST, `users/${uid}/roadmaps`)
          )
        );
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : 'Cloud sync error');
      }
    };

    void initSync();

    return () => {
      cancelled = true;
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, user?.uid, user?.emailVerified]);

  const persistProgressUpdate = useCallback(
    async (next: StudyProgressState) => {
      if (!user || !user.emailVerified) return;
      const uid = user.uid;
      const path = `users/${uid}`;
      try {
        await updateDoc(doc(db, 'users', uid), {
          completedModuleIds: sanitizeIdArray(next.completedModuleIds, 30),
          solvedProblemIds: sanitizeIdArray(next.solvedProblemIds, 50),
          masteredInterviewIds: sanitizeIdArray(next.masteredInterviewIds, 100),
          completedRoadmapDayIds: sanitizeIdArray(next.completedRoadmapDayIds, 60),
          lastModuleId: next.lastModuleId || COURSE_MODULES[0].id,
          theme: next.theme === 'light' ? 'light' : 'dark',
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    },
    [user]
  );

  const updateProgressState = useCallback(
    (updater: (prev: StudyProgressState) => StudyProgressState) => {
      setProgress((prev) => {
        const next = updater(prev);
        void persistProgressUpdate(next);
        return next;
      });
    },
    [persistProgressUpdate]
  );

  const signInWithGoogle = useCallback(async () => {
    setSyncError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Sign-in cancelled.');
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const toggleTheme = useCallback(() => {
    updateProgressState((prev) => ({
      ...prev,
      theme: (prev.theme === 'dark' ? 'light' : 'dark') as ThemeMode,
    }));
  }, [updateProgressState]);

  const setLastModuleId = useCallback(
    (moduleId: string) => {
      updateProgressState((prev) =>
        prev.lastModuleId === moduleId ? prev : { ...prev, lastModuleId: moduleId }
      );
    },
    [updateProgressState]
  );

  const toggleModuleComplete = useCallback(
    (moduleId: string) => {
      updateProgressState((prev) => {
        const exists = prev.completedModuleIds.includes(moduleId);
        const completedModuleIds = exists
          ? prev.completedModuleIds.filter((id) => id !== moduleId)
          : sanitizeIdArray([...prev.completedModuleIds, moduleId], 30);
        return { ...prev, completedModuleIds };
      });
    },
    [updateProgressState]
  );

  const saveProblemCode = useCallback(
    (problemId: string, code: string, passed: boolean) => {
      const safeCode = code.slice(0, 15000);
      setSubmissions((prev) => ({
        ...prev,
        [problemId]: { code: safeCode, passed: passed || prev[problemId]?.passed || false },
      }));

      if (user && user.emailVerified) {
        const uid = user.uid;
        const subRef = doc(db, 'users', uid, 'submissions', problemId);
        const docPath = `users/${uid}/submissions/${problemId}`;
        void (async () => {
          try {
            const snap = await getDoc(subRef);
            if (snap.exists()) {
              await updateDoc(subRef, {
                code: safeCode,
                passed: passed || Boolean(snap.data()?.passed),
                updatedAt: serverTimestamp(),
              });
            } else {
              await setDoc(subRef, {
                userId: uid,
                problemId,
                code: safeCode,
                passed,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, docPath);
          }
        })();
      }
    },
    [user]
  );

  const markProblemSolved = useCallback(
    (problemId: string, code: string, passed: boolean) => {
      saveProblemCode(problemId, code, passed);
      if (passed) {
        updateProgressState((prev) => {
          if (prev.solvedProblemIds.includes(problemId)) return prev;
          return {
            ...prev,
            solvedProblemIds: sanitizeIdArray([...prev.solvedProblemIds, problemId], 50),
          };
        });
      }
    },
    [saveProblemCode, updateProgressState]
  );

  const toggleInterviewMastered = useCallback(
    (questionId: string) => {
      updateProgressState((prev) => {
        const exists = prev.masteredInterviewIds.includes(questionId);
        const masteredInterviewIds = exists
          ? prev.masteredInterviewIds.filter((id) => id !== questionId)
          : sanitizeIdArray([...prev.masteredInterviewIds, questionId], 100);
        return { ...prev, masteredInterviewIds };
      });
    },
    [updateProgressState]
  );

  const toggleRoadmapDayComplete = useCallback(
    (dayId: string) => {
      updateProgressState((prev) => {
        const exists = prev.completedRoadmapDayIds.includes(dayId);
        const completedRoadmapDayIds = exists
          ? prev.completedRoadmapDayIds.filter((id) => id !== dayId)
          : sanitizeIdArray([...prev.completedRoadmapDayIds, dayId], 60);
        return { ...prev, completedRoadmapDayIds };
      });
    },
    [updateProgressState]
  );

  const addNote = useCallback(
    (moduleId: string, timestampSeconds: number, content: string) => {
      const cleaned = sanitizeNoteContent(content);
      if (!cleaned) return;
      const safeSeconds = Math.max(0, Math.min(20000, Math.floor(timestampSeconds)));
      const label = formatSecondsToTimestamp(safeSeconds);
      const noteId = `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      const newNote: StudyNote = {
        id: noteId,
        moduleId,
        timestampSeconds: safeSeconds,
        timestampLabel: label,
        content: cleaned,
        updatedAtIso: new Date().toISOString(),
      };

      setNotes((prev) => [newNote, ...prev]);

      if (user && user.emailVerified) {
        const uid = user.uid;
        const notePath = `users/${uid}/notes/${noteId}`;
        void (async () => {
          try {
            await setDoc(doc(db, 'users', uid, 'notes', noteId), {
              userId: uid,
              moduleId,
              timestampSeconds: safeSeconds,
              timestampLabel: label,
              content: cleaned,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, notePath);
          }
        })();
      }
    },
    [user]
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      if (user && user.emailVerified) {
        const uid = user.uid;
        const notePath = `users/${uid}/notes/${noteId}`;
        void (async () => {
          try {
            await deleteDoc(doc(db, 'users', uid, 'notes', noteId));
          } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, notePath);
          }
        })();
      }
    },
    [user]
  );

  const saveRoadmap = useCallback(
    (plan: PersonalizedRoadmap) => {
      setRoadmap(plan);
      updateProgressState((prev) => ({ ...prev, completedRoadmapDayIds: [] }));

      if (user && user.emailVerified) {
        const uid = user.uid;
        const roadmapDocId = 'active';
        const roadmapPath = `users/${uid}/roadmaps/${roadmapDocId}`;
        const ref = doc(db, 'users', uid, 'roadmaps', roadmapDocId);
        void (async () => {
          try {
            const snap = await getDoc(ref);
            const payload = {
              title: plan.title.slice(0, 160),
              goal: plan.goal.slice(0, 80),
              experienceLevel: plan.experienceLevel.slice(0, 64),
              dailyMinutes: Math.min(360, Math.max(15, plan.dailyMinutes)),
              totalDays: Math.min(90, Math.max(1, plan.totalDays)),
              summary: plan.summary.slice(0, 1000),
              days: plan.days.slice(0, 45),
              updatedAt: serverTimestamp(),
            };
            if (snap.exists()) {
              await updateDoc(ref, payload);
            } else {
              await setDoc(ref, {
                userId: uid,
                ...payload,
                createdAt: serverTimestamp(),
              });
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, roadmapPath);
          }
        })();
      }
    },
    [updateProgressState, user]
  );

  const value = useMemo<StudyContextValue>(
    () => ({
      user,
      authReady,
      syncError,
      progress,
      notes,
      submissions,
      roadmap,
      signInWithGoogle,
      signOutUser,
      toggleTheme,
      setLastModuleId,
      toggleModuleComplete,
      markProblemSolved,
      saveProblemCode,
      toggleInterviewMastered,
      toggleRoadmapDayComplete,
      addNote,
      deleteNote,
      saveRoadmap,
    }),
    [
      user,
      authReady,
      syncError,
      progress,
      notes,
      submissions,
      roadmap,
      signInWithGoogle,
      signOutUser,
      toggleTheme,
      setLastModuleId,
      toggleModuleComplete,
      markProblemSolved,
      saveProblemCode,
      toggleInterviewMastered,
      toggleRoadmapDayComplete,
      addNote,
      deleteNote,
      saveRoadmap,
    ]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error('useStudy must be used within StudyProvider');
  }
  return ctx;
}
