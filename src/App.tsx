import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MissionPage from './pages/MissionPage';
import PartyCampPage from './pages/PartyCampPage';
import CombatPage from './pages/CombatPage';

// Temporary aliases to match new flow until files are renamed
const MapPage = MissionPage;
const CampPage = PartyCampPage;
const EncounterPage = CombatPage;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/map" replace />} />

        {/* 1. The Map */}
        <Route path="/map" element={<MapPage />} />

        {/* 2. The Camp */}
        <Route path="/camp" element={<CampPage />} />

        {/* 3. The Encounter (Combat) */}
        <Route path="/encounter" element={<EncounterPage />} />

        {/* Legacy / Dev routes */}
        <Route path="/combat-ui-test" element={<EncounterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
