import React from 'react';
import { Box, Image, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { FaBell, FaInfoCircle } from 'react-icons/fa';

const defaultImages = {
  books: "/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

const MediaCardMobile = ({ item, onOpenModal }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
      w="140px"
      h="220px"   // Reduced height for better fit
      m="0 4px"
      onClick={() => onOpenModal(item)}
    >
      {/* Image Section */}
      <Box height="140px">
        <Image
          src={item.image || defaultImages[item.media_type || "books"]}
          alt={item.title}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>

      {/* Content Section */}
      <VStack align="start" p={1} spacing={0.5}>
        {/* Title */}
        <Text fontWeight="bold" fontSize="xs" noOfLines={1}>
          {item.title}
        </Text>

        {/* Release Date */}
        <Text fontSize="xs" color="gray.600">
          {new Date(item.release_date).toLocaleDateString('en-US')}
        </Text>

        {/* Action Icons */}
        <HStack justifyContent="space-between" width="full" pt={0.5}>
          {/* Add to Watchlist Icon */}
          <Icon
            as={FaBell}
            boxSize={3.5}   // Slightly smaller icons
            color="brand.100"
            onClick={(e) => {
              e.stopPropagation();  // Prevent card click
            }}
          />

          {/* View Details Icon */}
          <Icon
            as={FaInfoCircle}
            boxSize={3.5}
            color="brand.100"
            onClick={(e) => {
              e.stopPropagation();  // Prevent card click
              onOpenModal(item);
            }}
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default MediaCardMobile;
