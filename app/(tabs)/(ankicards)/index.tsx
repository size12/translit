import { StyleSheet, View } from 'react-native';
import React from 'react';
import WordsLearner from '@/components/ankicards/WordsLearner';
import { useTheme } from '@/hooks/useTheme';

export default function CardsRecalling() {
  const { colors } = useTheme();

  return (
    <View style={{ ...styles.container, backgroundColor: colors.BACKGROUND }}>
      <WordsLearner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
