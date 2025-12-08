import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdventurePage from './pages/AdventurePage';
import CampPage from './pages/CampPage';
import EncounterPage from './pages/EncounterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/camp" replace />} />

        {/* 1. The Camp (Starting Hub) */}
        <Route path="/camp" element={<CampPage />} />

        {/* 2. The Adventure Map */}
        <Route path="/map" element={<AdventurePage />} />

        {/* 3. The Encounter */}
        <Route path="/encounter" element={<EncounterPage />} />

        {/* Legacy / Dev routes */}
        <Route path="/combat-ui-test" element={<EncounterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
