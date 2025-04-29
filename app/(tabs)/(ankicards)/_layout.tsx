import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/Fonts';

export default function StackLayout() {
  const { colors } = useTheme();

  return (
    <>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
          headerTitleStyle: {
            fontSize: 32,
            fontFamily: Fonts.Inter_600SemiBold,
            color: colors.DARK,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="all-words" />
      </Stack>
    </>
  );
}
