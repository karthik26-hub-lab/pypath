import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';
import { COURSE_MODULES } from './src/data/courseData.ts';
import { DSA_PROBLEMS } from './src/data/dsaProblems.ts';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Add your key in the Settings > Secrets panel to enable AI assistance.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const DISALLOWED_PYTHON_PATTERNS = [
  /\bimport\s+(os|sys|subprocess|socket|shutil|pathlib|urllib|http|ctypes|multiprocessing|signal|pty|fcntl)\b/,
  /\bfrom\s+(os|sys|subprocess|socket|shutil|pathlib|urllib|http|ctypes|multiprocessing|signal|pty|fcntl)\b/,
  /\b(__import__|eval|exec|compile|open|breakpoint)\s*\(/,
];

function validatePythonSandboxCode(code: string): string | null {
  if (typeof code !== 'string' || code.trim().length === 0) {
    return 'Please write Python code before running.';
  }
  if (code.length > 15000) {
    return 'Code exceeds the 15,000-character execution limit.';
  }
  for (const pattern of DISALLOWED_PYTHON_PATTERNS) {
    if (pattern.test(code)) {
      return 'Restricted system or I/O call detected. Use pure Python standard data structures (math, collections, itertools, heapq, re, json) in the practice sandbox.';
    }
  }
  return null;
}

async function runPythonInSandbox(
  code: string,
  testCases: Array<{ name: string; callExpression: string; expectedJson: string }>
) {
  const validationError = validatePythonSandboxCode(code);
  if (validationError) {
    return {
      passed: false,
      stdout: '',
      stderr: validationError,
      executionMs: 0,
      results: testCases.map((tc) => ({
        name: tc.name,
        passed: false,
        expected: tc.expectedJson,
        actual: 'Blocked',
        error: validationError,
      })),
    };
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pypath-run-'));
  const runnerPath = path.join(tmpDir, 'runner.py');

  const harness = `
import io
import json
import contextlib
import traceback

USER_CODE = ${JSON.stringify(code)}
TEST_CASES = ${JSON.stringify(testCases)}

stdout_capture = io.StringIO()
namespace = {}
results = []
stderr_text = ""

try:
    with contextlib.redirect_stdout(stdout_capture):
        exec(compile(USER_CODE, "solution.py", "exec"), namespace)
except Exception:
    stderr_text = traceback.format_exc()

if stderr_text:
    for tc in TEST_CASES:
        results.append({
            "name": tc["name"],
            "passed": False,
            "expected": tc["expectedJson"],
            "actual": "Runtime Error",
            "error": stderr_text.strip().splitlines()[-1] if stderr_text.strip() else "Execution failed"
        })
else:
    for tc in TEST_CASES:
        try:
            with contextlib.redirect_stdout(stdout_capture):
                actual_val = eval(tc["callExpression"], namespace)
            expected_val = json.loads(tc["expectedJson"])
            passed = actual_val == expected_val
            try:
                actual_json = json.dumps(actual_val)
            except TypeError:
                actual_json = repr(actual_val)
            results.append({
                "name": tc["name"],
                "passed": bool(passed),
                "expected": tc["expectedJson"],
                "actual": actual_json,
            })
        except Exception as exc:
            results.append({
                "name": tc["name"],
                "passed": False,
                "expected": tc["expectedJson"],
                "actual": "Exception",
                "error": f"{type(exc).__name__}: {exc}",
            })

all_passed = (not stderr_text) and (len(results) == 0 or all(r["passed"] for r in results))
payload = {
    "passed": all_passed,
    "stdout": stdout_capture.getvalue()[:8000],
    "stderr": stderr_text[:8000],
    "results": results,
}
print("__PYPATH_RESULT__" + json.dumps(payload))
`;

  const start = Date.now();
  try {
    await fs.writeFile(runnerPath, harness, 'utf8');
    const { stdout, stderr } = await execFileAsync('python3', ['-I', runnerPath], {
      cwd: tmpDir,
      timeout: 3000,
      maxBuffer: 256 * 1024,
      env: { PATH: process.env.PATH ?? '/usr/bin:/bin', PYTHONDONTWRITEBYTECODE: '1' },
    });
    const executionMs = Date.now() - start;
    const marker = '__PYPATH_RESULT__';
    const markerIdx = stdout.lastIndexOf(marker);
    if (markerIdx === -1) {
      return {
        passed: false,
        stdout: stdout.slice(0, 4000),
        stderr: stderr || 'Python runner did not produce a structured output.',
        executionMs,
        results: [],
      };
    }
    const parsed = JSON.parse(stdout.slice(markerIdx + marker.length));
    return {
      ...parsed,
      executionMs,
    };
  } catch (err: unknown) {
    const executionMs = Date.now() - start;
    const errorObj = err as { killed?: boolean; signal?: string; stderr?: string; message?: string };
    const isTimeout = errorObj?.killed || errorObj?.signal === 'SIGTERM';
    const errMsg = isTimeout
      ? 'Execution timed out after 3 seconds. Check for an infinite loop.'
      : (errorObj?.stderr || errorObj?.message || 'Python execution failed.');
    return {
      passed: false,
      stdout: '',
      stderr: errMsg,
      executionMs,
      results: testCases.map((tc) => ({
        name: tc.name,
        passed: false,
        expected: tc.expectedJson,
        actual: isTimeout ? 'Timeout' : 'Error',
        error: errMsg,
      })),
    };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  // 1. Real Python Sandbox & DSA Test Runner
  app.post('/api/python/run', async (req, res) => {
    try {
      const { code, problemId } = req.body as { code?: string; problemId?: string };
      if (typeof code !== 'string') {
        res.status(400).json({ error: 'Missing Python code string.' });
        return;
      }

      const problem = problemId ? DSA_PROBLEMS.find((p) => p.id === problemId) : undefined;
      const testCases = problem ? problem.testCases : [];
      const result = await runPythonInSandbox(code, testCases);
      res.json(result);
    } catch (error) {
      console.error('Python execution error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to execute Python code.',
      });
    }
  });

  // 2. Real-Time AI Python Code Debugging Assistant
  app.post('/api/ai/debug', async (req, res) => {
    try {
      const { code, stderr, testResults, problemId, question } = req.body as {
        code?: string;
        stderr?: string;
        testResults?: Array<{ name: string; passed: boolean; expected: string; actual: string; error?: string }>;
        problemId?: string;
        question?: string;
      };

      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Provide Python code to debug.' });
        return;
      }

      const problem = problemId ? DSA_PROBLEMS.find((p) => p.id === problemId) : undefined;
      const ai = getGeminiClient();

      const prompt = [
        'You are a concise, encouraging senior Python & AI engineering mentor.',
        'Diagnose the student’s Python code bug clearly without lecturing. Point out the exact line or logic flaw, explain the mental model, and supply a clean fixed version.',
        problem
          ? `Problem: ${problem.title}\nSpecification: ${problem.description}\nExpected function: ${problem.functionName}`
          : 'Context: Freeform Python practice script.',
        `Student Code:\n\`\`\`python\n${code.slice(0, 8000)}\n\`\`\``,
        stderr ? `Traceback / Stderr:\n${stderr.slice(0, 3000)}` : '',
        testResults && testResults.length > 0
          ? `Test Results:\n${JSON.stringify(testResults.slice(0, 8), null, 2)}`
          : '',
        question ? `Student Question: ${question.slice(0, 500)}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'One-sentence diagnosis of what is wrong or how to improve the code.',
              },
              rootCause: {
                type: Type.STRING,
                description: 'Clear 2-3 sentence explanation of the root cause of the bug or failing edge case.',
              },
              lineHints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 concrete line-level hints or fixes.',
              },
              conceptualTip: {
                type: Type.STRING,
                description: 'One high-retention Python principle or interview takeaway.',
              },
              fixedCode: {
                type: Type.STRING,
                description: 'Complete corrected Python code ready to run.',
              },
            },
            required: ['summary', 'rootCause', 'lineHints', 'conceptualTip', 'fixedCode'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error) {
      console.error('AI debug error:', error);
      res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to reach AI debugging assistant right now.',
      });
    }
  });

  // 3. Personalized Spaced-Repetition Roadmap Generator
  app.post('/api/ai/roadmap', async (req, res) => {
    try {
      const {
        experienceLevel,
        dailyMinutes,
        goal,
        completedModuleIds = [],
        solvedProblemIds = [],
        focusTopicIds = [],
      } = req.body as {
        experienceLevel?: string;
        dailyMinutes?: number;
        goal?: string;
        completedModuleIds?: string[];
        solvedProblemIds?: string[];
        focusTopicIds?: string[];
      };

      const ai = getGeminiClient();
      const catalogSummary = COURSE_MODULES.map((m) => ({
        id: m.id,
        title: m.title,
        phase: m.phaseTitle,
        durationMinutes: m.durationMinutes,
        linkedDsaIds: m.linkedDsaIds,
      }));
      const dsaCatalog = DSA_PROBLEMS.map((p) => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        pattern: p.pattern,
      }));

      const prompt = `Create a personalized spaced-repetition study roadmap for the 5-hour "Python for AI" YouTube course.
Learner Profile:
- Experience Level: ${experienceLevel || 'Complete Beginner'}
- Daily Study Budget: ${dailyMinutes || 60} minutes/day
- Primary Goal: ${goal || 'Full Course Mastery'}
- Already Completed Module IDs: ${JSON.stringify(completedModuleIds)}
- Already Solved DSA IDs: ${JSON.stringify(solvedProblemIds)}
- Requested Focus Module IDs: ${JSON.stringify(focusTopicIds)}

Valid Module Catalog (ONLY use IDs from this exact list):
${JSON.stringify(catalogSummary)}

Valid DSA Problem Catalog (ONLY use IDs from this exact list):
${JSON.stringify(dsaCatalog)}

Design a realistic 5 to 14 day plan matching the daily minute budget.
Rules:
1. Prioritize incomplete modules and focus topics in logical prerequisite order.
2. Interleave "Learn" days with "Spaced Review" active-recall checkpoints (Day 1 / Day 3 / Day 7 retention spacing) and finish with a "Capstone" day.
3. Only reference valid moduleIds and dsaIds from the catalogs above.
4. Keep retention tips actionable and concise.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    focusType: { type: Type.STRING },
                    estimatedMinutes: { type: Type.INTEGER },
                    moduleIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                    dsaIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                    retentionTip: { type: Type.STRING },
                    checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: [
                    'dayNumber',
                    'title',
                    'focusType',
                    'estimatedMinutes',
                    'moduleIds',
                    'dsaIds',
                    'retentionTip',
                    'checklist',
                  ],
                },
              },
            },
            required: ['title', 'summary', 'days'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      const validModuleSet = new Set(COURSE_MODULES.map((m) => m.id));
      const validDsaSet = new Set(DSA_PROBLEMS.map((p) => p.id));

      const normalizedDays = (Array.isArray(parsed.days) ? parsed.days : [])
        .slice(0, 30)
        .map((day: Record<string, unknown>, idx: number) => {
          const rawFocus = String(day.focusType || 'Learn');
          const focusType =
            rawFocus === 'Spaced Review' || rawFocus === 'Practice' || rawFocus === 'Capstone'
              ? rawFocus
              : 'Learn';
          return {
            id: `day-${idx + 1}`,
            dayNumber: Number(day.dayNumber) || idx + 1,
            title: String(day.title || `Study Session ${idx + 1}`).slice(0, 120),
            focusType,
            estimatedMinutes: Math.min(240, Math.max(15, Number(day.estimatedMinutes) || dailyMinutes || 60)),
            moduleIds: (Array.isArray(day.moduleIds) ? day.moduleIds : [])
              .map(String)
              .filter((id) => validModuleSet.has(id)),
            dsaIds: (Array.isArray(day.dsaIds) ? day.dsaIds : [])
              .map(String)
              .filter((id) => validDsaSet.has(id)),
            retentionTip: String(day.retentionTip || 'Summarize key takeaways in your own words.').slice(0, 320),
            checklist: (Array.isArray(day.checklist) ? day.checklist : [])
              .map((item) => String(item).slice(0, 180))
              .slice(0, 6),
          };
        });

      res.json({
        id: `roadmap-${Date.now()}`,
        title: String(parsed.title || 'Personalized Python for AI Plan').slice(0, 160),
        goal: String(goal || 'Full Course Mastery').slice(0, 80),
        experienceLevel: String(experienceLevel || 'Complete Beginner').slice(0, 64),
        dailyMinutes: Math.min(240, Math.max(15, Number(dailyMinutes) || 60)),
        totalDays: normalizedDays.length,
        summary: String(parsed.summary || '').slice(0, 1000),
        days: normalizedDays,
        generatedBy: 'ai',
        createdAtIso: new Date().toISOString(),
      });
    } catch (error) {
      console.error('AI roadmap error:', error);
      res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to generate AI roadmap right now.',
      });
    }
  });

  // 4. End-of-Topic Interview Answer Evaluator
  app.post('/api/ai/evaluate-interview', async (req, res) => {
    try {
      const { question, modelAnswer, userAnswer } = req.body as {
        question?: string;
        modelAnswer?: string;
        userAnswer?: string;
      };

      if (!question || !userAnswer || userAnswer.trim().length < 5) {
        res.status(400).json({ error: 'Write a brief answer before requesting feedback.' });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Evaluate this technical Python interview answer concisely and constructively.
Interview Question: ${question}
Reference Answer: ${modelAnswer || ''}
Candidate Answer: ${userAnswer.slice(0, 2000)}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING, description: 'One of: Strong, Developing, Needs Review' },
              scoreOutOf5: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvedAnswer: { type: Type.STRING },
            },
            required: ['verdict', 'scoreOutOf5', 'strengths', 'missingConcepts', 'improvedAnswer'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error) {
      console.error('AI interview evaluate error:', error);
      res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to evaluate interview answer right now.',
      });
    }
  });

  // 5. Server-Side Text-to-Speech Narration (gemini-3.8-flash-lite-tts)
  app.post('/api/ai/tts', async (req, res) => {
    try {
      const { text, style, voiceName } = req.body as {
        text?: string;
        style?: string;
        voiceName?: string;
      };
      if (!text || text.trim().length < 2 || text.length > 2000) {
        res.status(400).json({ error: 'Provide narration text between 2 and 2000 characters.' });
        return;
      }

      const allowedVoices = new Set(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']);
      const selectedVoice = voiceName && allowedVoices.has(voiceName) ? voiceName : 'Charon';

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(502).json({ error: 'GEMINI_API_KEY is not configured.' });
        return;
      }
      const ttsClient = new GoogleGenAI({
        apiKey,
        apiVersion: 'v1beta',
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const response = await ttsClient.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: text.trim() }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        res.status(502).json({ error: 'No audio returned from TTS model.' });
        return;
      }

      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } catch (error) {
      console.error('AI TTS error:', error);
      res.status(502).json({
        error: error instanceof Error ? error.message : 'Unable to synthesize speech.',
      });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', python: 'python3' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PyPath server listening on http://localhost:${PORT}`);
  });
}

createServer();
