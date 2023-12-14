import React, { useState } from 'react';
import { Flex, Box, InputGroup, Input, Link,  Button, InputLeftElement, Icon, IconButton, useColorMode, Text, useBreakpointValue } from '@chakra-ui/react';
import {FaSearch, FaUser, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProfilePage from '../pages/ProfilePage';



const Header = ({ searchQuery: initialSearchQuery }) => {
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchBarFocused, setSearchBarFocused] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  const handleHomeClick = () => {
    navigate('/homepage'); // Navigate to the home page
  };

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
        <Button 
          fontSize="2xl" 
          fontWeight="bold" 
          variant="ghost" 
          color="white" 
          onClick={handleHomeClick}
          _hover={{ bg: 'transparent' }} 
          _active={{ bg: 'transparent' }}
        >
          QueuedUp
        </Button>
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

    {/* Profile Icon */}
    <IconButton
      icon={<FaUser />}
      variant="ghost"
      aria-label="Profile"
      size="lg"
      color="white"
      onClick={handleProfileClick}
    />
      
  </Flex>
  );
};

export default Header;

/*<IconButton
        size="lg"
        variant="ghost"
        color="white"
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      />*/