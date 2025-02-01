import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './ModalContext'
import firebase from './firebaseConfig'; 
import './App.css';
import OnboardingModal from './components/OnboardingModal';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import WatchlistPage from './pages/WatchlistPage'; 
import SearchResultsPage from './pages/SearchResultsPage';
import ProfilePage from './pages/ProfilePage';
import { redirectToBrowser } from './utils/redirectHelper';



const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  

  useEffect(() => {
    redirectToBrowser();
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
        <Route path="/profile" element={<ProfilePage user={currentUser}/>} /> 
      </Routes>
    </Router>
   </ModalProvider>
  );
};

export default App;
