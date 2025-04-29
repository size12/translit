import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import WordsLearner from '@/components/ankicards/WordsLearner';
import { useTheme } from '@/hooks/useTheme';
import { Link, Stack } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function CardsRecalling() {
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
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ paddingVertical: 7 }}>{allWordsLink}</View>
          ),
          headerTitle: 'Learn',
        }}
      />
      <View style={{ ...styles.container, backgroundColor: colors.BACKGROUND }}>
        <WordsLearner />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
