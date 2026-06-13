import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppLayout from './components/AppLayout';
import ProjectDetail from './pages/ProjectDetail';
import NewProject from './pages/NewProject';
import Dashboard from './pages/Dashboard'; // <-- Import the new Dashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route element={<AppLayout />}>
          {/* Replace the old placeholder div with the actual component */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
<Route path="/new-project" element={<NewProject />} /> {/* NEW ROUTE */}
<Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;