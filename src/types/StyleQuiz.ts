export type StyleCode = string;

export type StyleQuizOption = {
  id: string;
  label: string;
  description?: string;
  imageUrl: string | number;
  style: StyleCode;
};

export type StyleQuizQuestion = {
  id: string;
  question: string;
  order: number;
  options: StyleQuizOption[];
};

export type StyleQuizResponse = {
  questions: StyleQuizQuestion[];
};

export type StyleQuizAnswer =
  { type: 'option'; optionId: string } | { type: 'both' } | { type: 'none' };
