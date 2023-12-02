import React from 'react';
import { Box, Image, Flex, Heading, Text, Button } from '@chakra-ui/react';

const FeaturedRelease = ({ item }) => {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} align="start" my={4}>
      <Box flexShrink={0}>
        <Image
          src={`${process.env.PUBLIC_URL}9780143108245.jpeg`} // Replace with your image source
          alt="featured release"
          htmlWidth="180px" // Adjust width as needed
          htmlHeight="auto" // Adjust height as needed
          objectFit="contain" // Adjust object fit as needed
        />
      </Box>
      <Box flex="1" ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }}>
        <Heading as="h3" size="lg" mb={2}>
          Featured Release
        </Heading>
        <Text fontSize="md" noOfLines={{ base: 4, md: 6 }}>
          {"The portrayal of Stephen Dedalus's Dublin childhood and youth, his quest for identity through art and his gradual emancipation from the claims of family, religion and Ireland itself, is also an oblique self-portrait of the young James Joyce and a universal testament to the artist's 'eternal imagination'. Both an insight into Joyce's life and childhood, and a unique work of modernist fiction, A Portrait of the Artist as a Young Man is a novel of sexual awakening, religious rebellion and the essential search for voice and meaning that every nascent artist must face in order to blossom fully into themselves."} // Limit the number of lines to reduce height
        </Text>
        <Flex mt={4}>
          <Button colorScheme="teal" mr={2}>Add to Watchlist</Button>
          <Button variant="outline" colorScheme="teal">View Details</Button>
        </Flex>
      </Box>
    </Flex>
  );
};


export default FeaturedRelease;