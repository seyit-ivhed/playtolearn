import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdventurePage from './features/adventure/AdventurePage';
import { ChronicleBook } from './features/chronicle/ChronicleBook';

import CampPage from './features/camp/CampPage';
import EncounterPage from './features/encounter/EncounterPage';
import PuzzlePage from './features/encounter/PuzzlePage';
import MathTestPage from './features/math/MathTestPage';

import Layout from './components/Layout';
import { useInitializeGame } from './hooks/useInitializeGame';
import { useAnonymousLoginTrigger } from './hooks/useAnonymousLoginTrigger';
import { LoadingScreen } from './components/LoadingScreen';

function AppContent() {
  const { isInitializing, error, retry } = useInitializeGame();
  
  useAnonymousLoginTrigger();

  if (isInitializing || error) {
    return <LoadingScreen error={error} onRetry={retry} />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/chronicle" replace />} />

        {/* 0. The Chronicle (Adventure Selection) */}
        <Route path="/chronicle" element={<ChronicleBook />} />

        {/* 1. The Camp (Starting Hub) */}
        <Route path="/camp/:adventureId" element={<CampPage />} />
        <Route path="/camp/:adventureId/:nodeIndex" element={<CampPage />} />

        {/* 2. The Adventure Map */}
        <Route path="/map/:adventureId" element={<AdventurePage />} />

        {/* 3. The Encounter */}
        <Route path="/encounter/:adventureId/:nodeIndex" element={<EncounterPage />} />

        {/* 4. The Puzzle */}
        <Route path="/puzzle/:adventureId/:nodeIndex" element={<PuzzlePage />} />


        {/* Legacy / Dev routes */}
        <Route path="/combat-ui-test" element={<EncounterPage />} />
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
