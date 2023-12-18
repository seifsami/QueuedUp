import React, { useState, createContext, useContext, useEffect } from 'react';
import firebase from './firebaseConfig';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      
      if (user) {
        
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const openModalWithItem = (item) => {
    setItemToAdd(item);
    setModalOpen(true);
  };

   const closeModal = () => {
    setModalOpen(false);
    setItemToAdd(null)
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, openModalWithItem, itemToAdd, currentUser  }}>
      {children}
    </ModalContext.Provider>
  );
};
