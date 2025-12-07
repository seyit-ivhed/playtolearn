import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MissionPage from './pages/MissionPage';
import PartyCampPage from './pages/PartyCampPage';
import CombatPage from './pages/CombatPage';

import { CombatUITestPage } from './pages/CombatUITestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MissionPage />} />
        <Route path="/party-camp" element={<PartyCampPage />} />
        <Route path="/combat" element={<CombatPage />} />

        <Route path="/combat-ui-test" element={<CombatUITestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

