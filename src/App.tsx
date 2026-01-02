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

function App() {
  const { isAuthenticated, signInAnonymously, loading } = useAuth();
  const authMilestoneReached = useGameStore(state => state.authMilestoneReached);
  const authTriggered = useRef(false);

  useEffect(() => {
    // Only trigger if:
    // 1. Initial auth check (loading) is finished
    // 2. Milestone is reached
    // 3. User is not yet authenticated
    // 4. We haven't already triggered it in this component lifecycle
    if (!loading && authMilestoneReached && !isAuthenticated && !authTriggered.current) {
      console.log('Milestone reached! Creating anonymous account...');
      authTriggered.current = true;
      signInAnonymously().catch(err => {
        console.error('Failed to create anonymous account:', err);
        authTriggered.current = false; // Allow retry on failure
      });
    }
  }, [authMilestoneReached, isAuthenticated, signInAnonymously, loading]);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
