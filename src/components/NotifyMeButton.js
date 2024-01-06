// NotifyMeButton.js
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModal } from '../ModalContext'; // Adjust the import path as necessary

export const NotifyMeButton = ({ item, user }) => {
  const { currentUser, openModalWithItem } = useModal();

  const handleNotifyClick = () => {
    console.log("Current user on click: ", user);
    if (!currentUser) {
        // If no user is logged in, open the sign-in modal
        openModalWithItem(item);
      } else {
    console.log('clicked'+item)
    
  };
  }

  return (
    <Button onClick={handleNotifyClick} colorScheme="teal" size="sm" flex={2}>
      Notify Me
    </Button>
  );
};

export default NotifyMeButton
