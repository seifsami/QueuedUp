import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useModal } from '../ModalContext';
import { addToWatchlist } from '../services/api';

const NotifyMeButton = ({ item, userWatchlist, refetchWatchlist, buttonProps }) => {
  const { currentUser, openModalWithItem } = useModal();
  const toast = useToast();

  // Check if the item is already in the user's watchlist
  const isInWatchlist =
    Array.isArray(userWatchlist) &&
    userWatchlist.some((watchlistItem) => watchlistItem.title === item.title);

  const handleNotifyClick = async () => {
    if (!currentUser) {
      // If not signed in, open the modal (or login flow)
      openModalWithItem(item);
    } else {
      try {
        console.log("Attempting to add to watchlist with:", {
          userId: currentUser.uid,
          itemId: item._id,
          mediaType: item.media_type,
        });
        console.log("Item in NotifyMeButton:", item);

        await addToWatchlist(currentUser.uid, item._id, item.media_type);
        toast({
          title: 'Added to Watchlist',
          description: `${item.title} has been added to your watchlist.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Use safeRefetch: if refetchWatchlist is not a function, default to a no-op.
        const safeRefetch =
          typeof refetchWatchlist === 'function' ? refetchWatchlist : () => {};
        await safeRefetch();
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
      colorScheme={isInWatchlist ? 'brand.100' : 'teal'}
      size={buttonProps?.size || 'sm'}
      isDisabled={isInWatchlist}
    >
      {isInWatchlist ? 'In Watchlist' : 'Notify Me'}
    </Button>
  );
};

export default NotifyMeButton;
