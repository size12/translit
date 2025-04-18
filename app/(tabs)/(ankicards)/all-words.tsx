import { FlatList, View } from 'react-native';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useWordsStore } from '@/store/words';
import AnkiWordItem from '@/components/ankicards/AnkiWordItem';
import EmptyWordsList from '@/components/ankicards/EmptyWordsList';

export default function AllWords() {
  const { colors } = useTheme();
  const { words } = useWordsStore();

  return (
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
  );
}
