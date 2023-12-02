
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Your HomePage component
import './App.css';
// Import other pages and components as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Define other routes and components here */}
      </Routes>
    </Router>
  );
};

export default App;
