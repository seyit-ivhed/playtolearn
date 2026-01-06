import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdventurePage from './features/adventure/AdventurePage';
import { ChronicleBook } from './features/chronicle/ChronicleBook';

import CampPage from './features/camp/CampPage';
import EncounterPage from './features/encounter/EncounterPage';
import PuzzlePage from './features/encounter/PuzzlePage';
import MathTestPage from './features/math/MathTestPage';

import Layout from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { useGameStore } from './stores/game/store';
import { useEffect, useRef } from 'react';
import { useInitializeGame } from './hooks/useInitializeGame';
import { LoadingScreen } from './components/LoadingScreen';

function AppContent() {
  const { isInitializing, error, retry } = useInitializeGame();
  const { isAuthenticated, signInAnonymously, loading: authLoading } = useAuth();

  const authMilestoneReached = useGameStore(state => state.authMilestoneReached);
  const authTriggered = useRef(false);

  // Handle anonymous account creation when milestones are reached
  useEffect(() => {
    if (!authLoading && authMilestoneReached && !isAuthenticated && !authTriggered.current) {
      console.log('Milestone reached! Creating anonymous account...');
      authTriggered.current = true;
      signInAnonymously().catch(err => {
        console.error('Failed to create anonymous account:', err);
        authTriggered.current = false; // Allow retry on failure
      });
    }
  }, [authMilestoneReached, isAuthenticated, signInAnonymously, authLoading]);

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
