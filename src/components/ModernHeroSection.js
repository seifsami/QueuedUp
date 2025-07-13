import React from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Container,
  Icon,
} from '@chakra-ui/react';
import { FaPlay, FaPlus, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifyMeButton from './NotifyMeButton';

const ModernHeroSection = ({ item, userWatchlist, refetchWatchlist, mediaType }) => {
  const navigate = useNavigate();
  const overlayBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.9) 100%)',
    'linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(31,41,55,0.9) 100%)'
  );

  if (!item) return null;

  const handleNavigate = () => {
    if (item.slug) {
      navigate(`/media/${item.media_type}/${item.slug}`);
    }
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'TBA';
    }
  };

  return (
    <Box
      position="relative"
      h={{ base: '500px', md: '600px', lg: '700px' }}
      overflow="hidden"
      borderRadius={{ base: '0', md: '24px' }}
      mx={{ base: 0, md: 6 }}
      my={{ base: 0, md: 6 }}
    >
      {/* Background Image */}
      <Image
        src={item.image}
        alt={item.title}
        w="full"
        h="full"
        objectFit="cover"
        position="absolute"
        top="0"
        left="0"
      />

      {/* Gradient Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={overlayBg}
      />

      {/* Content */}
      <Container maxW="1400px" h="full" position="relative" zIndex="2">
        <Flex
          h="full"
          align="center"
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 8, lg: 12 }}
          py={{ base: 8, md: 12 }}
        >
          {/* Poster */}
          <Box
            flexShrink={0}
            order={{ base: 2, lg: 1 }}
          >
            <Image
              src={item.image}
              alt={item.title}
              w={{ base: '200px', md: '280px', lg: '320px' }}
              h={{ base: '300px', md: '420px', lg: '480px' }}
              objectFit="cover"
              borderRadius="20px"
              boxShadow="0 25px 50px rgba(0, 0, 0, 0.3)"
              transition="transform 0.3s ease"
              _hover={{ transform: 'scale(1.02)' }}
            />
          </Box>

          {/* Content */}
          <VStack
            align={{ base: 'center', lg: 'start' }}
            spacing={6}
            flex="1"
            textAlign={{ base: 'center', lg: 'left' }}
            order={{ base: 1, lg: 2 }}
          >
            {/* Badge */}
            <Badge
              colorScheme="brand"
              fontSize="sm"
              fontWeight="700"
              px={3}
              py={1}
              borderRadius="full"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Featured Release
            </Badge>

            {/* Title */}
            <Text
              fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
              fontWeight="900"
              lineHeight="1.1"
              letterSpacing="-0.02em"
              maxW="600px"
            >
              {item.title}
            </Text>

            {/* Metadata */}
            <HStack spacing={4} wrap="wrap" justify={{ base: 'center', lg: 'start' }}>
              <HStack spacing={2}>
                <Icon as={FaCalendarAlt} color="gray.500" />
                <Text fontSize="sm" fontWeight="600" color="gray.600">
                  {formatReleaseDate(item.release_date)}
                </Text>
              </HStack>
              
              {item.media_type && (
                <Badge variant="outline" colorScheme="gray" textTransform="capitalize">
                  {item.media_type.replace('_', ' ')}
                </Badge>
              )}
            </HStack>

            {/* Description */}
            {item.description && (
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.600"
                lineHeight="1.6"
                maxW="500px"
                noOfLines={{ base: 3, md: 4 }}
              >
                {item.description}
              </Text>
            )}

            {/* Action Buttons */}
            <HStack spacing={4} pt={2}>
              <NotifyMeButton
                item={item}
                userWatchlist={userWatchlist}
                refetchWatchlist={refetchWatchlist}
                mediaType={mediaType || item.media_type}
                buttonProps={{
                  variant: 'primary',
                  size: 'lg',
                  leftIcon: <FaPlus />,
                  px: 8,
                }}
              />

              <Button
                variant="secondary"
                size="lg"
                leftIcon={<FaPlay />}
                onClick={handleNavigate}
                px={8}
              >
                View Details
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default ModernHeroSection;