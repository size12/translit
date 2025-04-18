import { StyleSheet, Switch, View } from 'react-native';
import React from 'react';
import { useThemeStore } from '@/store/theme';

export default function ThemeToggle() {
  const { theme, switchTheme } = useThemeStore();

  return (
    <View style={styles.container}>
      <Switch value={theme === 'dark'} onChange={() => switchTheme()}></Switch>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
