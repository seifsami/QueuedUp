import React from 'react';
import { Box, VStack, Text, Flex, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import WatchlistPreviewCard from './WatchlistPreviewCard';

const WatchlistPreview = ({ watchlist }) => {
  const navigate = useNavigate();

  return (
    <Box my={4} bg="gray.50" p={4} borderRadius="lg">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" flex="1">
          My Tracking list
        </Text>
        <Button
          colorScheme="teal"
          onClick={() => navigate('/watchlist')}
          size="sm" // Smaller button size
        >
          View More
        </Button>
      </Flex>
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
