import React from 'react';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import MediaCard from './MediaCard';

const UpcomingReleases = ({ releases }) => {
    return (
        
        <Box my={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Upcoming Releases</Text>
        <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={5}>
        {releases.map((release) => (
          <MediaCard key={release.id} item={release} />
        ))}
      </SimpleGrid>
      </Box>
    );
  };


export default UpcomingReleases;
