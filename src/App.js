import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import './App.css';
import WatchlistPage from './pages/WatchlistPage'; 
import SearchResultsPage from './pages/SearchResultsPage';
import ProfilePage from './pages/ProfilePage';

// Import other pages and components as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/search" element={<SearchResultsPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </Router>
  );
};

export default App;
