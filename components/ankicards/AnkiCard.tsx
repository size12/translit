import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Fonts } from '@/constants/Fonts';
import CountryFlag from '@/components/shared/CountryFlag';
import { languageToMap } from '@/constants/languageToFlag';
import { AnkiWord } from '@/model/AnkiWord';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { snapPoint } from 'react-native-redash';
import { useWordsStore } from '@/store/words';
import { useTheme } from '@/hooks/useTheme';

export interface AnkiCardProps {
  word: AnkiWord;
}

const dimensions = Dimensions.get('window');

const width = Math.min(dimensions.width, dimensions.height);

const SNAP_POINTS = [-width, 0, width];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnkiCard({ word }: AnkiCardProps) {
  const { colors } = useTheme();

  const [showTranslation, setShowTranslation] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { rememberedWord, forgotWord } = useWordsStore();

  // Swipe animation
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translationX.value = event.translationX;
      translationY.value = event.translationY;
    })
    .onEnd((event) => {
      const dest = snapPoint(translationX.value, event.velocityX, SNAP_POINTS);
      translationX.value = withTiming(dest, {}, () => {
        if (dest !== 0) {
          runOnJS(setIsVisible)(false);
        }
        if (dest < 0) {
          // swiped left
          runOnJS(forgotWord)(word.id);
        } else if (dest > 0) {
          // swiped right
          runOnJS(rememberedWord)(word.id);
        }
      });
      translationY.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
    display: isVisible ? 'flex' : 'none',
    backgroundColor: interpolateColor(
      translationX.value,
      [-width, 0, width],
      [colors.RED, colors.LIGHT, colors.LIGHTGREEN],
    ),
  }));

  if (!isVisible) return null;

  return (
    <GestureDetector gesture={pan}>
      <AnimatedPressable
        onPress={() => setShowTranslation(!showTranslation)}
        style={[
          animatedStyle,
          styles.container,
          { shadowColor: colors.DARK, backgroundColor: colors.LIGHT },
        ]}
      >
        <Text style={{ ...styles.cardTitle, color: colors.DARKBLUE }}>
          {showTranslation ? word.translated.text : word.original.text}{' '}
          <CountryFlag
            isoCode={
              languageToMap(
                showTranslation
                  ? word.translated.language
                  : word.original.language,
              ) || 'unknown'
            }
            size={24}
            style={styles.flag}
          />
        </Text>
        {showTranslation && word.example && (
          <>
            <View
              style={{ ...styles.divider, backgroundColor: colors.LIGHTGRAY }}
            />
            <Text style={{ ...styles.example, color: colors.GRAY }}>
              {word.example}
            </Text>
          </>
        )}
        <Text style={{ ...styles.tapHint, color: colors.MIDDLEGRAY }}>
          {showTranslation ? 'Tap to show word' : 'Tap to show translation'}
        </Text>
      </AnimatedPressable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 32,
    fontFamily: Fonts.Inter_700Bold,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 24,
  },
  example: {
    fontSize: 18,
    fontFamily: Fonts.Inter_400Regular,
    textAlign: 'center',
  },
  tapHint: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    fontFamily: Fonts.Inter_400Regular,
  },
  flag: {
    opacity: 0.7,
  },
});
