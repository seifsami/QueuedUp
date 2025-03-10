import React from 'react';
import { Box, Image, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import NotifyMeButton from './NotifyMeButton';

const FeaturedRelease = ({ item, userWatchlist, refetchWatchlist, mediaType }) => {
  const navigate = useNavigate();
  
  if (!item) return null;

  // 🚀 Click handler to navigate to MediaDetailPage
  const handleNavigate = () => {
    if (item.slug) {
      navigate(`/media/${item.media_type}/${item.slug}`);
    } else {
      console.error("❌ Missing slug for item:", item);
    }
  };

  return (
    // Entire card is clickable and navigates to the details page
    <Box
      bg="brand.200"
      borderRadius="xl"
      boxShadow="lg"
      p={{ base: 3, md: 6 }}
      mx="auto"
      maxW={{ base: '350px', md: '1200px' }}  // Mobile: up to 350px, desktop: up to 1200px
      mt={2}
      transition="box-shadow 0.3s"
      _hover={{ boxShadow: "0px 8px 16px rgba(0,0,0,0.6)", cursor: "pointer" }}
      onClick={handleNavigate}  // ✅ Clicking the card navigates
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
            objectFit="cover"
            boxShadow="0px 12px 24px rgba(0, 0, 0, 0.8)"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.03)" }}
          />
        </Box>

        {/* Content Section */}
        <Box flex="1" textAlign={{ base: 'center', md: 'left' }} mt={{ base: 2, md: 0 }}>
          <Heading as="h3" size="xl" mb={4}>
            {item.title || "Featured Release"}
          </Heading>
          <Text fontSize="md" color="gray.700" noOfLines={{ base: 3, md: 6 }} mb={4}>
            {item.description || "No description available."}
          </Text>

          {/* Button Row */}
          <Flex justify={{ base: 'center', md: 'flex-start' }} gap={{ base: 3, md: 4 }}>
            {/* Notify Me Button */}
            <Box flex="1" onClick={(e) => e.stopPropagation()}>
              <NotifyMeButton
                item={item}
                userWatchlist={userWatchlist}
                refetchWatchlist={refetchWatchlist}
                mediaType={mediaType || item.media_type}
                buttonProps={{
                  size: { base: 'sm', md: 'md' },
                  px: { base: 4, md: 6 },
                  width: "100%",
                }}
              />
            </Box>

            {/* View Details Button (also navigates) */}
            <Box flex="1" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="outline" 
                borderColor="brand.100"
                color="brand.100"
                bg="white"
                _hover={{ bg: 'gray.100', color: 'brand.100', borderColor: 'brand.100' }}
                _active={{ bg: 'gray.200', color: 'brand.500', borderColor: 'brand.100' }}
                size={{ base: 'sm', md: 'md' }}
                px={{ base: 4, md: 6 }}
                width="100%"
                onClick={handleNavigate}  // ✅ Clicking button also navigates
              >
                View Details
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default FeaturedRelease;
