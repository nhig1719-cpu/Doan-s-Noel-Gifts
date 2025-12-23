
export enum Scene {
  Opening = 'OPENING',
  Quiz = 'QUIZ',
  Letter = 'LETTER',
  Unwrapping = 'UNWRAPPING',
  Final = 'FINAL'
}

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}
