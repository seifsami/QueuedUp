import React, { useRef, useState, useEffect } from 'react';
import { Flex, Box, IconButton, Icon } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MediaCard from './MediaCard';

const Carousel = ({ items }) => {
  const scrollContainer = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const imageHeight = 338

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
    <Flex alignItems="center" my={4} pos="relative"> {/* Add relative positioning */}
      <Box ref={scrollContainer} overflowX="scroll" flex="1">
        <Flex>
          {items.map((item, index) => (
            <Box key={item.id} width="220px" minW="220px" mx="8px">
              <MediaCard item={item} />
            </Box>
          ))}
        </Flex>
      </Box>

      {!isAtStart && (
        <IconButton
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          icon={<FaChevronLeft size="24px" />} // Adjust size as needed
          position="absolute" // Absolute positioning
          left="0" // Align to the left edge
          top={`calc(${imageHeight / 2}px - 12px)`} // Half of the image height minus half of the icon size
          transform="translateX(-50%)" // Center horizontally
          zIndex={2} // Ensure it's above other content
          bg="rgba(255, 255, 255, 0.5)" // Slightly transparent background
          _hover={{ bg: 'rgba(255, 255, 255, 0.8)' }} // More opaque on hover
          size="lg" // Larger button size
        />
      )}

      {!isAtEnd && (
        <IconButton
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          icon={<FaChevronRight size="24px" />} // Adjust size as needed
          position="absolute" // Absolute positioning
          right="0" // Align to the right edge
          top={`calc(${imageHeight / 2}px - 12px)`} // Half of the image height minus half of the icon size
          transform="translateX(50%)" // Center horizontally
          zIndex={2} // Ensure it's above other content
          bg="rgba(255, 255, 255, 0.5)" // Slightly transparent background
          _hover={{ bg: 'rgba(255, 255, 255, 0.8)' }} // More opaque on hover
          size="lg" // Larger button size
          p={1}
        />
      )}
    </Flex>
  );
};

export default Carousel;
