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
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, signInAnonymously } = useAuth();
  const authMilestoneReached = useGameStore(state => state.authMilestoneReached);

  useEffect(() => {
    if (authMilestoneReached && !isAuthenticated) {
      console.log('Milestone reached! Creating anonymous account...');
      signInAnonymously();
    }
  }, [authMilestoneReached, isAuthenticated, signInAnonymously]);

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
