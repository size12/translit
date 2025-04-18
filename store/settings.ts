import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsStore {
	userLanguage: string;
	fontSize: number;
	setUserLanguage: (language: string) => void;
	increaseFontSize: () => void;
	decreaseFontSize: () => void;
}

export const useSettingsStore = create(
	persist<SettingsStore>(
		(set, get) => ({
			userLanguage: '',
			fontSize: 12,
			setUserLanguage: (language: string) => {
				set((state) => ({
					...state,
					userLanguage: language,
				}));
			},
			// font borders are 12px and 36px
			increaseFontSize: () => {
				set((state) => ({
					...state,
					fontSize: Math.min(state.fontSize + 1, 36),
				}));
			},
			decreaseFontSize: () => {
				set((state) => ({
					...state,
					fontSize: Math.max(state.fontSize - 1, 12),
				}));
			},
		}),
		{
			name: 'settings',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
