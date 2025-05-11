import { Alert, FlatList, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useWordsStore } from '@/store/words';
import AnkiWordItem from '@/components/ankicards/AnkiWordItem';
import EmptyWordsList from '@/components/ankicards/EmptyWordsList';
import { Stack } from 'expo-router';
import SearchBar from '@/components/ankicards/SearchBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function AllWords() {
  const { colors } = useTheme();
  const wordsUnsorted = useWordsStore((state) => state.words);
  const deleteLearnedWords = useWordsStore((state) => state.deleteLearnedWords);
  const [searchQuery, setSearchQuery] = useState('');

  const words = useMemo(
    () =>
      wordsUnsorted
        .filter((word) => {
          return (
            word.original.text.includes(searchQuery) ||
            word.translated.text.includes(searchQuery)
          );
        })
        .sort((a, b) => a.recallRightCount - b.recallRightCount),
    [wordsUnsorted, searchQuery],
  );

  const onChangeSearchText = (text: string) => {
    setSearchQuery(text.trim().toLowerCase());
  };

  const handleDeleteLearnedWords = () => {
    Alert.alert(
      'Deleting learned words',
      'Are you sure that you want to delete learned words?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            deleteLearnedWords();
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'All words',
          headerTitleAlign: 'center',
          headerTintColor: colors.DARK,
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteLearnedWords}>
              <MaterialIcons
                name="delete-outline"
                size={32}
                color={colors.RED}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.BACKGROUND }}>
        <SearchBar
          placeholder="Search word..."
          onChangeText={onChangeSearchText}
        />
        <FlatList
          data={words}
          renderItem={(item) => <AnkiWordItem word={item.item} />}
          contentContainerStyle={{
            padding: 16,
            gap: 16,
            flexGrow: 1,
            justifyContent: words.length > 0 ? 'flex-start' : 'center',
            alignItems: 'center',
          }}
          ListEmptyComponent={() => <EmptyWordsList />}
        />
      </View>
    </>
  );
}
