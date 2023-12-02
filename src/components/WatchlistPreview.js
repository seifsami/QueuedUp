import React from 'react';
import { Box, VStack, Image, Text, Button, HStack } from '@chakra-ui/react';

const WatchlistPreview = ({ watchlist }) => {
  return (
    <Box my={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        My Tracking list
      </Text>
      <VStack spacing={4} align="stretch">
        {watchlist.map((item) => (
          <HStack key={item.id} p={2} shadow="md" borderWidth="1px" borderRadius="lg"> {/* Reduced padding */}
            <Image
              src={`${process.env.PUBLIC_URL}51J4VWwlmvL.jpg`} // Adjust with actual thumbnail path
              alt={item.title}
              htmlWidth="80px" // Adjusted width for smaller image
              htmlHeight="auto" // Adjust height automatically
              objectFit="contain" // Added to maintain aspect ratio
              borderRadius="md"
            />
            <Box flex="1" pl={2}> {/* Reduced left padding inside the box */}
              <Text fontWeight="bold" isTruncated>{item.title}</Text>
              <Text fontSize="sm">{item.status}</Text>
            </Box>
            <Button colorScheme="teal" variant="outline" size="sm">View</Button> {/* Adjusted button size */}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default WatchlistPreview;
