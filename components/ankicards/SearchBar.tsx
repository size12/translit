import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';

export interface SearchBarProps {
  placeholder?: string,
  onChangeText?: (text: string) => void
}

export default function SearchBar(props: SearchBarProps) {
  const { colors } = useTheme();
  const [searchValue, setSearchValue] = useState("")

  const onChangeText = (text: string) => {
    setSearchValue(text)
    props.onChangeText && props.onChangeText(text)
  }
  
  return (
    <View style={{ ...styles.searchBarContainer }}>
      <View
        style={{ ...styles.searchBar, backgroundColor: colors.LIGHTGRAY }}
      >
				<FontAwesome name="search" size={24} color={colors.DARK} style={{margin: 8}}/>
        <TextInput placeholder={props.placeholder} value={searchValue} onChangeText={onChangeText} style={{flex: 1, color: colors.DARK}} placeholderTextColor={colors.BLUE} autoCorrect={false} spellCheck={false} />
			</View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    width: "100%",
    padding: 16,
    paddingVertical: 16,
    paddingBottom: 2
  },
  searchBar: {
		height: 40,
		borderRadius: 16,
    flexDirection: "row",
    paddingHorizontal: 5,
    alignItems: "center"
  },
});
