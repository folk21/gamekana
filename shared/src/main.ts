import { LEVELS, type Level } from '../../content/src/kana.js';
import { advanceQuiz, answerQuiz, createQuiz, isLevelUnlocked, quizPassed, quizScore, type Quiz } from '../../learning/src/game.js';
import { recordResult, type Progress } from '../../progress/src/progress.js';
import { loadProgress, saveProgress } from './persistence.js';

type Screen =
  | { kind: 'map' }
  | { kind: 'study'; level: Level; index: number; revealed: boolean }
  | { kind: 'quiz'; level: Level; quiz: Quiz; selection: string | null }
  | { kind: 'result'; level: Level; quiz: Quiz; pending: Progress | null; saved: boolean };

const app = document.getElementById('app');
if (!app) throw new Error('Application mount point is missing');
const root: HTMLElement = app;
let progress: Progress;
let screen: Screen = { kind: 'map' };
let errorMessage = '';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]!);
}

function levelNumber(level: Level): number {
  return LEVELS.indexOf(level) + 1;
}

function header(): string {
  const completed = progress.completedLevelIds.length;
  const percentage = Math.round(100 * completed / LEVELS.length);
  return `<header class="top-bar glass">
    <button class="logo-button" data-action="home" aria-label="Return to level map"><span class="logo-sun">✦</span> HIRAGANA <span class="logo-light">AERO</span></button>
    <div class="top-status"><span class="status-dot"></span> OFFLINE ADVENTURE <span class="status-separator">•</span> ${completed}/${LEVELS.length} LEVELS</div>
    <div class="meter" title="${percentage}% of levels completed"><span style="width:${percentage}%"></span></div>
  </header>`;
}

function mapView(): string {
  const completed = progress.completedLevelIds.length;
  const firstUnfinished = LEVELS.find((level) => isLevelUnlocked(level.id, progress.completedLevelIds) && !progress.completedLevelIds.includes(level.id));
  return `<section class="hero glass">
    <div class="hero-copy"><div class="eyebrow">✧ WELCOME TO YOUR JAPANESE ADVENTURE</div>
    <h1>Discover <em>Hiragana</em><span class="sparkle">✳</span></h1>
    <p>Explore ten dreamy worlds. Learn 46 characters, one small challenge at a time.</p>
    <div class="hero-actions">${firstUnfinished ? `<button class="pill primary" data-action="open" data-level="${firstUnfinished.id}">Continue adventure <span aria-hidden="true">→</span></button>` : `<span class="completion-text">All worlds completed. Replay any level!</span>`}
    <span class="hero-small">☁ No internet needed</span></div></div>
    <div class="hero-art" aria-hidden="true"><div class="hero-ring ring-back"></div><div class="hero-kana">あ</div><div class="hero-ring ring-front"></div><div class="mini-star star-1">✦</div><div class="mini-star star-2">✧</div></div>
  </section>
  <section class="level-area"><div class="section-head"><div><div class="eyebrow">WORLD SELECT</div><h2>Your journey <span class="muted">/ ${completed} of 10 cleared</span></h2></div><div class="map-hint">Finish a challenge with 80% to unlock the next world</div></div>
  <div class="level-grid">${LEVELS.map((level, index) => {
    const unlocked = isLevelUnlocked(level.id, progress.completedLevelIds);
    const finished = progress.completedLevelIds.includes(level.id);
    const status = finished ? '✓ CLEARED' : unlocked ? '● AVAILABLE' : 'LOCKED';
    return `<button class="level-card glass ${unlocked ? 'unlocked' : 'locked'} ${finished ? 'finished' : ''}" data-action="open" data-level="${level.id}" ${unlocked ? '' : 'disabled'} aria-label="Level ${index + 1}, ${level.title}, ${status}">
      <div class="level-top"><span class="level-number">WORLD ${String(index + 1).padStart(2, '0')}</span><span class="level-state">${status}</span></div>
      <div class="level-glyphs" lang="ja">${level.kana.map((kana) => kana.symbol).join(' ')}</div><div class="level-title">${level.title}</div><div class="level-foot"><span>${level.subtitle} · ${level.kana.length} characters</span><span>${unlocked ? '↗' : '🔒'}</span></div>
    </button>`;
  }).join('')}</div></section>`;
}

