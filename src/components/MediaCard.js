import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, Icon } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import Countdown from 'react-countdown';
import NotifyMeButton from './NotifyMeButton';

const defaultImages = {
  books: "/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

const MediaCard = ({ item, onOpenModal, userWatchlist, refetchWatchlist }) => {
  const imageContainerHeight = '338px'; 

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      let parsedDate = new Date(Date.parse(dateStr));
      if (isNaN(parsedDate.getTime())) throw new Error("Invalid Date");
      return parsedDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        timeZone: 'UTC' 
      });
    } catch (error) {
      console.error("Error parsing date:", dateStr);
      return 'Invalid Date';
    }
  };

  const renderer = ({ days, hours, minutes, completed }) => {
    if (completed) {
      return <Text fontSize="sm">Released!</Text>;
    } else {
      return <Text fontSize="sm">{days}d {hours}h {minutes}m left</Text>;
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
      transition="0.3s"
      _hover={{ boxShadow: 'md', cursor: 'pointer' }}
      w="220px"
      h="500px"
      m="0 8px"
      onClick={() => onOpenModal(item)}  // Make the whole card clickable
    >
      <Box 
        height={imageContainerHeight}
        position="relative"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Image
          src={item.image || defaultImages[item.media_type || "books"]}
          alt={item.title}
          objectFit="cover"
          width="100%"
          height="100%"
        />
         {/* Temporarily Remove Tracking Count */}
          {/*
          <Box position="absolute" top="2" right="2" p="2" bg="rgba(255, 255, 255, 0.6)" borderRadius="full">
            <HStack>
              <Icon as={FaEye} />
              <Text fontSize="sm">{item.trackingCount || '0'}</Text>
            </HStack>
          </Box>
          */}
      </Box>

      <VStack align="start" p={2} spacing="1">
        <Text fontWeight="bold" noOfLines={2} h="3rem">{item.title}</Text>
        <Text fontSize="sm">{formatReleaseDate(item.release_date)}</Text>
        <Countdown date={formatReleaseDate(item.release_date)} renderer={renderer} />

        <HStack justifyContent="space-between" width="full">
        <Box onClick={(e) => e.stopPropagation()}>
          <NotifyMeButton
            item={item}
            userWatchlist={userWatchlist}
            refetchWatchlist={refetchWatchlist}
            mediaType={item.media_type}
          />
        </Box>
          <Button 
            variant="outline" 
            colorScheme="teal" 
            size="sm" 
            flex={2} 
            onClick={(e) => {
              e.stopPropagation();  // Prevent modal from opening when this button is clicked
              onOpenModal(item);
            }}
          >
            View Details
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MediaCard;
