import React, { useState, createContext, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);

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
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, openModalWithItem, itemToAdd }}>
      {children}
    </ModalContext.Provider>
  );
};
