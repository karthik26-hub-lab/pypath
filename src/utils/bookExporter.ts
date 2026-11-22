import { COURSE_METADATA } from '../data/courseData';
import { CHAPTER_STORIES } from '../data/storyContent';
import { getTopicInfographicSvg } from '../components/TopicInfographic';
import type { CourseModule, StudyNote } from '../types/course';
import { formatSecondsToTimestamp } from './studyLogic';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderChapterSheetHtml(mod: CourseModule, userNotes: StudyNote[]): string {
  const story = CHAPTER_STORIES[mod.id];
  const svg = getTopicInfographicSvg(mod.id, false);
  const bullets = story?.handwrittenBullets ?? mod.transcript.map((t) => t.takeaway);
  const quote = mod.excerpts[0];
  const caseStudy = mod.caseStudies[0];

  return `
    <section class="sheet">
      <div class="sheet-meta">
        <span>${escapeHtml(mod.phaseTitle)}</span>
        <span>·</span>
        <span>${formatSecondsToTimestamp(mod.startSeconds)} – ${formatSecondsToTimestamp(mod.endSeconds)} (${mod.durationMinutes} min)</span>
      </div>
      <h2 class="hand-title">${escapeHtml(mod.title)}</h2>
      ${story ? `<p class="story-hook">${escapeHtml(story.storyHook)}</p>` : ''}

      <div class="visual-box">
        ${svg}
        ${story ? `<div class="visual-caption">${escapeHtml(story.visualCaption)}</div>` : ''}
      </div>

      <div class="hand-notes-area">
        <div class="hand-heading">Key Mental Models</div>
        <ul class="hand-list">
          ${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>

        ${
          quote
            ? `<div class="quote-callout">
                <div class="quote-label">Key Moment · ${escapeHtml(quote.timestampLabel)}</div>
                <div class="quote-text">“${escapeHtml(quote.quote)}”</div>
              </div>`
            : ''
        }

        ${
          caseStudy
            ? `<div class="code-box">
                <div class="code-label">Pattern in Practice · ${escapeHtml(caseStudy.title)}</div>
                <pre><code>${escapeHtml(caseStudy.codeSnippet)}</code></pre>
              </div>`
            : ''
        }

        ${
          userNotes.length > 0
            ? `<div class="personal-notes">
                <div class="hand-heading">My Handwritten Margin Notes</div>
                <ul class="hand-list">
                  ${userNotes
                    .map(
                      (n) =>
                        `<li><span class="ts">[${escapeHtml(n.timestampLabel)}]</span> ${escapeHtml(
                          n.content
                        )}</li>`
                    )
                    .join('')}
                </ul>
              </div>`
            : ''
        }

        ${
          story?.marginDoodleNote
            ? `<div class="margin-tip">★ ${escapeHtml(story.marginDoodleNote)}</div>`
            : ''
        }
      </div>
    </section>
  `;
}

export function buildVisualNotebookHtml(
  modules: CourseModule[],
  notes: StudyNote[],
  bookTitle: string
): string {
  const isFullBook = modules.length > 1;
  const chaptersHtml = modules
    .map((m) => renderChapterSheetHtml(m, notes.filter((n) => n.moduleId === m.id)))
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(bookTitle)} — PyPath Visual Handbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px 20px 64px;
      background: #f1f5f9;
      color: #0f172a;
      font-family: 'DM Sans', system-ui, sans-serif;
    }
    .toolbar {
      max-width: 820px;
      margin: 0 auto 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 18px;
    }
    .toolbar button {
      background: #0f172a;
      color: #ffffff;
      border: 0;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .cover {
      max-width: 820px;
      margin: 0 auto 32px;
      background: #fcfaf4;
      border: 1px solid #e2dfd5;
      border-radius: 16px;
      padding: 48px 56px;
      page-break-after: always;
    }
    .cover-kicker { font-size: 12px; color: #64748b; margin-bottom: 10px; }
    .cover h1 { font-family: 'Caveat', cursive; font-size: 52px; margin: 0 0 12px; line-height: 1.05; }
    .cover p { font-size: 15px; color: #475569; line-height: 1.6; max-width: 560px; }
    .sheet {
      max-width: 820px;
      margin: 0 auto 32px;
      padding: 34px 40px 40px 68px;
      border-radius: 14px;
      border: 1px solid #e2dfd5;
      background-color: #fcfaf4;
      background-image:
        linear-gradient(90deg, transparent 48px, rgba(225, 96, 114, 0.35) 48px, rgba(225, 96, 114, 0.35) 49.5px, transparent 49.5px),
        repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(100, 149, 210, 0.22) 31px, rgba(100, 149, 210, 0.22) 32px);
      background-position: 0 0, 0 22px;
      page-break-after: always;
    }
    .sheet-meta { display: flex; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 6px; }
    .hand-title {
      font-family: 'Caveat', cursive;
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 6px;
      line-height: 1.1;
      color: #0f172a;
    }
    .story-hook {
      font-size: 13.5px;
      color: #475569;
      margin: 0 0 18px;
      line-height: 1.5;
    }
    .visual-box {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 20px;
    }
    .visual-caption {
      text-align: center;
      font-size: 12px;
      color: #64748b;
      margin-top: 8px;
    }
    .hand-heading {
      font-family: 'Caveat', cursive;
      font-size: 24px;
      font-weight: 700;
      color: #1d4ed8;
      margin: 12px 0 4px;
    }
    .hand-list {
      margin: 0 0 16px;
      padding-left: 20px;
      font-family: 'Caveat', cursive;
      font-size: 22px;
      line-height: 32px;
      color: #1e293b;
    }
    .quote-callout {
      margin: 14px 0;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.78);
      border: 1px solid #cbd5e1;
      border-radius: 10px;
    }
    .quote-label { font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
    .quote-text { font-family: 'Caveat', cursive; font-size: 23px; color: #0f172a; line-height: 1.25; }
    .code-box {
      margin: 16px 0;
      background: #0f172a;
      color: #f8fafc;
      border-radius: 10px;
      padding: 12px 16px;
    }
    .code-label { font-size: 11px; color: #94a3b8; margin-bottom: 6px; }
    pre { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; white-space: pre-wrap; }
    .ts { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #2563eb; }
    .margin-tip {
      margin-top: 12px;
      font-family: 'Caveat', cursive;
      font-size: 22px;
      font-weight: 700;
      color: #059669;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .toolbar { display: none; }
      .sheet, .cover { margin: 0 auto; border: none; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>${escapeHtml(bookTitle)}</strong> · ${modules.length} Visual Chapter Sheet${modules.length > 1 ? 's' : ''}</div>
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>
  ${
    isFullBook
      ? `<div class="cover">
          <div class="cover-kicker">${escapeHtml(COURSE_METADATA.title)} · ${escapeHtml(
            COURSE_METADATA.instructor
          )} · ${escapeHtml(COURSE_METADATA.totalDurationLabel)}</div>
          <h1>Python for AI — Visual Field Notebook</h1>
          <p>A concise, infographic-first illustrated guide distilled from the full 5-hour course—combining visual mental models, ruled handwritten notes, real-world code snippets, and your personal timestamped annotations.</p>
        </div>`
      : ''
  }
  ${chaptersHtml}
</body>
</html>`;
}

export function triggerHtmlFileDownload(filename: string, htmlContent: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