function studyView(state: Extract<Screen, { kind: 'study' }>): string {
  const { level, index, revealed } = state;
  const kana = level.kana[index]!;
  return `<section class="stage glass">
    <div class="stage-top"><button class="link-button" data-action="home">← Level map</button><span class="stage-pill">WORLD ${levelNumber(level)} / STUDY</span></div>
    <div class="eyebrow">MEET THE CHARACTERS</div><h1>${level.title}</h1><p class="stage-subtitle">Study each character, then take a five-question recognition challenge.</p>
    <div class="study-progress">${level.kana.map((_, i) => `<span class="${i <= index ? 'active' : ''}"></span>`).join('')}</div>
    <button class="flashcard" data-action="reveal" aria-label="${revealed ? 'Hide' : 'Show'} pronunciation for ${kana.symbol}">
      <span class="flash-label">CHARACTER ${index + 1} / ${level.kana.length}</span>
      <span class="flash-glyph" lang="ja">${kana.symbol}</span>
      <span class="flash-romaji">${revealed ? escapeHtml(kana.romaji.toUpperCase()) : 'Tap to reveal pronunciation'}</span>
    </button>
    <div class="stage-actions"><button class="pill secondary" data-action="previous" ${index === 0 ? 'disabled' : ''}>← Previous</button>
      <button class="pill primary" data-action="next">${index === level.kana.length - 1 ? 'Start challenge →' : 'Next character →'}</button></div>
    <p class="tiny-tip">Tip: use ← → arrows to navigate, or press Enter to flip the card.</p>
  </section>`;
}

function quizView(state: Extract<Screen, { kind: 'quiz' }>): string {
  const { level, quiz, selection } = state;
  const question = quiz.questions[quiz.cursor]!;
  const answered = quiz.answered;
  const isCorrect = selection === question.kana.romaji;
  return `<section class="stage glass quiz-stage"><div class="stage-top"><button class="link-button" data-action="home">← Level map</button><span class="stage-pill">WORLD ${levelNumber(level)} / CHALLENGE</span></div>
    <div class="eyebrow">CHARACTER RECOGNITION</div><h1>What sound is this?</h1><p class="stage-subtitle">Choose the correct romaji for the character below.</p>
    <div class="study-progress">${quiz.questions.map((_, i) => `<span class="${i <= quiz.cursor ? 'active' : ''}"></span>`).join('')}</div>
    <div class="question-glyph" lang="ja">${question.kana.symbol}</div><div class="question-number">QUESTION ${quiz.cursor + 1} OF ${quiz.questions.length}</div>
    <div class="answer-grid">${question.options.map((option, index) => {
      const variant = !answered ? '' : option === question.kana.romaji ? 'answer-correct' : option === selection ? 'answer-wrong' : 'answer-muted';
      return `<button class="answer ${variant}" data-action="answer" data-answer="${escapeHtml(option)}" ${answered ? 'disabled' : ''}><span class="keycap">${index + 1}</span> ${escapeHtml(option)}</button>`;
    }).join('')}</div>
    ${answered ? `<div class="answer-feedback ${isCorrect ? 'positive' : 'negative'}" role="status">${isCorrect ? '✦ Excellent! That is correct.' : `Not quite. The answer is ${escapeHtml(question.kana.romaji)}.`}</div><button class="pill primary continue" data-action="continue">${quiz.cursor === quiz.questions.length - 1 ? 'See results →' : 'Next question →'}</button>` : `<div class="quiz-help">Press 1–4 to choose an answer</div>`}
  </section>`;
}

function resultView(state: Extract<Screen, { kind: 'result' }>): string {
  const score = quizScore(state.quiz);
  const passed = quizPassed(state.quiz);
  return `<section class="stage glass result-stage"><div class="eyebrow">LEVEL REPORT</div><div class="result-icon">${passed ? '✦' : '↻'}</div>
    <h1>${passed ? 'World cleared!' : 'One more try?'}</h1><p class="stage-subtitle">${passed ? 'A new world is waiting for you.' : 'Practice these sounds and try the challenge again.'}</p>
    <div class="score-number">${score}<span>%</span></div><div class="score-sub">${state.quiz.correctCount} / ${state.quiz.questions.length} correct · 80% needed to pass</div>
    ${state.saved ? '<p class="save-status">✓ Progress saved locally</p>' : '<p class="save-status warning">Progress not yet saved</p>'}
    <div class="stage-actions"><button class="pill secondary" data-action="retry">Try again ↻</button><button class="pill primary" data-action="home">Return to map →</button></div>
  </section>`;
}

