import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { useGameStore } from '../store/useGameStore';

export const CanvasGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const score = useGameStore((state) => state.score);
  const playerHealth = useGameStore((state) => state.playerHealth);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const resetGame = useGameStore((state) => state.resetGame);

  useEffect(() => {
    if (!containerRef.current) return;

    resetGame();
    const engine = new GameEngine();
    engineRef.current = engine;
    
    engine.init(containerRef.current).then(() => {
      engine.startClock();
    });

    return () => {
      if (engineRef.current) engineRef.current.destroy();
    };
  }, [resetGame]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, color: '#FFF', display: 'flex', gap: '25px', fontSize: '22px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
        <div style={{ color: playerHealth > 30 ? '#4CAF50' : '#f44336' }}>HP: {playerHealth}</div>
        <div style={{ color: '#FFD700' }}>Score: {score}</div>
        <div>Time: {timeRemaining}s</div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};