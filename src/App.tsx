import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useTheme } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { useBgm } from './hooks/useBgm';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameBoard } from './components/GameBoard';
import { OutcomeScreen } from './components/OutcomeScreen';
import './App.css';

function App() {
  useTheme();
  useLocale();

  const {
    phase,
    cases,
    playerCaseId,
    finalWinnings,
    outcome,
    startGame,
    resetGame,
  } = useGameStore();

  const showGame =
    phase !== 'welcome' && phase !== 'game-over';

  useBgm(showGame);

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true" />
      <Header />

      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={startGame} />
        )}

        {showGame && <GameBoard key="game" />}

        {phase === 'game-over' &&
          finalWinnings !== null &&
          outcome !== null && (
            <OutcomeScreen
              key="outcome"
              winnings={finalWinnings}
              outcome={outcome}
              cases={cases}
              playerCaseId={playerCaseId}
              onRestart={resetGame}
            />
          )}
      </AnimatePresence>
    </div>
  );
}

export default App;
