export type StyleQuizAnswer =
  { type: 'option'; optionId: string } | { type: 'both' } | { type: 'none' };

export type StyleQuizSubmission = {
  questionId: string;
  optionId: string | null;
  answerType: 'OPTION' | 'BOTH' | 'NONE';
};
