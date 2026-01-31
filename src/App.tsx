import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdventurePage from './features/adventure/AdventurePage';
import { ChronicleBook } from './features/chronicle/ChronicleBook';
import EncounterPage from './features/encounter/EncounterPage';
import PuzzlePage from './features/encounter/PuzzlePage';
import MathTestPage from './features/math/MathTestPage';
import Layout from './components/Layout';
import { useInitializeGame } from './hooks/useInitializeGame';
import { useAnonymousLoginTrigger } from './hooks/useAnonymousLoginTrigger';
import { LoadingScreen } from './components/LoadingScreen';

// LandingPage is now integrated into ChronicleBook

function AppContent() {
  const { isInitializing, error, retry } = useInitializeGame();

  useAnonymousLoginTrigger();

  if (isInitializing || error) {
    return <LoadingScreen error={error} onRetry={retry} />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Unified Entry Point */}
        <Route path="/" element={<Navigate to="/chronicle" replace />} />

        {/* Chronicle Routes */}
        <Route path="/chronicle" element={<ChronicleBook />} />
        <Route path="/chronicle/:pageId" element={<ChronicleBook />} />

        <Route path="/map/:adventureId" element={<AdventurePage />} />
        <Route path="/encounter/:adventureId/:nodeIndex" element={<EncounterPage />} />
        <Route path="/puzzle/:adventureId/:nodeIndex" element={<PuzzlePage />} />
        <Route path="/math-debug" element={<MathTestPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
