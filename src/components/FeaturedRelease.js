import React from 'react';
import { Box, Image, Flex, Heading, Text, Button } from '@chakra-ui/react';
import NotifyMeButton from './NotifyMeButton';

const FeaturedRelease = ({ 
  item, 
  onViewDetails, 
  userWatchlist, 
  refetchWatchlist, 
  mediaType 
}) => {
  if (!item) return null;

  return (
    <Box
      bg="brand.200"
      borderRadius="xl"
      boxShadow="md"
      p={{ base: 2, md: 6 }}
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
          width={{ base: '85%', md: '35%' }}
          mt={{ base: 2, md: 0 }}
        >
          <Image
            src={item.image || `${process.env.PUBLIC_URL}/default-image.jpeg`}
            alt={item.title || "Featured Release"}
            borderRadius="lg"
            maxW="100%"
            maxHeight={{ base: "280px", md: "350px" }}
            objectFit="contain"
            boxShadow="lg"
          />
        </Box>

        {/* Content Section */}
        <Box
          flex="1"
          textAlign={{ base: 'center', md: 'left' }}
          mt={{ base: 2, md: 0 }}
        >
          <Heading as="h3" size="lg" mb={2}>
            {item.title || "Featured Release"}
          </Heading>
          <Text fontSize="md" color="gray.700" noOfLines={{ base: 3, md: 6 }} mb={3}>
            {item.description || "No description available."}
          </Text>

          {/* Buttons */}
          <Flex
            justify={{ base: 'center', md: 'flex-start' }}
            gap={{ base: 2, md: 3 }}
          >
            <NotifyMeButton
              item={item}
              userWatchlist={userWatchlist}
              refetchWatchlist={refetchWatchlist}
              mediaType={mediaType || item.media_type}
              buttonProps={{
                size: { base: 'sm', md: 'md' },
                px: { base: 4, md: 6 }
              }}
            />
            <Button
              variant="outline"
              borderColor="brand.100"
              color="brand.100"
              bg="white"
              _hover={{
                bg: 'gray.100',
                color: 'brand.100',
                borderColor: 'brand.100',
              }}
              _active={{
                bg: 'gray.200',
                color: 'brand.500',
                borderColor: 'brand.100',
              }}
              size={{ base: 'sm', md: 'md' }}
              px={{ base: 4, md: 6 }}
              onClick={() => onViewDetails && onViewDetails(item)}
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
