import { FlatList, View } from 'react-native';
import React, { useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useWordsStore } from '@/store/words';
import AnkiWordItem from '@/components/ankicards/AnkiWordItem';
import EmptyWordsList from '@/components/ankicards/EmptyWordsList';
import { Stack } from 'expo-router';

export default function AllWords() {
  const { colors } = useTheme();
  const wordsUnsorted = useWordsStore((state) => state.words);

  const words = useMemo(
    () => wordsUnsorted.sort((a, b) => a.recallRightCount - b.recallRightCount),
    [wordsUnsorted],
  );

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
