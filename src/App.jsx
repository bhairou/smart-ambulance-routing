import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Dijkstra from './Dijkstra';
import PriorityQueue from './PriorityQueue';
import TripHistory from './TripHistory';
import HospitalDetail from './HospitalDetail';
import RouteSimulation from './RouteSimulation';
import LiveTrack from './LiveTrack';
import { AmbulancesPage, EmergencyPage, HospitalsPage } from './SectionPages.jsx';
import Navbar from './Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/ambulances" element={<AmbulancesPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/analytics" element={<><Navbar /><Analytics /></>} />
        <Route path="/dijkstra" element={<><Navbar /><Dijkstra /></>} />
        <Route path="/priority-queue" element={<><Navbar /><PriorityQueue /></>} />
        <Route path="/trip-history" element={<TripHistory />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />
        <Route path="/route-simulation" element={<RouteSimulation />} />
        <Route path="/live-track" element={<><Navbar /><LiveTrack /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;