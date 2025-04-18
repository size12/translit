import { useRouter } from 'expo-router';
import { StyleSheet, Image, View, Text } from 'react-native';
import ProgressBar from './ProgressBar';
import CountryFlag from '@/components/shared/CountryFlag';
import { languageToMap } from '@/constants/languageToFlag';
import { Fonts } from '@/constants/Fonts';
import { Book } from '@/model/Book';
import { useBookMenu } from '@/contexts/BookMenuContext';
import { Pressable } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';

export interface BookCardProps {
  book: Book;
  remove: (id: string) => Promise<void>;
}

export function BookCard({ book, remove }: BookCardProps) {
  const router = useRouter();
  const { showMenu } = useBookMenu();

  const { colors } = useTheme();

  const handleStartReading = () => {
    router.push(`/bookreader?bookId=${book.id}`);
  };

  return (
    <Pressable
      style={{
        ...styles.bookCard,
        backgroundColor: colors.LIGHT,
        shadowColor: colors.DARK,
      }}
      onPress={handleStartReading}
      onLongPress={() => {
        showMenu(book.id);
      }}
      delayLongPress={350}
    >
      <Image
        source={{ uri: book.coverImagePath }}
        style={styles.bookCover}
        resizeMode="stretch"
        resizeMethod="scale"
      />
      <View style={styles.bookInfo}>
        <Text
          style={{ ...styles.bookTitle, color: colors.DARKBLUE }}
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          {book.metadata.title}
        </Text>
        <Text
          style={{ ...styles.bookAuthor, color: colors.GRAY }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {book.metadata.author}
        </Text>
        <View style={{ flexGrow: 1 }} />
        <ProgressBar status={book.status} />
      </View>
      <View style={styles.flag}>
        <CountryFlag
          isoCode={languageToMap(book.metadata.language) || 'unknown'}
          size={24}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookCover: {
    height: '100%',
    aspectRatio: 1 / 1.6,
  },
  bookInfo: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  bookTitle: {
    fontSize: 18,
    fontFamily: Fonts.Inter_600SemiBold,
  },
  bookAuthor: {
    fontSize: 14,
    fontFamily: Fonts.Inter_400Regular,
  },
  flag: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
