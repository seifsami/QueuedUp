
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Your HomePage component
import './App.css';
import WatchlistPage from './pages/WatchlistPage'; // Your WatchlistPage component
import LandingPage from './pages/LandingPage'; // Your LandingPage component

// Import other pages and components as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
      </Routes>
    </Router>
  );
};

export default App;
