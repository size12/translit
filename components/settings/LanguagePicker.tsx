import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import CountryFlag from '@/components/shared/CountryFlag';
import { useLanguagePicker } from '@/contexts/LanguagePickerContext';
import { useSettingsStore } from '@/store/settings';
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';
import { supportedTranslateLanguages } from '@/constants/supportedLanguages';
import { languageToMap } from '@/constants/languageToFlag';
import { useTheme } from '@/hooks/useTheme';

interface DropdownElement {
  index: number;
  label: string;
  value: string;
}

export default function LanguagePicker() {
  const { isOpened, openPicker, closePicker } = useLanguagePicker();
  const { userLanguage, setUserLanguage } = useSettingsStore();
  const { colors } = useTheme();

  const dropdownRef = useRef<IDropdownRef>(null);

  const renderItem = (item: DropdownElement) => {
    return (
      <View
        style={{
          ...styles.dropdownElementContainer,
          backgroundColor: colors.BACKGROUND,
        }}
      >
        <CountryFlag isoCode={languageToMap(item.value) || ''} size={32} />
      </View>
    );
  };

  useEffect(() => {
    if (!dropdownRef.current) return;

    if (isOpened) {
      dropdownRef.current.open();
    } else {
      dropdownRef.current.close();
    }
  }, [isOpened]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        value={userLanguage}
        data={supportedTranslateLanguages}
        onChange={(item: DropdownElement) => setUserLanguage(item.value)}
        labelField="label"
        valueField="value"
        autoScroll={false}
        onFocus={openPicker}
        onBlur={closePicker}
        renderItem={renderItem}
        ref={dropdownRef}
        renderLeftIcon={() => (
          <CountryFlag
            isoCode={languageToMap(userLanguage) || ''}
            size={32}
            style={{ marginRight: 5 }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dropdown: {
    width: 80,
  },
  dropdownElementContainer: {
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
