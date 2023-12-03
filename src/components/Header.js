import React from 'react';
import { Flex, Box, InputGroup, Input, InputLeftElement, Icon, IconButton, useColorMode, Text } from '@chakra-ui/react';
import { FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import SearchBar from './SearchBar';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      p={4}
      bg="brand.100"
      color="white"
      align="center"
      justify="space-between"
      wrap="wrap"
    >
      {/* Logo and Title */}
      <Box flexShrink={0}>
        <Text fontSize="2xl" fontWeight="bold">
          QueuedUp
        </Text>
      </Box>

      {/* Search Bar */}
      <Flex flex={1} minW={0} mx={4}> {/* This Flex wrapper allows the search bar to grow */}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search for TV shows, movies, books..."
            variant="filled"
            _placeholder={{ color: 'gray.500' }}
          />
        </InputGroup>
      </Flex>

      {/* Theme Toggle Button */}
      <IconButton
        size="lg"
        variant="ghost"
        color="white"
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      />
    </Flex>
  );
};

export default Header;
