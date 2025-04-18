import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link, Stack, Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/Fonts';

export default function StackLayout() {
  const { colors } = useTheme();

  const allWordsLink = (
    <Link href="/(tabs)/(ankicards)/all-words" asChild>
      <TouchableOpacity
        style={{
          height: 50,
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          backgroundColor: colors.LIGHTGRAY,
          borderRadius: 16,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.Inter_400Regular,
            fontSize: 18,
            color: colors.DARK,
          }}
        >
          All words
        </Text>
        <FontAwesome5 name="list-ol" size={24} color={colors.DARK} />
      </TouchableOpacity>
    </Link>
  );

  return (
    <>
      <Tabs.Screen
        options={{
          headerShown: true,
          headerTitle: 'Words',
          headerRight: () => allWordsLink,
          headerRightContainerStyle: { padding: 16 },
        }}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'red' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="all-words" />
      </Stack>
    </>
  );
}
