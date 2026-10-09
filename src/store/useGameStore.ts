import { create } from 'zustand';

interface GameState {
  score: number;
  timeRemaining: number;
  playerHealth: number;
  
  addScore: (points: number) => void;
  setTimeRemaining: (time: number) => void;
  setPlayerHealth: (health: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  timeRemaining: 60,
  playerHealth: 100,

  addScore: (points) => set((state) => ({ score: state.score + points })),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setPlayerHealth: (health) => set({ playerHealth: Math.max(0, health) }),
  
  resetGame: () => set({
    score: 0,
    timeRemaining: 60,
    playerHealth: 100
  }),
}));