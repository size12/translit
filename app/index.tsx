import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettingsStore } from '@/store/settings';
import { Redirect, Stack } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { supportedTranslateLanguages } from '@/constants/supportedLanguages';
import CountryFlag from '@/components/shared/CountryFlag';
import { languageToMap } from '@/constants/languageToFlag';
import { useTheme } from '@/hooks/useTheme';

export default function Index() {
  const { userLanguage, setUserLanguage } = useSettingsStore();
  const { colors } = useTheme();

  if (!!userLanguage) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Hello!',
          headerTitleStyle: { color: colors.DARK },
          headerBackground: () => (
            <View style={{ backgroundColor: colors.BACKGROUND, flex: 1 }} />
          ),
        }}
      />
      <View style={{ ...styles.container, backgroundColor: colors.BACKGROUND }}>
        <Text style={styles.text}>
          Welcome to TransLit!{'\n'}Please choose your native language
        </Text>

        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {supportedTranslateLanguages.map((el) => (
            <TouchableOpacity
              onPress={() => {
                setUserLanguage(el.value);
              }}
              style={{ padding: 10 }}
              key={el.value}
            >
              <CountryFlag isoCode={languageToMap(el.value) || ''} size={36} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontFamily: Fonts.Inter_600SemiBold,
    textAlign: 'center',
    fontSize: 24,
  },
});
