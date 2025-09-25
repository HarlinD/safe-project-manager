import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import PIPlanning from './pages/PIPlanning';
import Backlog from './pages/Backlog';
import Risks from './pages/Risks';
import Reports from './pages/Reports';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pi-planning" element={<PIPlanning />} />
          <Route path="/backlog" element={<Backlog />} />
          <Route path="/risks" element={<Risks />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
