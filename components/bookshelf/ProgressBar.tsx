import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ReadingStatus } from '@/model/Book';
import { Fonts } from '@/constants/Fonts';
import { useTheme } from '@/hooks/useTheme';

export default function ProgressBar({ status }: { status: ReadingStatus }) {
  const { colors } = useTheme();

  if (!status.startedReading) {
    return (
      <View style={styles.container}>
        <Text style={styles.progressText}>Didn't start reading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{ ...styles.progressBar, backgroundColor: colors.LIGHTGRAY }}
      >
        <View
          style={{
            ...styles.progressBarFill,
            width: `${status.progressPercent}%`,
            backgroundColor: colors.BLUE,
          }}
        />
      </View>
      <Text style={{ ...styles.progressText, color: colors.GRAY }}>
        {status.progressPercent}% Complete
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.Inter_400Regular,
  },
  progressBar: {
    height: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
});
