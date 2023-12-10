import React, { useState } from 'react';
import { Flex, Box, InputGroup, Input, InputLeftElement, Icon, IconButton, useColorMode, Text, useBreakpointValue } from '@chakra-ui/react';
import { FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import SearchBar from './SearchBar';


const Header = ({ searchQuery: initialSearchQuery }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mediaType, setMediaType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchBarFocused, setSearchBarFocused] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSearchBarFocusChange = (isFocused) => {
    setSearchBarFocused(isFocused);
  };

  const dummyData = [
    // ... your dummy data for search suggestions
  ];

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Filter for suggestions based on the query
    if (query.length > 0) {
      const searchSuggestions = dummyData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(searchSuggestions);
    } else {
      setSuggestions([]);
    }
  };


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
       {(!isSearchBarFocused || !isMobile) && (
      <Box flexShrink={0}>
        <Text fontSize="2xl" fontWeight="bold">
          QueuedUp
        </Text>
      </Box>
    )}

    {/* Search Bar */}
    <SearchBar
      mediaType={mediaType}
      setMediaType={setMediaType}
      searchQuery={searchQuery}
      setSearchQuery={handleSearchChange}
      suggestions={suggestions}
      onFocusChange={handleSearchBarFocusChange}
    />

    {/* Conditionally render Theme Toggle Button based on focus and device type */}
    {(!isSearchBarFocused || !isMobile) && (
      <IconButton
        size="lg"
        variant="ghost"
        color="white"
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      />
    )}
  </Flex>
  );
};

export default Header;