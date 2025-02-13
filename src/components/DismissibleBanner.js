import React, { useState, useEffect } from 'react';
import { Box, Text, CloseButton, Flex, useBreakpointValue, SlideFade } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Final bounce animation (Stronger, Snappier)
const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.8); }
  100% { transform: scale(1); }
`;

const DismissibleBanner = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('bannerDismissed') !== 'true';
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('bannerDismissed', 'true');
  };

  return (
    <SlideFade in={isVisible} offsetY="-10px" transition={{ enter: { duration: 0.5 }, exit: { duration: 0.3 } }}>
      {isVisible && (
        <Box
          bg="brand.200"
          color="brand.600"
          px={6}
          py={3}
          fontSize="15px"
          fontWeight="bold"
          textAlign="center"
          boxShadow="sm"
          position={isMobile ? "fixed" : "relative"}
          bottom={isMobile ? "16px" : "auto"}
          left={isMobile ? "50%" : "auto"}
          transform={isMobile ? "translateX(-50%)" : "none"}
          borderRadius={isMobile ? "md" : "none"}
          width={isMobile ? "90%" : "100vw"}
          maxW={isMobile ? "400px" : "100%"}
          zIndex="1000"
          position="relative"
        >
          {/* Corrected text (YOUR EXACT TEXT) */}
          <Text textAlign="center">
            🎉 Welcome to <strong>QueuedUp</strong>! Track upcoming movies, TV shows, and books and get notified when they drop!
          </Text>

          {/* X Button - Now correctly positioned */}
          <CloseButton
            position="absolute"
            right="10px" // Tighter to the edge
            top="50%"
            transform="translateY(-50%)"
            onClick={handleDismiss}
            color="red.500"
            boxSize={6} // Keeping it large enough for clarity
            _hover={{
              animation: `${bounce} 0.25s ease-in-out`,
              cursor: "pointer",
            }}
          />
        </Box>
      )}
    </SlideFade>
  );
};

export default DismissibleBanner;
