import { create } from 'zustand';

interface AppState {
  currentScreen: 'menu' | 'playing' | 'result';
  setScreen: (screen: 'menu' | 'playing' | 'result') => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentScreen: 'menu',
  setScreen: (screen) => set({ currentScreen: screen }),
}));