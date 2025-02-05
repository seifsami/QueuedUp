import React from 'react';
import { Box, Image, Flex, Heading, Text, Button } from '@chakra-ui/react';

const FeaturedRelease = ({ item }) => {
  return (
    <Box
      bg="brand.200"  // Light Sage Green background for Featured Release
      borderRadius="xl"
      boxShadow="md"
      p={{ base: 2, md: 6 }}  // Reduced padding on mobile to tighten the space
      mx="auto"
      maxW="1200px"
      mt={0}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        gap={6}
      >
        {/* Image Section */}
        <Box
          flexShrink={0}
          display="flex"
          justifyContent="center"
          width={{ base: '85%', md: '35%' }}  // Slightly larger image on mobile
          mt={{ base: 2, md: 0 }}  // Move image closer to top on mobile
        >
          <Image
            src={`${process.env.PUBLIC_URL}9780143108245.jpeg`}
            alt="Featured Release"
            borderRadius="lg"
            maxW="100%"
            maxHeight={{ base: "280px", md: "350px" }}  // Increased image height on mobile
            objectFit="contain"
            boxShadow="lg"
          />
        </Box>

        {/* Content Section */}
        <Box
          flex="1"
          textAlign={{ base: 'center', md: 'left' }}
          mt={{ base: 2, md: 0 }}  // Less spacing on mobile
        >
          <Heading as="h3" size="lg" mb={2}>
            Featured Release
          </Heading>
          <Text fontSize="md" color="gray.700" noOfLines={{ base: 3, md: 6 }} mb={3}>
          The portrayal of Stephen Dedalus's Dublin childhood and youth, his quest for identity through art and his gradual emancipation from the claims of family, religion and Ireland itself, is also an oblique self-portrait of the young James Joyce and a universal testament to the artist's 'eternal imagination'. Both an insight into Joyce's life and childhood, and a unique work of modernist fiction, A Portrait of the Artist as a Young Man is a novel of sexual awakening, religious rebellion and the essential search for voice and meaning that every nascent artist must face in order to blossom fully into themselves.
          </Text>

          {/* Buttons - Horizontal on all devices */}
          <Flex
            justify={{ base: 'center', md: 'flex-start' }}
            gap={{ base: 2, md: 3 }}  // Keep compact gap on mobile
          >
            <Button
              bg="brand.100"  // Muted Green
              color="white"
              _hover={{ bg: '#256B45', boxShadow: 'md', transform: 'translateY(-2px)' }}
              size={{ base: 'sm', md: 'md' }}  // Smaller buttons on mobile
              px={{ base: 4, md: 6 }}
            >
              Add to Watchlist
            </Button>

            <Button
              variant="outline"
              borderColor="brand.100"
              color="brand.100"
              bg="white"
              _hover={{ 
                bg: 'gray.100',           // Light gray background on hover
                color: 'brand.100',       // Keep text Muted Green
                borderColor: 'brand.100',
              }}
              _active={{
                bg: 'gray.200',           // Slightly darker gray when clicked
                color: 'brand.500',       // Darker gray text when clicked
                borderColor: 'brand.100', // Keep the Muted Green border
              }}
              size={{ base: 'sm', md: 'md' }}
              px={{ base: 4, md: 6 }}
            >
              View Details
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default FeaturedRelease;
