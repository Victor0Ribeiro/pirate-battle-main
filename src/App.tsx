import { useAppStore } from './store/useAppStore';
import { CanvasGame } from './components/CanvasGame';
import { useGameStore } from './store/useGameStore';

export default function App() {
  const currentScreen = useAppStore((state) => state.currentScreen);
  const setScreen = useAppStore((state) => state.setScreen);
  const score = useGameStore((state) => state.score);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      
      {currentScreen === 'menu' && (
        <div style={{ textAlign: 'center' }}>
          <h1>Pirate Battle</h1>
          <p>Seu shooter naval 2D</p>
          <button 
            onClick={() => setScreen('playing')}
            style={{ padding: '12px 20px', marginTop: '20px', fontSize: '18px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            ▶ Iniciar Jogo
          </button>
        </div>
      )}

      {currentScreen === 'playing' && (
        <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
          <CanvasGame />
        </div>
      )}

      {currentScreen === 'result' && (
        <div style={{ textAlign: 'center' }}>
          <h2>Fim de Partida!</h2>
          <p style={{ fontSize: '24px', color: '#FFD700', margin: '20px 0' }}>Sua Pontuação: {score}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => setScreen('playing')}
              style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Jogar de Novo
            </button>
            <button 
              onClick={() => setScreen('menu')}
              style={{ padding: '10px 20px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Menu Principal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}