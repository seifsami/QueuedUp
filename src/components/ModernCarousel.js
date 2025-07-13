import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  IconButton,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ModernMediaCard from './ModernMediaCard';

const ModernCarousel = ({ 
  title, 
  items, 
  userWatchlist, 
  refetchWatchlist,
  cardSize = 'md',
  showViewAll = false,
  onViewAll
}) => {
  const scrollContainer = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonShadow = useColorModeValue(
    '0 4px 12px rgba(0, 0, 0, 0.15)',
    '0 4px 12px rgba(0, 0, 0, 0.3)'
  );

  const checkScrollPosition = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition, { passive: true });
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [items]);

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const cardWidth = cardSize === 'sm' ? 180 : cardSize === 'lg' ? 260 : 220;
      const scrollAmount = direction * (cardWidth + 16);
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <Box py={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} px={{ base: 4, md: 6 }}>
        <Text
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="800"
          letterSpacing="-0.02em"
        >
          {title}
        </Text>
        
        {showViewAll && (
          <Text
            color="brand.500"
            fontSize="md"
            fontWeight="600"
            cursor="pointer"
            onClick={onViewAll}
            _hover={{ color: 'brand.600' }}
          >
            View All
          </Text>
        )}
      </Flex>

      {/* Carousel */}
      <Box position="relative" px={{ base: 4, md: 6 }}>
        {/* Left Arrow */}
        {canScrollLeft && (
          <IconButton
            icon={<FaChevronLeft />}
            position="absolute"
            left="2"
            top="50%"
            transform="translateY(-50%)"
            zIndex="2"
            bg={buttonBg}
            boxShadow={buttonShadow}
            borderRadius="full"
            size="lg"
            onClick={() => scroll(-1)}
            _hover={{
              transform: 'translateY(-50%) scale(1.05)',
            }}
            aria-label="Scroll left"
          />
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <IconButton
            icon={<FaChevronRight />}
            position="absolute"
            right="2"
            top="50%"
            transform="translateY(-50%)"
            zIndex="2"
            bg={buttonBg}
            boxShadow={buttonShadow}
            borderRadius="full"
            size="lg"
            onClick={() => scroll(1)}
            _hover={{
              transform: 'translateY(-50%) scale(1.05)',
            }}
            aria-label="Scroll right"
          />
        )}

        {/* Cards Container */}
        <Box
          ref={scrollContainer}
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          <HStack spacing={4} pb={2}>
            {items.map((item) => (
              <Box key={item._id} flexShrink={0}>
                <ModernMediaCard
                  item={item}
                  userWatchlist={userWatchlist}
                  refetchWatchlist={refetchWatchlist}
                  size={cardSize}
                />
              </Box>
            ))}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ModernCarousel;