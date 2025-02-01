import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody,
  ModalCloseButton, Button, Image, Text, Flex, Box, useToast
} from '@chakra-ui/react';
import { getUserWatchlist } from '../services/api';
import NotifyMeButton from './NotifyMeButton';
import { useModal } from '../ModalContext';

const defaultImages = {
  books: "/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

const DetailsModal = ({ isOpen, onClose, item, refetchWatchlist }) => {
  const { currentUser } = useModal();
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchUserWatchlist();
    }
  }, [isOpen, currentUser]);

  const fetchUserWatchlist = async () => {
    try {
      const { data } = await getUserWatchlist(currentUser.uid);
      setUserWatchlist(data);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    }
  };

  const handleNotifySuccess = () => {
    fetchUserWatchlist();  // Refetch watchlist after adding item
    if (refetchWatchlist) refetchWatchlist();
  };

  const handleClose = () => {
    if (refetchWatchlist) refetchWatchlist();  // Ensure homepage updates on modal close
    onClose();  // Close the modal
  };

  if (!item) return null;

  const formattedReleaseDate = item.releaseDate || item.release_date || 'N/A';
  const truncatedDescription = item.description && item.description.length > 300
    ? item.description.substring(0, 300) + '...'
    : item.description;
  console.log("Item being passed to NotifyMeButton from DetailsModal:", item);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: "sm", md: "lg" }} isCentered>
      <ModalOverlay />
      <ModalContent 
        maxWidth={{ base: "96%", md: "70%" }}
        overflowY="auto"
        m={{ base: 2, md: 0 }}
      >
        <ModalCloseButton />
        <ModalBody>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            alignItems={{ base: "center", md: "start" }} 
            justifyContent="center"
          >
            <Box flexShrink={0} mb={{ base: 4, md: 0 }} textAlign={{ base: "center", md: "left" }}>
              <Image
                src={item.image || defaultImages[item.media_type || "books"]}
                alt={item.title}
                width={{ base: "30vh", md: "50vh" }}
                height={{ base: "30vh", md: "50vh" }}
                mt={6}
                objectFit="contain"
              />
            </Box>
            <Box flex="1" px={{ base: 2, md: 4 }}>
              <Text fontSize="2xl" fontWeight="bold" mt={{ base: "0", md: "30px" }} mb={2} textAlign={{ base: "center", md: "left" }}>
                {item.title}
              </Text>
              {item.author && (
                <Text fontSize="lg" mb={2} textAlign={{ base: "center", md: "left" }}>
                  Author: {item.author}
                </Text>
              )}
              <Text fontSize="lg" mb={2} textAlign={{ base: "center", md: "left" }}>
              Release Date: {formattedReleaseDate === 'N/A' ? 'N/A' : new Date(formattedReleaseDate).toLocaleDateString()}
              </Text>
              {item.description && (
                <Text fontSize="lg" mb={2} textAlign={{ base: "center", md: "left" }}>
                Description:{' '}
                <Text as="span" fontSize="md" fontWeight="normal">
                  {showFullDescription ? item.description : truncatedDescription}
                </Text>
                {item.description.length > 300 && (
                  <Button 
                    variant="link" 
                    colorScheme="blue" 
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    ml={1}  // Add margin to separate from description text
                  >
                    {showFullDescription ? 'See Less' : 'See More'}
                  </Button>
                )}
              </Text>
              )}
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button 
            as="a"
            href={`https://www.amazon.com/s?k=${encodeURIComponent(item.title)}&tag=queuedup0f-20`}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="orange"
            size="md"
            mr={3}
          >
            Buy on Amazon
          </Button>

          {/* NotifyMeButton with success callback */}
          <NotifyMeButton
            item={item}
            userWatchlist={userWatchlist}
            refetchWatchlist={handleNotifySuccess}  // Trigger watchlist update on success
            buttonProps={{
              colorScheme: "green",
              size: "md",
              mr: 3,
            }}
          />

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
