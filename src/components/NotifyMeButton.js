import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useModal } from '../ModalContext';
import { addToWatchlist } from '../services/api';

const NotifyMeButton = ({ item, userWatchlist, refetchWatchlist, buttonProps }) => {
  const { currentUser, openModalWithItem } = useModal();
  const toast = useToast();

  

  // ✅ Check watchlist by comparing `_id` (backend uses item_id)
  const isInWatchlist =
    Array.isArray(userWatchlist) &&
    userWatchlist.some((watchlistItem) => watchlistItem.item_id === item._id);

  

  const handleNotifyClick = async () => {
    if (!currentUser) {
      openModalWithItem(item);
    } else {
      try {
        
  
        await addToWatchlist(currentUser.uid, item._id, item.media_type);
  
        toast({
          title: 'Added to Watchlist',
          description: `${item.title} has been added to your watchlist.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
  
        await refetchWatchlist();  // ✅ Ensure refetch happens AFTER item is added
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
      colorScheme={isInWatchlist ? 'gray' : 'teal'}
      size={buttonProps?.size || 'sm'}
      isDisabled={isInWatchlist} // ✅ Disable if already in watchlist
    >
      {isInWatchlist ? 'In Watchlist' : 'Notify Me'}
    </Button>
  );
};

export default NotifyMeButton;
