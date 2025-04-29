import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { AnkiWord } from '@/model/AnkiWord';
import { useTheme } from '@/hooks/useTheme';
import { LanguageWord } from '@/model/LanguageWord';
import { Fonts } from '@/constants/Fonts';
import CountryFlag from '@/components/shared/CountryFlag';
import { languageToMap } from '@/constants/languageToFlag';
import { recallRightToLearn, useWordsStore } from '@/store/words';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface AnkiWordItemProps {
  word: AnkiWord;
}

const LanguageWordItem = ({
  word,
  align,
}: {
  word: LanguageWord;
  align: 'left' | 'right';
}): React.ReactNode => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Text
        style={{
          fontFamily: Fonts.Inter_400Regular,
          textAlign: align,
          color: colors.DARK,
        }}
        numberOfLines={5}
        adjustsFontSizeToFit
        ellipsizeMode="tail"
      >
        {word.text}
      </Text>

      <View style={{ position: 'absolute', bottom: 0, [align]: 0 }}>
        <CountryFlag isoCode={languageToMap(word.language) || ''} size={32} />
      </View>
    </View>
  );
};

export default function AnkiWordItem({ word }: AnkiWordItemProps) {
  const { colors } = useTheme();
  const isLearned = word.recallRightCount >= recallRightToLearn;
  const { deleteWord, updateWord } = useWordsStore();

  const handleRestartProgress = () => {
    const update = () => {
      updateWord(word.id, (word) => {
        return {
          ...word,
          recallRightCount: 0,
          repeatDate: new Date(),
        };
      });
    };

    Alert.alert(
      'Resetting progress',
      'Are you sure that you want to reset word progress?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => update(),
        },
      ],
    );
  };

  const handleCheckAsLearned = () => {
    const update = () =>
      updateWord(word.id, (word) => {
        return {
          ...word,
          recallRightCount: recallRightToLearn,
        };
      });

    Alert.alert(
      'Marking as learned',
      'Are you sure that you want to check this word as learned?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => update(),
        },
      ],
    );
  };

  const handleDeleteWord = () => {
    Alert.alert(
      'Deleting word',
      'Are you sure that you want to delete this word?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteWord(word.id),
        },
      ],
    );
  };

  const translationX = useSharedValue(0);
  const showMenu = useRef(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  const toggleMenu = () => {
    showMenu.current = !showMenu.current;
    translationX.value = withTiming(showMenu.current ? -200 : 0, { duration: 200 });
  };

  return (
    <View
      style={{ width: '100%', height: 120, backgroundColor: 'transparent' }}
    >
      <View
        style={{
          width: 200,
          height: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'transparent',
          position: 'absolute',
          gap: 24,
          top: 0,
          right: 0,
        }}
      >
        <TouchableOpacity onPress={handleRestartProgress}>
          <MaterialIcons name="restart-alt" size={32} color={colors.DARKBLUE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCheckAsLearned}>
          <MaterialIcons name="done-all" size={32} color={colors.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteWord}>
          <MaterialIcons name="delete-outline" size={32} color={colors.RED} />
        </TouchableOpacity>
      </View>
      <AnimatedPressable
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: isLearned ? colors.LIGHTGREEN : colors.LIGHT,
            flexDirection: 'row',
            borderRadius: 16,
            elevation: 5,
            padding: 16,
            gap: 3,
            shadowColor: colors.DARK,
          },
          animatedStyle,
        ]}
        onPress={toggleMenu}
      >
        <LanguageWordItem word={word.original} align="left" />
        <View style={{ flexDirection: 'column', gap: 5, justifyContent: "space-between", alignItems: "center" }}>
          <View
            style={{
              width: 1,
              flexGrow: 1,
              backgroundColor: isLearned ? colors.BACKGROUND : colors.MIDDLEGRAY,
            }}
          />
          <Text style={{ fontFamily: Fonts.Inter_400Regular, color: isLearned ? colors.BACKGROUND : colors.MIDDLEGRAY}}>{word.recallRightCount}/{recallRightToLearn}</Text>
        </View>
        <LanguageWordItem word={word.translated} align="right" />
      </AnimatedPressable>
    </View>
  );
}
