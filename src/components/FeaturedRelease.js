import React from 'react';
import { Box, Image, Flex, Heading, Text, Button } from '@chakra-ui/react';


const FeaturedRelease = ({ item }) => {
  
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify={{ md: 'space-between' }} // Spread content on desktop
      my={{ base: 4, md: 0 }}
      textAlign={{ base: 'center', md: 'left' }} // Center text on mobile
    >
      <Box
        flexShrink={0}
        display="flex"
        justifyContent="center"
        width={{ md: '30%' }} // Control width on desktop
        mb={{ base: 4, md: 0 }} // Margin bottom on mobile only
        p={2} // Padding to prevent image from touching the edges
      >
        <Image
          src={`${process.env.PUBLIC_URL}9780143108245.jpeg`}
          alt="featured release"
          maxWidth="100%" // Ensure image is not bigger than its container
          height="auto"
          maxHeight={{ base: "300px", md: "350px" }}
          objectFit="contain"
        />
      </Box>
      <Box
        flex="1"
        p={{ base: 4, md: 4 }} // Padding for text on all sides
        maxW={{ base: 'auto', md: '70%' }} // Control width on desktop
      >
        <Heading as="h3" size="lg" mb={2}>
          Featured Release
        </Heading>
        <Text fontSize="md" noOfLines={{ base: 3, md: 6 }}>
          {"The portrayal of Stephen Dedalus's Dublin childhood and youth, his quest for identity through art and his gradual emancipation from the claims of family, religion and Ireland itself, is also an oblique self-portrait of the young James Joyce and a universal testament to the artist's 'eternal imagination'. Both an insight into Joyce's life and childhood, and a unique work of modernist fiction, A Portrait of the Artist as a Young Man is a novel of sexual awakening, religious rebellion and the essential search for voice and meaning that every nascent artist must face in order to blossom fully into themselves."}
        </Text>
        <Flex
          justify={{ base: 'center', md: 'start' }} // Center buttons on mobile
          mt={{ base: 4, md: 4 }} // Space from text to buttons
        >
          <Button colorScheme="teal" mr={2}>Add to Watchlist</Button>
          <Button variant="outline" colorScheme="teal">View Details</Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default FeaturedRelease;
