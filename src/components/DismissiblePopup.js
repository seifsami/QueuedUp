import React, { useState, useEffect } from 'react';
import { Box, Text, CloseButton, Fade, Flex } from '@chakra-ui/react';

const DismissiblePopup = () => {
  const [isVisible, setIsVisible] = useState(true);  // True for testing

  useEffect(() => {
    // Comment out for testing
    /*
    const hasSeenHint = localStorage.getItem('hintDismissed') === 'true';

    if (!hasSeenHint) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      const hideTimer = setTimeout(() => {
        handleDismiss();
      }, 7000); // 2s delay + 5s visible

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    */
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hintDismissed', 'true');
  };

  return (
    <Fade 
      in={isVisible} 
      transition={{ enter: { duration: 0.5 }, exit: { duration: 0.5 } }}
      style={{ background: 'transparent' }}
    >
      <Box
        position="fixed"
        bottom={{ base: "20px", md: "40px" }}
        right={{ base: "50%", md: "40px" }}
        transform={{ base: "translateX(50%)", md: "none" }}
        maxW={{ base: "500px", md: "300px" }}
        bg="rgba(46, 139, 87, 0.9)"  // brand.100 with opacity
        boxShadow="lg"
        borderRadius="md"
        p={{ base: 1, md: 3 }}
        zIndex={1000}
      >
        <Flex
          align="center"
          justify="space-between"
          gap={2}
        >
          <Text
            fontSize="13px"
            color="white"
            pr={2}
            lineHeight="1.3"
          >
            Stay Ahead of New Releases! Add books, TV shows, and movies to your watchlist & get reminders when they drop
          </Text>
          <CloseButton
            size="sm"
            color="white"
            onClick={handleDismiss}
            _hover={{ color: "brand.200" }}
          />
        </Flex>
      </Box>
    </Fade>
  );
};

export default DismissiblePopup;
