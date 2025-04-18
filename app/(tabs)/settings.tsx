import { Pressable, StyleSheet, Text, ScrollView } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import LanguagePicker from '@/components/settings/LanguagePicker';
import { Fonts } from '@/constants/Fonts';
import { useLanguagePicker } from '@/contexts/LanguagePickerContext';
import ThemeToggle from '@/components/settings/ThemeToggle';
import FontSizeSlider from '@/components/settings/FontSizeSlider';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const { openPicker } = useLanguagePicker();
  const { colors } = useTheme();

  const textStyle = { color: colors.DARKBLUE };
  const settingContainerStyle = { backgroundColor: colors.LIGHT };

  return (
    <>
      <Tabs.Screen options={{ headerTitle: 'Settings' }} />
      <ScrollView
        style={{
          ...styles.container,
          padding: 16,
          backgroundColor: colors.BACKGROUND,
        }}
        contentContainerStyle={{ gap: 16 }}
      >
        <Pressable
          style={[styles.settingContainer, settingContainerStyle]}
          onPress={() => {
            openPicker();
          }}
        >
          <Text style={[styles.settingTitle, textStyle]}>
            Translate language
          </Text>
          <LanguagePicker />
        </Pressable>

        <Pressable style={[styles.settingContainer, settingContainerStyle]}>
          <Text style={[styles.settingTitle, textStyle]}>Day/Night mode</Text>
          <ThemeToggle />
        </Pressable>

        <Pressable style={[styles.settingContainer, settingContainerStyle]}>
          <Text style={[styles.settingTitle, textStyle]}>Font size</Text>
          <FontSizeSlider changeTextFontSize={true} />
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
  },
  settingContainer: {
    padding: 5,
    paddingHorizontal: 16,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontFamily: Fonts.Inter_400Regular,
  },
});
