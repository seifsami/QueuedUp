import React, { useState, createContext, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    console.log("Opening modal...");
    setModalOpen(true);
  };

   const closeModal = () => {
    console.log("Closing modal...");
    setModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
