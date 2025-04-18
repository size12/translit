import { StyleSheet, View } from 'react-native';
import React from 'react';
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

export default function BookshelfScreen() {
  const { books, deleteBook } = useBookStore();
  const { colors } = useTheme();

  const renderBook = (book: Book) => {
    return <BookCard book={book} remove={deleteBook} />;
  };

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
