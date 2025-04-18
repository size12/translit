import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeStore {
	theme: 'light' | 'dark';
	switchTheme: () => void;
}

export const useThemeStore = create(
	persist<ThemeStore>(
		(set) => ({
			theme: 'light',
			switchTheme: () => {
				set((state) => ({
					...state,
					theme: state.theme === 'light' ? 'dark' : 'light',
				}));
			},
		}),
		{
			name: 'theme',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
