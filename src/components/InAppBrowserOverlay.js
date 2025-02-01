// components/InAppBrowserOverlay.js
import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { isInAppBrowser } from '../utils/browserHelpers';

const InAppBrowserOverlay = () => {
  if (!isInAppBrowser()) return null;  // Only show if in an in-app browser

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg="rgba(0, 0, 0, 0.8)"
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
      p={4}
    >
      <Text fontSize="2xl" mb={4} textAlign="center">
        Please open this link in your browser for the best experience.
      </Text>
      <Button
        colorScheme="teal"
        size="lg"
        onClick={() => {
          alert('Please tap the three dots in the corner and select "Open in Browser"');
        }}
      >
        How to Open in Browser
      </Button>
    </Box>
  );
};

export default InAppBrowserOverlay;