function render(): void {
  const view = screen.kind === 'map' ? mapView() : screen.kind === 'study' ? studyView(screen) : screen.kind === 'quiz' ? quizView(screen) : resultView(screen);
  root.innerHTML = `${header()}${errorMessage ? `<div class="error-notice" role="alert">${escapeHtml(errorMessage)}</div>` : ''}${view}<footer class="footer">HIRAGANA AERO ✳ VERSION 0.1 <span>made for curious minds · all progress stays on this device</span></footer>`;
}

async function completeQuiz(level: Level, quiz: Quiz): Promise<void> {
  const pending = recordResult(progress, level.id, quizScore(quiz));
  screen = { kind: 'result', level, quiz, pending, saved: false };
  render();
  try {
    await saveProgress(pending);
    progress = pending;
    if (screen.kind === 'result' && screen.quiz === quiz) {
      screen = { ...screen, saved: true, pending: null };
    }
    errorMessage = '';
  } catch (error) {
    errorMessage = `Unable to save progress: ${error instanceof Error ? error.message : 'unknown error'}. Try again before closing the app.`;
  }
  render();
}

async function handleAction(button: HTMLButtonElement): Promise<void> {
  const action = button.dataset.action;
  if (action === 'home') {
    if (screen.kind === 'result' && !screen.saved) {
      errorMessage = 'Save the result before leaving this screen.';
      render();
      return;
    }
    screen = { kind: 'map' }; errorMessage = ''; render(); return;
  }
  if (action === 'open') {
    const level = LEVELS.find((item) => item.id === button.dataset.level);
    if (level && isLevelUnlocked(level.id, progress.completedLevelIds)) {
      screen = { kind: 'study', level, index: 0, revealed: false };
      render();
    }
    return;
  }
  if (screen.kind === 'study') {
    if (action === 'reveal') screen = { ...screen, revealed: !screen.revealed };
    else if (action === 'previous' && screen.index > 0) screen = { ...screen, index: screen.index - 1, revealed: false };
    else if (action === 'next') {
      screen = screen.index === screen.level.kana.length - 1
        ? { kind: 'quiz', level: screen.level, quiz: createQuiz(screen.level), selection: null }
        : { ...screen, index: screen.index + 1, revealed: false };
    }
    render(); return;
  }
  if (screen.kind === 'quiz') {
    if (action === 'answer' && !screen.quiz.answered) {
      const selection = button.dataset.answer;
      if (selection) {
        screen = { ...screen, quiz: answerQuiz(screen.quiz, selection).quiz, selection };
        render();
        root.querySelector<HTMLButtonElement>('[data-action="continue"]')?.focus();
      }
      return;
    }
    if (action === 'continue' && screen.quiz.answered) {
      const { level, quiz } = screen;
      if (quiz.cursor === quiz.questions.length - 1) await completeQuiz(level, quiz);
      else {
        screen = { kind: 'quiz', level, quiz: advanceQuiz(quiz), selection: null };
        render();
      }
      return;
    }
  }
  if (screen.kind === 'result' && action === 'retry') {
    if (!screen.saved) {
      const pending = screen.pending;
      if (pending) {
        try {
          await saveProgress(pending);
          progress = pending;
          errorMessage = '';
        } catch (error) {
          errorMessage = `Unable to save progress: ${error instanceof Error ? error.message : 'unknown error'}`;
          render();
          return;
        }
      }
    }
    screen = { kind: 'study', level: screen.level, index: 0, revealed: false };
    render();
  }
}

root.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>('button[data-action]');
  if (button && !button.disabled) void handleAction(button);
});

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  if (event.key === 'Escape' && screen.kind !== 'map') {
    event.preventDefault();
    root.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    return;
  }
  if (screen.kind === 'quiz' && !screen.quiz.answered && /^[1-4]$/.test(event.key)) {
    event.preventDefault();
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-action="answer"]');
    buttons[Number(event.key) - 1]?.click();
  } else if (screen.kind === 'quiz' && screen.quiz.answered && event.key === 'Enter') {
    root.querySelector<HTMLButtonElement>('[data-action="continue"]')?.click();
  } else if (screen.kind === 'study' && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
    event.preventDefault();
    root.querySelector<HTMLButtonElement>(event.key === 'ArrowRight' ? '[data-action="next"]' : '[data-action="previous"]')?.click();
  }
});

try {
  progress = await loadProgress();
  render();
} catch (error) {
  root.innerHTML = `<div class="fatal glass" role="alert"><h1>Unable to open your progress</h1><p>${escapeHtml(error instanceof Error ? error.message : String(error))}</p><p>The app has not overwritten your saved data. Please inspect or back up the progress file before retrying.</p></div>`;
}
