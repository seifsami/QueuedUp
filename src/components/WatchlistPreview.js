import React from 'react';
import { Box, VStack, Text, Flex, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import WatchlistPreviewCard from './WatchlistPreviewCard';

const formatMediaType = (mediaType) => {
  if (!mediaType) return 'Media';  // Default label when no mediaType is provided

  switch (mediaType) {
    case 'books':
      return 'Books';
    case 'movies':
      return 'Movies';
    case 'tv_seasons':
      return 'TV Shows';
    default:
      return mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
  }
};


const WatchlistPreview = ({ watchlist = [], mediaType }) => {  // Default to empty array
  const navigate = useNavigate();
  const filteredWatchlist = mediaType
  ? watchlist.filter((item) => item.media_type === mediaType)
  : watchlist;
  

  return (
    <Box 
      my={4} 
      ml={4}
      bg="white" 
      p={4} 
      borderRadius="lg" 
      border="1px solid" 
      borderColor="gray.200"
      boxShadow="md"  // Subtle border for separation
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" flex="1">
        My {formatMediaType(mediaType)} Tracking List
        </Text>
        <Button colorScheme="teal" onClick={() => navigate('/watchlist')} size="sm">
          View More
        </Button>
      </Flex>
      <VStack spacing={4} align="stretch">
        {filteredWatchlist.length > 0 ? (
          filteredWatchlist.map((item) => (
            <WatchlistPreviewCard key={item.id || item._id} item={item} />
          ))
        ) : (
          <Text>No items in your {formatMediaType(mediaType)} watchlist yet!</Text>

        )}
      </VStack>
    </Box>
  );
};

export default WatchlistPreview;
