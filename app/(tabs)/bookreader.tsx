import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslateModal } from '@/contexts/TranslateModalContext';
import { Location, useReader } from '@epubjs-react-native/core';
import { Reader } from '@epubjs-react-native/core';
import { Book } from '@/model/Book';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { useBookStore } from '@/store/books';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { useSettingsStore } from '@/store/settings';
import SettingsDropdown from '@/components/bookreader/SettingsDropdown';
import { useTheme } from '@/hooks/useTheme';
import { getReaderTheme } from '@/constants/bookreaderTheme';

export default function BookReader() {
  const { translateWord } = useTranslateModal();
  const { bookId } = useLocalSearchParams();
  const { getBook, updateReadingStatus } = useBookStore();
  const fontSize = useSettingsStore((state) => state.fontSize);
  const { changeFontSize, changeTheme, goToLocation } = useReader();
  const { theme, colors } = useTheme();

  const [book, setBook] = useState<Book>();

  if (!(typeof bookId === 'string')) {
    throw new Error('Book ID is not a string');
  }

  getBook(bookId)
    .then((book) => {
      setBook(book);
    })
    .catch((err) => {
      console.log(err);
    });

  const onReady = () => {
    if (!book) return;

    changeFontSize(`${fontSize}px`);
    changeTheme(getReaderTheme(theme));

    if (book?.status.lastLocation?.start.cfi) {
      goToLocation(book.status.lastLocation.start.cfi);
    }

    if (!book.status.startedReading) {
      updateReadingStatus(bookId, (old) => {
        return {
          ...old,
          startedReading: true,
        };
      });
    }
  };

  const onLocationChange = (
    totalLocations: number,
    currentLocation: Location,
    progress: number,
  ) => {
    updateReadingStatus(bookId, (old) => {
      return {
        ...old,
        progressPercent: progress ? progress : old.progressPercent,
        lastLocation: currentLocation,
      };
    });
  };

  const menuItems = [
    {
      label: 'Translate',
      action: (cfiRange: string, text: string): boolean => {
        book && translateWord(text, book.metadata.language);
        return true;
      },
    },
  ];

  const headerRightComponent = (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <SettingsDropdown />
    </View>
  );

  useEffect(() => {
    changeFontSize(`${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    changeTheme(getReaderTheme(theme));
  }, [theme]);

  return (
    <>
      <Tabs.Screen
        options={{
          headerTitle: book?.metadata.title || 'Book',
          tabBarStyle: { display: 'none' },
          headerRight: () => headerRightComponent,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.LIGHT }}>
        <Reader
          src={book?.bookPath || ''}
          fileSystem={useFileSystem}
          onReady={onReady}
          onLocationChange={onLocationChange}
          menuItems={menuItems}
          flow="scrolled"
        />
      </View>
    </>
  );
}
