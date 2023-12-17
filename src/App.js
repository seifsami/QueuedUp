import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import './App.css';
import WatchlistPage from './pages/WatchlistPage'; 
import SearchResultsPage from './pages/SearchResultsPage';
import { ModalProvider } from './ModalContext'
import OnboardingModal from './components/OnboardingModal';
import firebase from './firebaseConfig'; 

// Import other pages and components as needed

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      console.log("Auth state changed, user:", user);
      if (user) {
        // User is signed in
        setCurrentUser(user);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <ModalProvider>
      <OnboardingModal currentUser={currentUser} />
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage user={currentUser} />} />
        <Route path="/watchlist" element={<WatchlistPage user={currentUser} />} />
        <Route path="/search" element={<SearchResultsPage  user={currentUser}/>} /> 
      </Routes>
    </Router>e
   </ModalProvider>
  );
};

export default App;
