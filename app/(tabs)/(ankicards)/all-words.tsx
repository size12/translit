import { FlatList, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useWordsStore } from '@/store/words';
import AnkiWordItem from '@/components/ankicards/AnkiWordItem';
import EmptyWordsList from '@/components/ankicards/EmptyWordsList';
import { Stack } from 'expo-router';
import SearchBar from '@/components/ankicards/SearchBar';

export default function AllWords() {
  const { colors } = useTheme();
  const wordsUnsorted = useWordsStore((state) => state.words);
  const [searchQuery, setSearchQuery] = useState("")

  const words = useMemo(
    () => wordsUnsorted.filter((word) => {
      return word.original.text.includes(searchQuery) || word.translated.text.includes(searchQuery)
    }).sort((a, b) => a.recallRightCount - b.recallRightCount),
    [wordsUnsorted, searchQuery],
  );

  const onChangeSearchText = (text: string) => {
    setSearchQuery(text.trim().toLowerCase())
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'All words',
          headerTitleAlign: 'center',
          headerTintColor: colors.DARK,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.BACKGROUND }}>
        <SearchBar placeholder="Search word..."onChangeText={onChangeSearchText}/>
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
