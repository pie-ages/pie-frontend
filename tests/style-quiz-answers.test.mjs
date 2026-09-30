import assert from 'node:assert/strict';
import test from 'node:test';

import { getStyleQuizSubmissions } from '../src/utils/style-quiz-answers.ts';

const questions = [
  { id: 'q1', options: [{ id: 'one', style: 'ELEGANTE' }, { id: 'two', style: 'CASUAL' }] },
  { id: 'q2', options: [{ id: 'three', style: 'ROMANTICO' }, { id: 'four', style: 'BOHO' }] },
];

test('sends selected options, including the confirmed final answer', () => {
  const updatedAnswers = {
    q1: { type: 'option', optionId: 'one' },
    q2: { type: 'option', optionId: 'four' },
  };

  assert.deepEqual(getStyleQuizSubmissions(questions, updatedAnswers), [
    { questionId: 'q1', optionId: 'one', answerType: 'OPTION' },
    { questionId: 'q2', optionId: 'four', answerType: 'OPTION' },
  ]);
});

test('both and none remain explicit answers to their questions', () => {
  assert.deepEqual(getStyleQuizSubmissions(questions, { q1: { type: 'both' }, q2: { type: 'none' } }), [
    { questionId: 'q1', optionId: null, answerType: 'BOTH' },
    { questionId: 'q2', optionId: null, answerType: 'NONE' },
  ]);
});

test('refuses unanswered questions or options from another question', () => {
  assert.throws(() => getStyleQuizSubmissions(questions, { q1: { type: 'both' } }), /todas as perguntas/);
  assert.throws(
    () => getStyleQuizSubmissions(questions, { q1: { type: 'option', optionId: 'four' } }),
    /Escolha inválida/,
  );
});