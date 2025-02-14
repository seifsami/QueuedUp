// firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDA_TmrkW5vCQ6PbOmE5lPoM8R-0JbujSI",
    authDomain: "queuedup.firebaseapp.com",
    projectId: "queuedup-a7344",
    storageBucket: "queuedup-a7344.appspot.com",
    messagingSenderId: "1086094219051",
    appId: "1:1086094219051:web:2e7fc871dc924570ba576e",
    measurementId: "G-SWSL0BRGET"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
