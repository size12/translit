import { AnkiWord } from '@/model/AnkiWord';
import { create } from 'zustand';
import uuid from 'react-native-uuid';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// How many times user should recall word right to count word as remembered.
export const recallRightToLearn = 4;

interface WordsStore {
  words: AnkiWord[];
  addWord: (word: Omit<AnkiWord, 'id'>) => void;
  rememberedWord: (wordId: string) => void;
  forgotWord: (wordId: string) => void;
  deleteWord: (wordId: string) => void;
  updateWord: (
    wordId: string,
    modifyWord: (word: AnkiWord) => AnkiWord,
  ) => void;
  haveWordAlready: (sourceWord: string) => boolean;
}

// Leitner system
// Recalling word after 1 day, 3 days, 6 days
// If recalled wrong, start recalling from zero
const repeatAfter = (recallRightCount: number): Date => {
  const currentTime = new Date();

  switch (recallRightCount) {
    case 0:
      return currentTime;
    case 1:
      return new Date(currentTime.getTime() + 1 * 24 * 60 * 60 * 1000); // repeat after 1 day
    case 2:
      return new Date(currentTime.getTime() + 3 * 24 * 60 * 60 * 1000); // repeat after 3 days
    case 3:
      return new Date(currentTime.getTime() + 6 * 24 * 60 * 60 * 1000); // repeat after 6 days
    default:
      return currentTime;
  }
};

export const useWordsStore = create(
  persist<WordsStore>(
    (set, get) => {
      const moveWordToEnd = (
        wordId: string,
        modifyWord?: (word: AnkiWord) => AnkiWord,
      ) => {
        const { words } = get();
        const wordIndex = words.findIndex((w) => w.id === wordId);

        if (wordIndex === -1) return words;

        const word = words[wordIndex];
        const modifiedWord = modifyWord ? modifyWord(word) : word;

        return [
          ...words.slice(0, wordIndex),
          ...words.slice(wordIndex + 1),
          modifiedWord,
        ];
      };

      const wordsEquality = (word1: string, word2: string): boolean => {
        return word1.trim().toLowerCase() === word2.trim().toLowerCase();
      };

      return {
        words: [],
        addWord: (word: Omit<AnkiWord, 'id'>) => {
          set(({ words }) => {
            const ankiWord: AnkiWord = {
              id: uuid.v4(),
              ...word,
              recallRightCount: 0,
              repeatDate: repeatAfter(0),
            };

            return { words: [...words, ankiWord] };
          });
        },
        haveWordAlready: (sourceWord: string) => {
          const { words } = get();

          return (
            words.findIndex((word) =>
              wordsEquality(word.original.text, sourceWord),
            ) !== -1
          );
        },
        rememberedWord: (wordId: string) => {
          set(() => ({
            words: moveWordToEnd(wordId, (word) => ({
              ...word,
              recallRightCount: Math.min(
                word.recallRightCount + 1,
                recallRightToLearn,
              ),
              repeatDate: repeatAfter(word.recallRightCount + 1),
            })),
          }));
        },
        forgotWord: (wordId: string) => {
          set(() => ({
            words: moveWordToEnd(wordId, (word) => ({
              ...word,
              recallRightCount: 0,
              repeatDate: repeatAfter(0),
            })),
          }));
        },
        updateWord: (
          wordId: string,
          modifyWord: (word: AnkiWord) => AnkiWord,
        ) => {
          set(({ words }) => ({
            words: words.map((word) =>
              word.id === wordId ? modifyWord(word) : word,
            ),
          }));
        },
        deleteWord: (wordId: string) => {
          set(({ words }) => ({
            words: words.filter((word) => word.id !== wordId),
          }));
        },
      };
    },
    {
      name: 'words',
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persistedState, currentState) => {
        const typedState = persistedState as WordsStore;
        return {
          ...currentState,
          ...typedState,
          words: typedState.words.map((word) => ({
            ...word,
            repeatDate: new Date(word.repeatDate),
          })),
        };
      },
    },
  ),
);
