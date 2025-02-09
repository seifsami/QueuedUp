import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  Flex,
  Box,
  useToast,
} from '@chakra-ui/react';
import { getUserWatchlist } from '../services/api';
import NotifyMeButton from './NotifyMeButton';
import { useModal } from '../ModalContext';

const defaultImages = {
  books: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

// Expanded helper function to determine the appropriate Amazon domain.
const getAmazonDomain = () => {
  let domain = 'amazon.com'; // default to US
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.toUpperCase(); // e.g., "EN-US", "DE-DE"
    const parts = lang.split('-');
    
    // Mapping based on region code if available.
    if (parts.length === 2) {
      const region = parts[1];
      const regionMapping = {
        'US': 'amazon.com',
        'GB': 'amazon.co.uk',
        'DE': 'amazon.de',
        'FR': 'amazon.fr',
        'IT': 'amazon.it',
        'ES': 'amazon.es',
        'CA': 'amazon.ca',
        'JP': 'amazon.co.jp',
        'AU': 'amazon.com.au',
        'IN': 'amazon.in',
        'MX': 'amazon.com.mx',
        'BR': 'amazon.com.br',
        'NL': 'amazon.nl',
        'SG': 'amazon.sg',
        'AE': 'amazon.ae',
        'EG': 'amazon.eg',
        'CN': 'amazon.cn'
      };
      if (regionMapping[region]) {
        domain = regionMapping[region];
      }
    } else {
      // Fallback mapping based solely on language code.
      const langMapping = {
        'EN': 'amazon.com',
        'DE': 'amazon.de',
        'FR': 'amazon.fr',
        'IT': 'amazon.it',
        'ES': 'amazon.es',
        'JA': 'amazon.co.jp',
        'ZH': 'amazon.cn',
      };
      if (langMapping[parts[0]]) {
        domain = langMapping[parts[0]];
      }
    }
  }
  return domain;
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
    fetchUserWatchlist(); // Refetch watchlist after adding item
    if (refetchWatchlist) refetchWatchlist();
  };

  const handleClose = () => {
    
    if (refetchWatchlist) refetchWatchlist(); // Ensure homepage updates on modal close
    onClose(); // Close the modal
  };

  if (!item) return null;
  
  const rawReleaseDate = item.releaseDate || item.release_date || null;
  const formattedReleaseDate = rawReleaseDate
    ? new Date(rawReleaseDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        timeZone: 'UTC' 
      })
    : 'N/A';
  
  const truncatedDescription = item.description && item.description.length > 300
    ? item.description.substring(0, 300) + '...'
    : item.description;
  
  console.log("Item being passed to NotifyMeButton from DetailsModal:", item);
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: "sm", md: "lg" }} isCentered closeOnOverlayClick={true} >
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
                Release Date: {formattedReleaseDate}
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
                      ml={1}
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
          {item.media_type === 'books' && (
            <Button 
              as="a"
              href={`https://www.${getAmazonDomain()}/s?k=${encodeURIComponent(item.title)}&tag=queuedup0f-20`}
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="orange"
              size="md"
              mr={3}
            >
              Buy on Amazon
            </Button>
          )}
          {/* NotifyMeButton with success callback */}
          <NotifyMeButton
            item={item}
            userWatchlist={userWatchlist}
            refetchWatchlist={handleNotifySuccess}
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
