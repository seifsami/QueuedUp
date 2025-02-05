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
      onClick={() => onOpenModal(item)}
    >
      <Box 
        height={imageContainerHeight}
        position="relative"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Image
          src={(item.image && item.image !== "none")
                ? item.image
                : defaultImages[item.media_type || "books"]}
          alt={item.title}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>

      <VStack align="start" p={2} spacing="1">
        {/* Increase container height to ensure title isn’t cut off */}
        <Box w="full" h="3.5rem" overflow="hidden">
          <Text 
            fontSize="lg" 
            fontWeight="bold" 
            noOfLines={2} 
            lineHeight="1.3"
          >
            {item.title}
          </Text>
        </Box>
        <Text fontSize="sm">{formatReleaseDate(item.release_date)}</Text>
        {item.release_date && item.release_date !== 'N/A' ? (
          <Countdown date={formatReleaseDate(item.release_date)} renderer={renderer} />
        ) : (
          <Text fontSize="sm">Coming Soon</Text>
        )}

        <HStack justifyContent="space-between" width="full">
          <Box width="48%" onClick={(e) => e.stopPropagation()}>
            <NotifyMeButton
              item={item}
              userWatchlist={userWatchlist}
              refetchWatchlist={refetchWatchlist}
              mediaType={item.media_type}
              buttonProps={{ width: "100%", size: "sm" }}
            />
          </Box>
          <Box width="48%">
            <Button 
              variant="outline" 
              borderColor="brand.100"
              color="brand.100"
              bg="white"
              _hover={{ 
                bg: 'gray.100',
                color: 'brand.100',
                borderColor: 'brand.100',
              }}
              _active={{
                bg: 'gray.200',
                color: 'brand.500',
                borderColor: 'brand.100',
              }}
              size="sm"
              width="100%"
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(item);
              }}
            >
              View Details
            </Button>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MediaCard;
