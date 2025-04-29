import { StyleSheet, Text, View } from 'react-native';
import { recallRightToLearn, useWordsStore } from '@/store/words';
import AnkiCard from './AnkiCard';
import { Fonts } from '@/constants/Fonts';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';

export default function WordsLearner() {
  const words = useWordsStore((state) => state.words);

  const currentTime = new Date();

  const wordsToLearn = useMemo(() => {
    return words.filter(
      (word) =>
        word.repeatDate <= currentTime &&
        word.recallRightCount < recallRightToLearn,
    );
  }, [words]);

  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={{ ...styles.text, color: colors.DARKBLUE }}>
          Good work!{'\n'} You recalled all words!
        </Text>
        {wordsToLearn.toReversed().map((word) => (
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
