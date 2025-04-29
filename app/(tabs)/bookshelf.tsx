import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { BookCard } from '@/components/bookshelf/BookCard';
import { useBookStore } from '@/store/books';
import { Book } from '@/model/Book';
import BookPicker from '@/components/bookshelf/BookPicker';
import { Tabs } from 'expo-router';
import BookMenu from '@/components/bookshelf/BookMenu';
import { BookMenuProvider } from '@/contexts/BookMenuContext';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import EmptyBookshelf from '@/components/bookshelf/EmptyBookshelf';
import { bookDownloadURLs } from '@/constants/booksStarterPack';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export default function BookshelfScreen() {
  const {
    books,
    deleteBook,
    loadBookFromFile,
    downloadedStarterPack,
    setDownloadedStarterPack,
    _hasHydrated,
  } = useBookStore();
  const { colors } = useTheme();

  const renderBook = (book: Book) => {
    return <BookCard book={book} remove={deleteBook} />;
  };

  useEffect(() => {
    // Load the books from the starter pack on first launch
    if (!_hasHydrated || downloadedStarterPack) return;

    bookDownloadURLs.forEach(async (url) => {
      const asset = Asset.fromModule(url);

      await asset.downloadAsync();

      if (!asset.localUri) return;

      try {
        await loadBookFromFile(asset.localUri);
      } catch (e) {
        console.log('Error loading book from file:', e);
      }

      // Deleting downloaded book
      await FileSystem.deleteAsync(asset.localUri);

      // Downloaded at least one book
      setDownloadedStarterPack(true);
    });
  }, [_hasHydrated]);

  return (
    <>
      <Tabs.Screen options={{ headerTitle: 'Bookshelf' }} />
      <BookMenuProvider>
        <View
          style={{ ...styles.container, backgroundColor: colors.BACKGROUND }}
        >
          <FlatList
            data={books.sort((a, b) =>
              a.metadata.title.localeCompare(b.metadata.title),
            )}
            keyExtractor={(book) => book.id}
            renderItem={({ item }) => renderBook(item)}
            contentContainerStyle={{ gap: 16, padding: 16, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => <EmptyBookshelf />}
          />
          <BookPicker />
          <BookMenu />
        </View>
      </BookMenuProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
