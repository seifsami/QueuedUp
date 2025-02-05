import React from 'react';
import { Box, Flex, Text, Link, useTheme } from '@chakra-ui/react';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box 
      as="footer" 
      bg="brand.100"  // Using the primary color from the theme
      color="white" 
      py={4} 
      mt={8} 
      boxShadow="0 -4px 6px rgba(0, 0, 0, 0.1)"  // Soft shadow for depth
    >
      <Flex direction="column" align="center" justify="center">
        <Text fontSize="sm" mb={2} fontWeight="400">
          Have questions? Reach out to us at{' '}
          <Link 
            href="mailto:contact@queuedup.co" 
            color="brand.400"  // Using a lighter brand color for contrast
            _hover={{ 
              textDecoration: 'underline', 
              color: 'brand.300',  // Accent color on hover 
              transition: 'color 0.2s ease' 
            }}
          >
            contact@queuedup.co
          </Link>
        </Text>

        <Text fontSize="xs" color="gray.100" fontWeight="300">
          © {new Date().getFullYear()} QueuedUp. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
