# PyPath — Python for AI Study Studio

Turn a 5-hour Python tutorial into an interactive, distraction-free study studio with simultaneous handwritten notes, an illustrated downloadable Visual Field Book, a real Python 3.11 DSA sandbox, and XP progression.

Built around Dave Ebbelaar’s full beginner course: **[Python for AI — Full Beginner Course](https://www.youtube.com/watch?v=ygXn5nV5qFc)**.

---

## Why This Curriculum?

Most learners get stuck in passive video playback or memorize syntax that never shows up in real AI engineering. PyPath structures the full 4h 58m course into **13 focused chapters across 4 phases** covering what modern AI teams actually use day-to-day:

- **Modern Tooling:** VS Code, isolated virtual environments (`venv`), `pip`/`uv`, and clean project layout
- **Data Flow & JSON Payloads:** Dictionaries, lists, sets, tuples, and structured schemas behind every LLM request
- **Resilient APIs:** HTTP requests, targeted `try/except` error guards, rate limits, and `.env` secret hygiene
- **Clean Pipelines:** Modular functions, `@dataclass` models, reusable helpers, and Git fundamentals

---

## Features

| Feature | Works Without API Key? |
| --- | :---: |
| **13 Guided Video Chapters** with chapter-synced YouTube timestamps | Yes |
| **Simultaneous Study Companion** (Handwritten Key Points, Copyable Code, Synced Transcript, Live Timestamped Notes) | Yes |
| **Illustrated Visual Field Book** — Ruled handwritten notes + custom concept SVG diagrams, downloadable per topic or as a complete `.html` / printable PDF book | Yes |
| **Python 3.11 DSA Practice Lab** — Real server-side Python execution with automated unit test suites | Yes |
| **Local Spaced-Repetition Roadmap** — Rule-based Day 1 / Day 3 / Day 7 study scheduler | Yes |
| **Warm Obsidian & Editorial Paper Themes** + XP milestones, badges, and streak tracking | Yes |
| **AI Code Debugger** — Line-by-line bug diagnosis, complexity feedback, and fix suggestions | Requires `GEMINI_API_KEY` |
| **AI Personalized Roadmap** — Custom multi-day study schedule tailored to your experience & daily budget | Requires `GEMINI_API_KEY` |
| **AI Interview Evaluator** — Instant rubric feedback on end-of-chapter technical answers | Requires `GEMINI_API_KEY` |

---

## Quick Start (Clone & Run Locally)

### 1. Prerequisites
- **Node.js 20+** (`node -v`)
- **Python 3.10+** available as `python3` (`python3 --version`) — used by the local DSA test runner
- *(Optional)* A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey) to unlock AI Mode

### 2. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### 3. Configure Environment Variables (Optional — for AI Mode)
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` and add your own Gemini API key (and optionally choose a model):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-2.5-flash"
PORT=3000
```

> **Security note:** `.env` is ignored by `.gitignore` so your personal API key is never committed to GitHub. All AI requests run through server-side Express routes (`/api/ai/*`)—your key is never sent to the browser.

### 4. Start the Studio
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Production Build

```bash
npm run build
NODE_ENV=production npm start
```

---

## Optional: Cloud Sync with Your Own Firebase Project

Out of the box, PyPath saves your completed chapters, notes, solved drills, and XP locally in your browser.

If you want cross-device Google Sign-In & Firestore sync on your own Firebase project:
1. Create a Firebase project with **Authentication (Google Sign-In)** and **Cloud Firestore** enabled.
2. Replace `firebase-applet-config.json` with your Firebase Web App config (`apiKey`, `authDomain`, `projectId`, `firestoreDatabaseId`, etc.).
3. Deploy the included security rules (`firestore.rules`) to your Firebase project:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## Project Structure

```text
├── server.ts                  # Express server, Python 3.11 sandbox runner, & /api/ai/* routes
├── src/
│   ├── components/            # ChaptersHomeView, StudyStudio, VisualBookView, DsaLabView, RoadmapView
│   ├── context/               # StudyContext (state, XP/badges, localStorage + Firestore sync)
│   ├── data/                  # 13 course chapters, story takeaways, & DSA problem suites
│   ├── lib/                   # Firebase client initialization
│   └── utils/                 # Visual book HTML/PDF exporter & spaced-repetition logic
├── firestore.rules            # Least-privilege Firestore security rules
├── .env.example               # Environment variable template
└── package.json
```

---

## Available Scripts

- `npm run dev` — Run Express backend + Vite frontend on `http://localhost:3000`
- `npm run build` — Build production client bundle to `dist/`
- `npm start` — Start production Express server (`server.ts`)
- `npm run lint` — Type-check with TypeScript (`tsc --noEmit`)

---

## Course Credit

All curriculum structure and video timestamps are built around Dave Ebbelaar’s free YouTube course:
**[Python for AI — Full Beginner Course](https://www.youtube.com/watch?v=ygXn5nV5qFc)**.
