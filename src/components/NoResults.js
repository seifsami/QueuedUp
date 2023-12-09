// NoResults.js
import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import RequestNowButton from './RequestNowButton';

const NoResults = () => {
  return (
    <Box textAlign="center" p={4} boxShadow="base" borderRadius="lg">
      <Heading size="lg" mb={2}>No Results Found</Heading>
      <Text mb={4}>We couldn't find anything matching your search criteria.</Text>
      <RequestNowButton />
    </Box>
  );
};

export default NoResults;
