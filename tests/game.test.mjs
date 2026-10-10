import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_KANA, LEVELS } from '../dist/content/src/kana.js';
import { answerQuiz, advanceQuiz, createQuiz, isLevelUnlocked, quizPassed, quizScore } from '../dist/learning/src/game.js';
import { emptyProgress, parseProgress, recordResult } from '../dist/progress/src/progress.js';

test('catalog contains all 46 distinct basic hiragana in ten sequential worlds', () => {
  assert.equal(LEVELS.length, 10);
  assert.equal(ALL_KANA.length, 46);
  assert.equal(new Set(ALL_KANA.map(({ symbol }) => symbol)).size, 46);
  assert.equal(new Set(ALL_KANA.map(({ romaji }) => romaji)).size, 46);
  assert.deepEqual(LEVELS.map(({ kana }) => kana.length), [5,5,5,5,5,5,5,3,5,3]);
});

test('a quiz asks each level character exactly once with four distinct choices', () => {
  const quiz = createQuiz(LEVELS[0], () => 0.42);
  assert.deepEqual(new Set(quiz.questions.map(({ kana }) => kana.symbol)), new Set(LEVELS[0].kana.map(({ symbol }) => symbol)));
  quiz.questions.forEach(({ kana, options }) => {
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4);
    assert.ok(options.includes(kana.romaji));
  });
});

test('quiz permits one answer per question and requires acknowledgement to advance', () => {
  let quiz = createQuiz(LEVELS[0], () => 0.24);
  assert.throws(() => advanceQuiz(quiz));
  const expected = quiz.questions[0].kana.romaji;
  const answered = answerQuiz(quiz, expected);
  assert.equal(answered.correct, true);
  assert.equal(answered.quiz.correctCount, 1);
  assert.throws(() => answerQuiz(answered.quiz, expected));
  assert.throws(() => answerQuiz(quiz, 'invalid-option'));
  quiz = advanceQuiz(answered.quiz);
  assert.equal(quiz.cursor, 1);
  assert.equal(quiz.answered, false);
});

test('four of five correct passes and unlocks the next world only', () => {
  let quiz = createQuiz(LEVELS[0], () => 0.18);
  for (let index = 0; index < quiz.questions.length; index++) {
    const question = quiz.questions[quiz.cursor];
    const choice = index === 4 ? question.options.find((answer) => answer !== question.kana.romaji) : question.kana.romaji;
    quiz = answerQuiz(quiz, choice).quiz;
    if (index < quiz.questions.length - 1) quiz = advanceQuiz(quiz);
  }
  assert.equal(quizScore(quiz), 80);
  assert.equal(quizPassed(quiz), true);
  const passed = recordResult(emptyProgress(), LEVELS[0].id, quizScore(quiz));
  assert.deepEqual(passed.completedLevelIds, ['vowels']);
  assert.equal(isLevelUnlocked('k', passed.completedLevelIds), true);
  assert.equal(isLevelUnlocked('s', passed.completedLevelIds), false);
});

test('failure does not unlock, retry cannot lower a best score', () => {
  const initial = recordResult(emptyProgress(), 'vowels', 60);
  assert.equal(initial.completedLevelIds.length, 0);
  const passed = recordResult(initial, 'vowels', 80);
  const replay = recordResult(passed, 'vowels', 20);
  assert.equal(replay.bestScores.vowels, 80);
  assert.deepEqual(replay.completedLevelIds, ['vowels']);
  assert.throws(() => recordResult(emptyProgress(), 'k', 100));
});

test('progress rejects malformed and future-version snapshots without resetting them', () => {
  assert.deepEqual(parseProgress(null), emptyProgress());
  assert.throws(() => parseProgress({ formatVersion: 2, completedLevelIds: [], bestScores: {} }));
  assert.throws(() => parseProgress({ formatVersion: 1, completedLevelIds: ['k'], bestScores: { k: 100 } }));
  assert.throws(() => parseProgress({ formatVersion: 1, completedLevelIds: ['vowels'], bestScores: {} }));
  assert.throws(() => parseProgress({ formatVersion: 1, completedLevelIds: [], bestScores: { unknown: 100 } }));
});
