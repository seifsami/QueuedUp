import React from 'react';
import { Box, Flex, Text, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box 
        as="footer" 
        bg="#289776"  // Slightly darker than the header
        color="white" 
        py={3} 
        mt={8} 
        boxShadow="0 -4px 6px rgba(0, 0, 0, 0.1)"  // Soft shadow for depth
    >

      <Flex direction="column" align="center" justify="center">
        <Text fontSize="sm" mb={1}>
          Have questions? Reach out to us at{' '}
          <Link 
            href="mailto:contact@queuedup.co" 
            color="white" 
            _hover={{ textDecoration: 'underline' }}
          >
            contact@queuedup.co
          </Link>
        </Text>

        <Text fontSize="xs" color="gray.100">
          © {new Date().getFullYear()} QueuedUp. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
