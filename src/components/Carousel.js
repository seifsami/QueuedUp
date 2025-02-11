import React, { useRef, useState, useEffect } from 'react';
import { Flex, Box, IconButton } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MediaCard from './MediaCard';

const Carousel = ({ items, onOpenModal, userWatchlist, refetchWatchlist }) => {
  const scrollContainer = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const imageHeight = 338;
 


  const checkScrollPosition = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainer.current;
    container.addEventListener('scroll', checkScrollPosition, { passive: true });
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const cardWidth = 220; // Width of MediaCard (including margins)
  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = direction * (cardWidth + 16); // Scroll by one card width plus margin
      scrollContainer.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <Flex alignItems="center" my={4} pos="relative">
      <Box ref={scrollContainer} overflowX="scroll" flex="1">
        <Flex>
          {items.map((item) => (
            <Box key={item._id} width="220px" minW="220px" mx="8px">
              <MediaCard
                item={item}
                onOpenModal={onOpenModal}
                userWatchlist={userWatchlist}  // Pass watchlist to MediaCard
                refetchWatchlist={refetchWatchlist}  // Pass refetch function to MediaCard
              />
            </Box>
          ))}
        </Flex>
      </Box>
      {!isAtStart && (
        <IconButton
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          icon={<FaChevronLeft size="24px" />}
          position="absolute"
          left="0"
          top={`calc(${imageHeight / 2}px - 12px)`}
          transform="translateX(-50%)"
          zIndex={2}
          bg="rgba(255, 255, 255, 0.5)"
          _hover={{ bg: 'rgba(255, 255, 255, 0.8)' }}
          size="lg"
        />
      )}
      {!isAtEnd && (
        <IconButton
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          icon={<FaChevronRight size="24px" />}
          position="absolute"
          right="0"
          top={`calc(${imageHeight / 2}px - 12px)`}
          transform="translateX(50%)"
          zIndex={2}
          bg="rgba(255, 255, 255, 0.5)"
          _hover={{ bg: 'rgba(255, 255, 255, 0.8)' }}
          size="lg"
          p={1}
        />
      )}
    </Flex>
  );
};

export default Carousel;