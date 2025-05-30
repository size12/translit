import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Book, BookMetadata, ReadingStatus } from '../model/Book';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import ePub from 'epubjs';

export interface addBookProps {
  metadata: BookMetadata;
  coverImageBase64: string;
  bookPath: string;
}

interface BookStore {
  books: Book[];
  downloadedStarterPack: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setDownloadedStarterPack: (value: boolean) => void;
  loadBookFromFile: (bookPath: string) => Promise<void>;
  addBook: (props: addBookProps) => Promise<void>;
  getBook: (bookId: string) => Promise<Book>;
  updateReadingStatus: (
    bookId: string,
    updater: (old: ReadingStatus) => ReadingStatus,
  ) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
}

export const useBookStore = create(
  persist<BookStore>(
    (set, get) => ({
      books: [],
      downloadedStarterPack: false,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
      setDownloadedStarterPack: (value: boolean) => {
        set({ downloadedStarterPack: value });
      },
      async loadBookFromFile(bookPath: string) {
        const fileResponse = await fetch(bookPath);
        const arrayBuffer = await fileResponse.arrayBuffer();

        const book = ePub(arrayBuffer);

        await book.ready;

        const metadata = await book.loaded.metadata;
        const coverUrl = await book.loaded.cover;
        const coverBase64 = await book.archive.getBase64(coverUrl);

        const { addBook } = get();

        await addBook({
          metadata: { ...metadata, author: metadata.creator },
          bookPath: bookPath,
          coverImageBase64: coverBase64,
        });
      },
      addBook: async (bookProps: addBookProps) => {
        const { books } = get();

        if (
          books.some(
            (el) => el.metadata.identifier === bookProps.metadata.identifier,
          )
        ) {
          throw new Error('book is already in library');
        }

        const newId = uuid.v4();

        const coverDirectoryPath = `${FileSystem.documentDirectory}book_${newId}`;
        const coverImagePath = `${coverDirectoryPath}/cover.png`;
        const bookPath = `${coverDirectoryPath}/book.epub`;

        await FileSystem.makeDirectoryAsync(coverDirectoryPath, {
          intermediates: false,
        });

        // data:image/png;base64,ASDFASDFASDf........" -> removing prefix "data:image/png;base64"
        const base64data = bookProps.coverImageBase64.split(',')[1];

        // Saving image
        await FileSystem.writeAsStringAsync(coverImagePath, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Copying book
        await FileSystem.copyAsync({
          from: bookProps.bookPath,
          to: bookPath,
        });

        // Set reading status to not opened
        const readingStatus: ReadingStatus = {
          startedReading: false,
          progressPercent: 0,
          lastLocation: undefined,
        };

        const book: Book = {
          id: newId,
          coverImagePath: coverImagePath,
          bookPath: bookPath,
          status: readingStatus,
          metadata: bookProps.metadata,
        };

        set((state) => ({ books: [...state.books, book] }));
      },

      updateReadingStatus: async (
        bookId: string,
        updater: (old: ReadingStatus) => ReadingStatus,
      ) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? { ...book, status: updater(book.status) }
              : book,
          ),
        }));
      },

      getBook: async (bookId: string) => {
        const { books } = get();
        const book = books.find((book) => book.id === bookId);

        if (book) {
          return book;
        }

        throw new Error("Don't have this book in library");
      },

      deleteBook: async (bookId: string) => {
        const { books } = get();

        const bookToDelete = books.find((book) => book.id === bookId);

        if (bookToDelete) {
          const coverDirectoryPath = `${FileSystem.documentDirectory}book_${bookToDelete.id}`;
          await FileSystem.deleteAsync(coverDirectoryPath);
        }

        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
        }));
      },
    }),
    {
      name: 'bookshelf',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.setHasHydrated(true);
      },
    },
  ),
);
