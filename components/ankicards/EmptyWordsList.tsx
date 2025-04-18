import { Text } from 'react-native';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/Fonts';

export default function EmptyWordsList() {
  const { colors } = useTheme();

  return (
    <Text style={{ fontFamily: Fonts.Inter_600SemiBold, color: colors.DARK }}>
      Start reading books to learn new words :D
    </Text>
  );
}
