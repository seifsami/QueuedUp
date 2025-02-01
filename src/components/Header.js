import React, {useState} from 'react';
import { Flex, Box, Icon, useBreakpointValue, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useModal } from '../ModalContext'
import firebase from '../firebaseConfig'; 
import { FaSearch } from 'react-icons/fa'


const Header = ({ searchQuery: initialSearchQuery, user }) => {
  const { openModal, currentUser } = useModal();
  console.log("Current User in Header:", currentUser);
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchBarFocused, setSearchBarFocused] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      // Optionally, redirect the user after successful logout
       // Replace '/login' with the path to your login page
    } catch (error) {
      console.error("Logout Error", error);
      // Handle any errors here, such as showing an error message to the user
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
      {/* Logo: Always Visible on Desktop, Conditional on Mobile */}
      {(!(isMobile && (isSearchBarFocused || showMobileSearch))) && (
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
  
      {/* Search Bar or Search Icon Based on Mobile/Focus */}
      {isMobile ? (
        showMobileSearch ? (
          <SearchBar
            mediaType={mediaType}
            setMediaType={setMediaType}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            suggestions={suggestions}
            focusOnMount={true}
            onFocusChange={(focused) => {
              setSearchBarFocused(focused);
              if (!focused) setShowMobileSearch(false);
            }}
          />
        ) : (
          <Flex align="center" ml="auto">
            <Icon 
              as={FaSearch} 
              boxSize={7}  
              onClick={() => setShowMobileSearch(true)} 
              cursor="pointer" 
              color="white"
            />
            {/* Profile Icon: Show Only on Mobile */}
            {currentUser && (
              <Menu>
                <MenuButton 
                  as={Avatar} 
                  size="sm"  
                  bg={"brand.500"} 
                  color={"white"} 
                  src='none' 
                  _hover={{ cursor: 'pointer' }} 
                  ml={3} 
                />
                <MenuList p={0}>
                  <MenuItem color={"black"} onClick={() => navigate('/profile')}>View Profile</MenuItem>
                  <MenuDivider />
                  <MenuItem color={"black"} onClick={() => navigate('/watchlist')}>View Watchlist</MenuItem>
                  <MenuDivider />
                  <MenuItem color={"black"} onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
            {!currentUser && (
              <Button onClick={handleLoginClick} size="sm" ml={3}>Sign In</Button>
            )}
          </Flex>
        )
      ) : (
        <SearchBar
          mediaType={mediaType}
          setMediaType={setMediaType}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          suggestions={suggestions}
          onFocusChange={handleSearchBarFocusChange}
        />
      )}
  
      {/* Profile Icon: Show Only on Desktop */}
      {(!isMobile && (!isSearchBarFocused && !showMobileSearch)) && (
        currentUser ? (
          <Menu>
            <MenuButton 
              as={Avatar} 
              size="md"  
              bg={"brand.500"} 
              color={"white"} 
              src='none' 
              _hover={{ cursor: 'pointer' }} 
            />
            <MenuList p={0}>
              <MenuItem color={"black"} onClick={() => navigate('/profile')}>View Profile</MenuItem>
              <MenuDivider />
              <MenuItem color={"black"} onClick={() => navigate('/watchlist')}>View Watchlist</MenuItem>
              <MenuDivider />
              <MenuItem color={"black"} onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button onClick={handleLoginClick} size="sm">Sign In</Button>
        )
      )}
    </Flex>
  );
  
  
};


export default Header;