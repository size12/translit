import { LanguageWord } from './LanguageWord';

// Anki Card data
export interface AnkiWord {
  id: string;
  original: LanguageWord;
  translated: LanguageWord;
  example?: string;
  recallRightCount: number;
  repeatDate: Date;
}
