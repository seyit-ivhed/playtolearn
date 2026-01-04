import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { isInitializing, error, shouldNavigateToMap, retry } = useInitializeGame();
  const { isAuthenticated, signInAnonymously, loading: authLoading } = useAuth();

  const authMilestoneReached = useGameStore(state => state.authMilestoneReached);
  const authTriggered = useRef(false);
  const redirected = useRef(false);

  // Handle automatic navigation to map on reload if progress exists
  useEffect(() => {
    if (!isInitializing && shouldNavigateToMap && !redirected.current) {
      if (location.pathname === '/' || location.pathname === '/chronicle') {
        console.log('Redirecting to map based on loaded state...');
        redirected.current = true;
        navigate('/map', { replace: true });
      }
    }
  }, [isInitializing, shouldNavigateToMap, navigate, location]);

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

  if (isInitializing) {
    return <LoadingScreen error={error} onRetry={retry} />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/chronicle" replace />} />

        {/* 0. The Chronicle (Adventure Selection) */}
        <Route path="/chronicle" element={<ChronicleBook />} />

        {/* 1. The Camp (Starting Hub) */}

        <Route path="/camp" element={<CampPage />} />
        <Route path="/camp/:nodeId" element={<CampPage />} />

        {/* 2. The Adventure Map */}
        <Route path="/map" element={<AdventurePage />} />

        {/* 3. The Encounter */}
        <Route path="/encounter" element={<EncounterPage />} />

        {/* 4. The Puzzle */}
        <Route path="/puzzle/:nodeId" element={<PuzzlePage />} />


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
