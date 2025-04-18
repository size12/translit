import { Colors } from '@/constants/Colors';
import { useThemeStore } from '@/store/theme';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const colors = Colors[theme];

  return { theme, colors };
}
