// NotifyMeButton.js
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModal } from '../ModalContext'; // Adjust the import path as necessary

export const NotifyMeButton = ({ item }) => {
  const { openModalWithItem } = useModal();

  

  const handleNotifyClick = () => {
    openModalWithItem(item);
  };

  return (
    <Button onClick={handleNotifyClick} colorScheme="teal" size="sm" flex={2}>
      Notify Me
    </Button>
  );
};

export default NotifyMeButton
