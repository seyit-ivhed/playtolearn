import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdventurePage from './features/adventure/AdventurePage';
import CampPage from './features/camp/CampPage';
import EncounterPage from './features/encounter/EncounterPage';
import PuzzlePage from './features/encounter/PuzzlePage';
import MathTestPage from './features/math/MathTestPage';

import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/map" replace />} />

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
