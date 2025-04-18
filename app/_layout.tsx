import { Stack } from 'expo-router';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { TranslateModalProvider } from '@/contexts/TranslateModalContext';
import { LanguagePickerProvider } from '@/contexts/LanguagePickerContext';
import { ReaderProvider } from '@epubjs-react-native/core';
import { MenuProvider } from 'react-native-popup-menu';
import { useTheme } from '@/hooks/useTheme';

export default function RootLayout() {
  const { theme } = useTheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TranslateModalProvider>
        <LanguagePickerProvider>
          <ReaderProvider>
            <MenuProvider>
              <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
              <Stack screenOptions={{ headerShown: true }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: true }} />
              </Stack>
            </MenuProvider>
          </ReaderProvider>
        </LanguagePickerProvider>
      </TranslateModalProvider>
    </GestureHandlerRootView>
  );
}
