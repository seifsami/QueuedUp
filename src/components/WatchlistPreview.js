import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import WatchlistPreviewCard from './WatchlistPreviewCard';

const WatchlistPreview = ({ watchlist }) => {
  return (
    <Box my={4} bg="gray.50" p={4} borderRadius="lg">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        My Tracking list
      </Text>
      <VStack spacing={4} align="stretch">
        {watchlist.map((item) => (
          <WatchlistPreviewCard
            key={item.id}
            item={item}
            onClick={() => {/* handle click, navigate to detail page */}}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default WatchlistPreview;
