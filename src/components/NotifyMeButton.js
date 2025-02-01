import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useModal } from '../ModalContext'; // Adjust the import path as necessary
import { addToWatchlist } from '../services/api';

export const NotifyMeButton = ({ item, userWatchlist, refetchWatchlist, buttonProps }) => {
  const { currentUser, openModalWithItem } = useModal();  // Access modal and current user
  const toast = useToast();  // To display notifications

  // Check if the item is already in the user's watchlist
  const isInWatchlist = Array.isArray(userWatchlist) && userWatchlist.some((watchlistItem) => watchlistItem.title === item.title);

  const handleNotifyClick = async () => {
    if (!currentUser) {
      openModalWithItem(item);  // Open login/sign-up modal if user not signed in
    } else {
      try {
        
          console.log("Attempting to add to watchlist with:", {
            userId: currentUser.uid,
            itemId: item._id,
            mediaType: item.media_type
          });
        console.log("Item in NotifyMeButton:", item);

        await addToWatchlist(currentUser.uid, item._id, item.media_type) // Add item to backend
        toast({
          title: 'Added to Watchlist',
          description: `${item.title} has been added to your watchlist.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        await refetchWatchlist();  // Re-fetch watchlist after successful addition
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to add item to watchlist. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Failed to add to watchlist:', error);
      }
    }
  };

  return (
    <Button
      onClick={handleNotifyClick}
      {...buttonProps}
      colorScheme={isInWatchlist ? 'gray' : 'teal'}  // Gray if already in watchlist, teal otherwise
      size={buttonProps?.size || 'sm'}
      isDisabled={isInWatchlist}  // Disable the button if item is already in watchlist
    >
      {isInWatchlist ? 'In Watchlist' : 'Notify Me'}
    </Button>
  );
};

export default NotifyMeButton;
