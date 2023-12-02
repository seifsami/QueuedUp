import React from 'react';
import { SimpleGrid, Box, Text  } from '@chakra-ui/react';
import MediaCard from './MediaCard';

const TrendingNow = ({ trending }) => {
    // ...similar structure for TrendingNow
    return (
        
        <Box my={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Trending</Text>
        <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={5}>
        {trending.map((trending) => (
          <MediaCard key={trending.id} item={trending} />
        ))}
      </SimpleGrid>
      </Box>
    );
  };


export default TrendingNow;
