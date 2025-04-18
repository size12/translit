import { StyleSheet, View, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import ThemeToggle from '../settings/ThemeToggle';
import FontSizeSlider from '../settings/FontSizeSlider';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Fonts } from '@/constants/Fonts';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsDropdown() {
  const { colors } = useTheme();

  const textColor = {
    color: colors.DARK,
  };

  return (
    <Menu>
      <MenuTrigger>
        <View style={{ padding: 2 }}>
          <Feather name="settings" size={24} color={colors.DARK} />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 42,
            paddingBottom: 5,
            backgroundColor: colors.LIGHT,
          },
        }}
      >
        <View style={styles.menuOption}>
          <Text style={{ ...styles.menuOptionText, ...textColor }}>
            Day/Night
          </Text>
          <ThemeToggle />
        </View>
        <View style={styles.menuOption}>
          <Text style={{ ...styles.menuOptionText, ...textColor }}>
            Font size
          </Text>
          <FontSizeSlider />
        </View>
      </MenuOptions>
    </Menu>
  );
}

const styles = StyleSheet.create({
  menuOption: {
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    fontFamily: Fonts.Inter_400Regular,
  },
  menuOptionText: {
    fontFamily: Fonts.Inter_400Regular,
    fontSize: 16,
  },
});
