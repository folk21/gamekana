import { ALL_KANA, LEVELS, type Kana, type Level } from '../../content/src/kana.js';

export interface Question {
  readonly kana: Kana;
  readonly options: readonly string[];
}

export interface Quiz {
  readonly levelId: string;
  readonly questions: readonly Question[];
  readonly cursor: number;
  readonly correctCount: number;
  readonly answered: boolean;
}

export interface AnswerResult {
  readonly quiz: Quiz;
  readonly correct: boolean;
}

export const PASS_PERCENT = 80;

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap]!, copy[index]!];
  }
  return copy;
}

export function createQuiz(level: Level, random: () => number = Math.random): Quiz {
  const questions = shuffle(level.kana, random).map((kana) => {
    const distractors = shuffle(ALL_KANA.filter((item) => item.romaji !== kana.romaji), random)
      .slice(0, 3).map((item) => item.romaji);
    return { kana, options: shuffle([kana.romaji, ...distractors], random) };
  });
  return { levelId: level.id, questions, cursor: 0, correctCount: 0, answered: false };
}

export function answerQuiz(quiz: Quiz, selection: string): AnswerResult {
  const question = quiz.questions[quiz.cursor];
  if (!question || quiz.answered) {
    throw new Error('No unanswered question is available');
  }
  if (!question.options.includes(selection)) {
    throw new Error('The selected answer does not belong to the current question');
  }
  const correct = selection === question.kana.romaji;
  return {
    correct,
    quiz: { ...quiz, correctCount: quiz.correctCount + Number(correct), answered: true }
  };
}

export function advanceQuiz(quiz: Quiz): Quiz {
  if (!quiz.answered || quiz.cursor >= quiz.questions.length - 1) {
    throw new Error('Cannot advance the quiz');
  }
  return { ...quiz, cursor: quiz.cursor + 1, answered: false };
}

export function quizScore(quiz: Quiz): number {
  return quiz.questions.length === 0 ? 0 : Math.round(100 * quiz.correctCount / quiz.questions.length);
}

export function quizPassed(quiz: Quiz): boolean {
  return quiz.answered && quiz.cursor === quiz.questions.length - 1 && quizScore(quiz) >= PASS_PERCENT;
}

export function isLevelUnlocked(levelId: string, completedLevelIds: readonly string[]): boolean {
  const index = LEVELS.findIndex((level) => level.id === levelId);
  if (index < 0) return false;
  return index === 0 || completedLevelIds.includes(LEVELS[index - 1]!.id);
}
