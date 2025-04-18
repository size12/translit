import { Theme } from '@epubjs-react-native/core';
import { Colors } from './Colors';

export function getReaderTheme(theme: 'light' | 'dark'): Theme {
  const colors = Colors[theme];

  return {
    body: {
      background: colors.LIGHT,
      color: colors.DARK,
      lineHeight: '1.6',
      fontFamily: 'Arial, sans-serif',
      margin: '0',
      padding: '0',
    },
    a: {
      color: colors.BLUE,
      textDecoration: 'underline',
    },
    h1: {
      color: colors.DARK,
      fontSize: '2em',
      margin: '0.67em 0',
    },
    h2: {
      color: colors.DARK,
      fontSize: '1.5em',
      margin: '0.75em 0',
    },
    p: {
      color: colors.DARK,
      fontSize: '1em',
      margin: '0.5em 0',
    },
    blockquote: {
      color: colors.GRAY,
      fontStyle: 'italic',
      margin: '1em 0',
      paddingLeft: '1em',
      borderLeft: '4px solid #555555',
    },
    img: {
      maxWidth: '100%',
      maxHeight: 'auto',
    },
    strong: {
      color: colors.DARK,
      fontWeight: 'bold',
    },
    em: {
      color: colors.DARK,
      fontStyle: 'italic',
    },
  };
}
