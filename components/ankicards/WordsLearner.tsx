import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useWordsStore } from '@/store/words';
import AnkiCard from './AnkiCard';
import { Fonts } from '@/constants/Fonts';
import { AnkiWord } from '@/model/AnkiWord';
import { useTheme } from '@/hooks/useTheme';

export default function WordsLearner() {
  const getWordsToLearn = useWordsStore((state) => state.getWordsToLearn);
  const [words, setWords] = useState<AnkiWord[]>([]);

  const { colors } = useTheme();

  useEffect(() => {
    setWords(getWordsToLearn());
  }, [getWordsToLearn]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={{ ...styles.text, color: colors.DARKBLUE }}>
          Good work!{'\n'} You recalled all words!
        </Text>
        {words.toReversed().map((word) => (
          <View style={styles.cardContainer} key={word.id}>
            <AnkiCard word={word} />
          </View>
        ))}
      </View>
      <Text style={{ ...styles.tipText, color: colors.GRAY }}>
        Swipe right if you remembered word{'\n'} Left if forgot
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.Inter_600SemiBold,
    fontSize: 24,
    textAlign: 'center',
  },
  tipText: {
    fontFamily: Fonts.Inter_400Regular,
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.5,
  },
});
