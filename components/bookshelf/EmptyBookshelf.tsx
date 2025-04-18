import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function EmptyBookshelf() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        ...styles.emptyBookshelfContainer,
        backgroundColor: colors.BACKGROUND,
      }}
    >
      <Text style={{ fontStyle: 'italic', ...styles.emptyBookshelf }}>
        Bookshelf is empty
      </Text>
      <Text style={{ fontWeight: '600', ...styles.emptyBookshelf }}>
        Add new books
      </Text>
      <Text style={{ color: 'gray', ...styles.emptyBookshelf, fontSize: 12 }}>
        Supported formats: .epub
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyBookshelfContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBookshelf: {
    fontSize: 20,
    textAlign: 'center',
  },
});
