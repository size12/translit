import { StyleSheet, Alert } from 'react-native';
import React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from 'react-native';
import { useBookStore } from '@/store/books';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function BookPicker() {
  const { loadBookFromFile } = useBookStore();
  const { colors } = useTheme();

  const pickBook = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: ['application/epub', 'application/epub+zip'],
        copyToCacheDirectory: true,
      });

      if (!document.assets || !document.assets.length) {
        return;
      }

      await loadBookFromFile(document.assets[0].uri);
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert('Error', `Failed add book: ${err.message}`);
        return;
      }

      Alert.alert('Unknown error', JSON.stringify(err));
    }
  };

  return (
    <TouchableOpacity
      style={{ ...styles.fab, backgroundColor: colors.BLUE }}
      onPress={pickBook}
    >
      <AntDesign name="plus" size={32} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
