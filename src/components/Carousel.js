import React, { useRef, useState, useEffect } from 'react';
import { Flex, Box, IconButton, Icon } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MediaCard from './MediaCard';

const Carousel = ({ items }) => {
  const scrollContainer = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    // Add event listener to check the scroll position when the user scrolls
    const container = scrollContainer.current;
    container.addEventListener('scroll', checkScrollPosition, { passive: true });

    // Clean up the event listener
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
    <Flex alignItems="center" my={4}>
      {!isAtStart && (
        <IconButton
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          icon={<Icon as={FaChevronLeft} />}
          mr={2}
        />
      )}

      <Box ref={scrollContainer} overflowX="scroll" flex="1" mx={-2}>
        <Flex>
          {items.map((item, index) => (
            <Box key={item.id} width="220px" minW="220px" mx="8px">
              <MediaCard item={item} />
            </Box>
          ))}
        </Flex>
      </Box>

      {!isAtEnd && (
        <IconButton
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          icon={<Icon as={FaChevronRight} />}
          ml={2}
        />
      )}
    </Flex>
  );
};

export default Carousel;
