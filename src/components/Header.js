import React from 'react';
import { Flex, HStack, Text, Button, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('brand.100', 'gray.700');
  const color = useColorModeValue('white', 'white');

  return (
    // Using `mx` to set the margin on the x-axis to '-mx' (negative max value of margin)
    // to effectively cancel out any inherited margin from parent elements.
    <Flex bg={bg} justifyContent="space-between" alignItems="center" p={4} wrap="wrap">
      <HStack spacing={2}>
        <Text fontSize="2xl" fontWeight="bold" color={color}>
          QueuedUp
        </Text>
        <Text fontSize="md" color={color} opacity="0.8">
          -- Your personalized release radar
        </Text>
      </HStack>
      <HStack spacing={2}>
        <Button colorScheme="teal">Login</Button>
        <Button colorScheme="orange">Register</Button>
        <IconButton
          size="lg"
          variant="ghost"
          color={color}
          onClick={toggleColorMode}
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        />
      </HStack>
    </Flex>
  );
};

export default Header;
