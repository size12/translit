import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSettingsStore } from '@/store/settings';
import { Fonts } from '@/constants/Fonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTheme } from '@/hooks/useTheme';

export interface FontSizeSliderProps {
  changeTextFontSize?: boolean;
}

export default function FontSizeSlider(props: FontSizeSliderProps) {
  const { fontSize, increaseFontSize, decreaseFontSize } = useSettingsStore();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AntDesign
        name="minus"
        size={24}
        color={colors.DARK}
        onPress={decreaseFontSize}
        style={{ padding: 5 }}
      />
      <Text
        style={{
          ...styles.fontSizeText,
          fontSize: props.changeTextFontSize ? fontSize : 24,
          color: colors.DARK,
        }}
      >
        {fontSize}
      </Text>
      <AntDesign
        name="plus"
        size={24}
        color={colors.DARK}
        onPress={increaseFontSize}
        style={{ padding: 5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontSizeText: {
    fontFamily: Fonts.Inter_400Regular,
  },
});
