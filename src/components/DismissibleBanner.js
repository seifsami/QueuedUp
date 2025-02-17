import React, { useState, useEffect } from 'react';
import { Box, Text, CloseButton, Slide, Flex, useBreakpointValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Subtle pulse for emoji
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const DismissibleBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem('bannerDismissed') === 'true';

    if (!hasDismissed) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    }
  }, []);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('bannerDismissed', 'true');
  };

  return (
    <Slide direction="top" in={isVisible} style={{ zIndex: 99 }}>
      <Box
        bg="#FAF3E0"
        color="#333"
        boxShadow="md"
        px={6}
        py={3}
        fontSize={{ base: "14px", md: "16px" }}
        fontWeight="bold"
        textAlign="center"
        borderRadius="md"
        maxW="1200px"
        mx="auto"
        mt={4} // ✅ Moves it down so it doesn't cover the search bar
      >
        <Flex align="center" justify="space-between">
          {/* Emoji with subtle animation */}
          <Text as="span" animation={`${pulse} 1.5s ease-in-out infinite alternate`} mr={2}>
            📢
          </Text>

          {/* Main text (Centered) */}
          <Text flex="1" textAlign="center">
            Stay Ahead of New Releases! Add books, TV shows, and movies to your watchlist &{" "}
            <Text as="span" color="#1D4E2D" fontWeight="extrabold">
              get reminders when they drop.
            </Text>
          </Text>

          {/* Close Button - Now correctly aligned */}
          <CloseButton
            onClick={handleDismiss}
            color="red.500"
            boxSize={5}
            ml={2}
            _hover={{ transform: "scale(1.2)", transition: "0.2s", cursor: "pointer" }}
          />
        </Flex>
      </Box>
    </Slide>
  );
};

export default DismissibleBanner;
