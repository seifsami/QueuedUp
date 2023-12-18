import React, { useState, useEffect, useRef } from 'react';
import { Flex, Box, InputGroup, Input, Link,  Button, InputLeftElement, Icon, IconButton, useColorMode, Text, useBreakpointValue, Button, Avatar, useRadioGroup } from '@chakra-ui/react';
import {FaSearch, FaUser, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useModal } from '../ModalContext'
import { FaUserCircle } from 'react-icons/fa';
import ProfilePage from '../pages/ProfilePage';



const Header = ({ searchQuery: initialSearchQuery, user }) => {
  const { openModal, currentUser } = useModal();
  console.log("Current User in Header:", currentUser);
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

  const handleLoginClick = () => {
    console.log("Login button clicked");
    openModal();
  };

  const handleProfileClick = () => {
    console.log("profile clicked");
    
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

    {/* Conditionally render Theme Toggle Button based on focus and device type */}
    {(!isSearchBarFocused || !isMobile) && (
  currentUser ? (
    <Avatar bg={"brand.500"} color={"white"}  name='Seif Sami' src='none' />
  ) : (
    <Button onClick={handleLoginClick} size="sm">Sign In </Button>
  )
)}
  </Flex>
  );
};


export default Header;