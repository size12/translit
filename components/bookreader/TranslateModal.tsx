import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslateModal } from '@/contexts/TranslateModalContext';
import ModalCard from '../shared/ModalCard';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { Fonts } from '@/constants/Fonts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings';
import { useWordsStore } from '@/store/words';
import { AnkiWord } from '@/model/AnkiWord';
import { useTheme } from '@/hooks/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedMaterialIcon = Animated.createAnimatedComponent(MaterialIcons);

const injectJS = `
  (() => {
      try {
          if (hasInjected !== undefined) {
              return
          }
      } catch {
          window.hasInjected = true
          // hiding nav bar
          const style = document.createElement('style');
          style.textContent = '.nav-tabs { display: none !important; }';
          document.head.appendChild(style);

          // sending messages back to RN
          const sendMessageRN = (eventName, status, data) => {
              const message = {
                  "event": eventName,
                  "status": status,
              }

              if (status === "ok") {
                  message["data"] = data
              } else if (status === "error") {
                  message["data"] = (data instanceof Error) ? data.toString() : JSON.stringify(data)
              } else {
                  message["data"] = \`Unknown result type, expected ok | error, got \${message["status"]}\`
                  message["status"] = "error"
              }

              const jsonMessage = JSON.stringify(message)

              if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
                  window.ReactNativeWebView.postMessage(jsonMessage)
              } else {
                  console.error('❌ ReactNativeWebView не найден');
                  console.log(jsonMessage)
              }
          }

          // observing

          const observingSelectors = [
            {
              "event": "event.source",
              "selector": "div#measurer",
            },
            {
              "event": "event.source",
              "selector": "div.fakearea",
            },
            {
              "event": "event.target",
              "selector": "div.translation",
            },
            {
              "event": "event.target",
              "selector": "div#dstBox span",
            }
          ]

          function observeTextChanges(event, element) {
              const textObserver = new MutationObserver(() => {
                  sendMessageRN(event, "ok", element.textContent)
              });

              textObserver.observe(element, { characterData: true, childList: true, subtree: true });
          }

          const startObserving = () => {
              sendMessageRN("test", "ok", "hello from webview!")

              observingSelectors.map(item => {
                const element = document.querySelector(item.selector)
                if (!element) return

                console.log(element)
                
                sendMessageRN(item.event, "ok", element.textContent)
                observeTextChanges(item.event, element)
              })
          }

          startObserving()
      }
  })()

  return true; // for android webview
`;
interface TranslationMessageJS {
  event: 'event.source' | 'event.target';
  status: 'ok' | 'error';
  data: string;
}

export default function TranslateModal() {
  const { colors } = useTheme();

  const { word, language, isVisible, hideMenu } = useTranslateModal();
  const [translateURL, setTranslateURL] = useState('');
  const [saveBtnStatus, setSaveBtnStatus] = useState<
    'enabled' | 'disabled' | 'added'
  >('disabled');

  const userLanguage = useSettingsStore((state) => state.userLanguage);
  const addWord = useWordsStore((state) => state.addWord);
  const haveWordAlready = useWordsStore((state) => state.haveWordAlready);

  const translationResult = useRef('');
  const sourceWord = useRef('');
  const lastTranslatedSourceWord = useRef('');

  const TRANSLATE_URL_TEMPLATE = `https://translate.yandex.ru/?source_lang=${language}&target_lang=${userLanguage}&text=`;

  useEffect(() => {
    if (word) {
      const trimmed = word.trim();
      setTranslateURL(TRANSLATE_URL_TEMPLATE + encodeURIComponent(trimmed));
      sourceWord.current = trimmed;
    }
  }, [word]);

  const onMessage = (event: WebViewMessageEvent) => {
    const result: TranslationMessageJS = JSON.parse(event.nativeEvent.data);

    if (result.status !== 'ok') return;

    if (result.event === 'event.source') {
      // changed input word
      if (!result.data || result.data === '.') {
        setSaveBtnStatus('disabled');
        return;
      }
      sourceWord.current = result.data;

      const btnStatus = haveWordAlready(sourceWord.current)
        ? 'added'
        : sourceWord.current === lastTranslatedSourceWord.current
          ? 'enabled'
          : 'disabled';

      setSaveBtnStatus(btnStatus);

      return;
    }

    if (result.event === 'event.target') {
      // new translation is ready
      if (!result.data) {
        setSaveBtnStatus('disabled');
        return;
      }

      lastTranslatedSourceWord.current = sourceWord.current;
      const btnStatus = haveWordAlready(lastTranslatedSourceWord.current)
        ? 'added'
        : 'enabled';
      setSaveBtnStatus(btnStatus);
      translationResult.current = result.data;
      return;
    }
  };

  const saveWord = () => {
    if (!lastTranslatedSourceWord.current || !translationResult.current) return;

    const word: Omit<AnkiWord, 'id'> = {
      original: {
        language: language,
        text: lastTranslatedSourceWord.current,
      },
      translated: {
        language: userLanguage,
        text: translationResult.current,
      },
      recallRightCount: 0,
      repeatDate: new Date(),
    };

    setSaveBtnStatus('added');

    addWord(word);
  };

  // button animation
  const elevationValue = useSharedValue(0);
  const opacityValue = useSharedValue(0.2);
  const colorValue = useSharedValue(colors.BACKGROUND);
  const textColor = useSharedValue(colors.DARKBLUE);

  useEffect(() => {
    const duration = 200;
    elevationValue.value = withTiming(saveBtnStatus !== 'disabled' ? 3 : 0, {
      duration: duration,
    });
    opacityValue.value = withTiming(saveBtnStatus !== 'disabled' ? 1 : 0.2, {
      duration: duration,
    });
    colorValue.value = withTiming(
      saveBtnStatus === 'added' ? colors.GREEN : colors.BACKGROUND,
      { duration: duration },
    );
    textColor.value = withTiming(
      saveBtnStatus === 'added' ? colors.BACKGROUND : colors.DARKBLUE,
      { duration: duration },
    );
  }, [saveBtnStatus]);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevationValue.value,
    shadowOpacity: elevationValue.value / 10,
    opacity: opacityValue.value,
    backgroundColor: colorValue.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  return (
    <ModalCard isVisible={isVisible} hideModal={hideMenu}>
      <View
        style={{ ...styles.webviewContainer, backgroundColor: colors.LIGHT }}
      >
        <View style={{ padding: 10 }}>
          <AnimatedPressable
            style={[styles.button, animatedStyle]}
            onPress={saveWord}
            disabled={saveBtnStatus === 'disabled'}
          >
            <AnimatedMaterialIcon
              name="post-add"
              size={24}
              color={colors.ORANGE}
            />
            <Animated.Text
              style={[styles.text, textAnimatedStyle, { color: colors.BLUE }]}
            >
              {saveBtnStatus === 'added' ? 'Added word' : 'Add word'}
            </Animated.Text>
          </AnimatedPressable>
        </View>
        <WebView
          style={styles.webview}
          source={{ uri: translateURL }}
          injectedJavaScript={injectJS}
          onMessage={onMessage}
        />
      </View>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  webviewContainer: {
    height: '70%',
    width: '100%',
    overflow: 'hidden',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    paddingBottom: 0,
  },
  webview: {
    flex: 1,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 18,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.Inter_700Bold,
    fontSize: 18,
  },
});
