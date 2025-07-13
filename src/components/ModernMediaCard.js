import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useColorModeValue,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaEye, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifyMeButton from './NotifyMeButton';

const defaultImages = {
  books: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

const ModernMediaCard = ({ item, userWatchlist, refetchWatchlist, size = 'md' }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const sizes = {
    sm: { w: '160px', h: '240px', imageH: '180px' },
    md: { w: '200px', h: '320px', imageH: '240px' },
    lg: { w: '240px', h: '380px', imageH: '280px' },
  };

  const cardSize = sizes[size];

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'TBA';
    }
  };

  const handleCardClick = () => {
    if (item.slug) {
      navigate(`/media/${item.media_type}/${item.slug}`);
    }
  };

  const isInWatchlist = Array.isArray(userWatchlist) &&
    userWatchlist.some((watchlistItem) => watchlistItem.item_id === item._id);

  return (
    <Box
      w={cardSize.w}
      h={cardSize.h}
      bg={bg}
      borderRadius="16px"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      cursor="pointer"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      transform={isHovered ? 'translateY(-8px)' : 'translateY(0)'}
      boxShadow={isHovered ? '0 20px 40px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.05)'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      position="relative"
      _dark={{
        boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Image Container */}
      <Box position="relative" h={cardSize.imageH} overflow="hidden">
        <Image
          src={item.image || defaultImages[item.media_type || "books"]}
          alt={item.title}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.3s ease"
          transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
        />

        {/* Overlay on Hover */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          opacity={isHovered ? 1 : 0}
          transition="opacity 0.3s ease"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={2}>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              View Details
            </Button>
          </VStack>
        </Box>

        {/* Media Type Badge */}
        <Badge
          position="absolute"
          top="3"
          right="3"
          colorScheme="brand"
          fontSize="xs"
          fontWeight="600"
          textTransform="capitalize"
          borderRadius="full"
          px={2}
          py={1}
        >
          {item.media_type?.replace('_', ' ')}
        </Badge>
      </Box>

      {/* Content */}
      <VStack p={4} spacing={3} align="stretch" h={`calc(${cardSize.h} - ${cardSize.imageH})`}>
        {/* Title */}
        <Text
          fontSize="md"
          fontWeight="700"
          lineHeight="1.3"
          noOfLines={2}
          minH="2.6em"
        >
          {item.title}
        </Text>

        {/* Release Date */}
        <HStack spacing={2} color={textColor}>
          <Icon as={FaCalendarAlt} boxSize={3} />
          <Text fontSize="sm" fontWeight="500">
            {formatReleaseDate(item.release_date)}
          </Text>
        </HStack>

        {/* Action Button */}
        <Box onClick={(e) => e.stopPropagation()}>
          <NotifyMeButton
            item={item}
            userWatchlist={userWatchlist}
            refetchWatchlist={refetchWatchlist}
            mediaType={item.media_type}
            buttonProps={{
              variant: isInWatchlist ? 'secondary' : 'primary',
              size: 'sm',
              width: 'full',
              leftIcon: isInWatchlist ? <FaHeart /> : undefined,
            }}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default ModernMediaCard;