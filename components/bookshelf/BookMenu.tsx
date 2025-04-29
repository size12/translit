import {
  Alert,
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Fonts } from '@/constants/Fonts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useBookMenu } from '@/contexts/BookMenuContext';
import { useBookStore } from '@/store/books';
import ModalCard from '../shared/ModalCard';
import { useTheme } from '@/hooks/useTheme';

export default function BookMenu() {
  const { bookId, isVisible, hideMenu } = useBookMenu();
  const { colors } = useTheme();

  const updateReadingStatus = useBookStore(
    (state) => state.updateReadingStatus,
  );
  const deleteBook = useBookStore((state) => state.deleteBook);

  const handleResetProgress = () => {
    bookId &&
      updateReadingStatus(bookId, () => ({
        startedReading: true,
        lastLocation: undefined,
        progressPercent: 0,
      }));
    hideMenu();
  };

  const handleMarkFinished = () => {
    bookId &&
      updateReadingStatus(bookId, (old) => ({
        ...old,
        startedReading: true,
        progressPercent: 100,
      }));
    hideMenu();
  };

  const handleDeleteBook = () => {
    if (!bookId) return;

    Alert.alert(
      'Deleting book',
      'Are you sure that you want to delete this book?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteBook(bookId) },
      ],
    );

    hideMenu();
  };

  const pressableOpacityStyle = ({ pressed }: PressableStateCallbackType) => ({
    opacity: pressed ? 0.7 : 1,
    ...styles.button,
    backgroundColor: colors.BACKGROUND,
  });

  return (
    <ModalCard isVisible={isVisible} hideModal={hideMenu}>
      <View style={{ ...styles.modalContent, backgroundColor: colors.LIGHT }}>
        <Pressable style={pressableOpacityStyle} onPress={handleResetProgress}>
          <MaterialIcons name="restart-alt" size={32} color={colors.DARKBLUE} />
          <Text style={{ ...styles.buttonText, color: colors.DARKBLUE }}>
            Reset progress
          </Text>
        </Pressable>
        <Pressable style={pressableOpacityStyle} onPress={handleMarkFinished}>
          <MaterialIcons name="done-all" size={32} color={colors.GREEN} />
          <Text style={{ ...styles.buttonText, color: colors.GREEN }}>
            Mark as finished
          </Text>
        </Pressable>
        <Pressable style={pressableOpacityStyle} onPress={handleDeleteBook}>
          <MaterialIcons name="delete-outline" size={32} color={colors.RED} />
          <Text style={{ ...styles.buttonText, color: colors.RED }}>
            Delete book
          </Text>
        </Pressable>
      </View>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    gap: 16,
  },
  button: {
    width: '100%',
    height: 80,
    borderRadius: 18,
    padding: 20,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: Fonts.Inter_600SemiBold,
  },
});
