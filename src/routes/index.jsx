import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import IPLHubPage from '../pages/IPLHubPage.jsx';
import PointsTablePage from '../pages/PointsTablePage.jsx';
import CalculatorsPage from '../pages/CalculatorsPage.jsx';
import NRRCalculatorPage from '../pages/NRRCalculatorPage.jsx';
import TeamPage from '../pages/TeamPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ipl" element={<IPLHubPage />} />
        <Route path="/ipl/table" element={<PointsTablePage />} />
        <Route path="/ipl/calculators" element={<CalculatorsPage />} />
        <Route path="/ipl/nrr" element={<NRRCalculatorPage />} />
        <Route path="/ipl/qualify/:team" element={<TeamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
