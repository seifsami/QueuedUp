import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Icon,
  Select,
  Button,
  Box,
  Text,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FaSearch } from 'react-icons/fa';
import WatchlistPreviewCard from './WatchlistPreviewCard';
import DetailsModal from './DetailsModal';
import axios from 'axios';

const SearchBar = ({ mediaType, setMediaType, searchQuery, setSearchQuery, onFocusChange, focusOnMount }) => {
  const inputPaddingLeft = useBreakpointValue({ base: '25px', md: '150px' });
  const iconLeftPosition = useBreakpointValue({ base: '-20px', md: '100px' });
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // Live search results
  const [loading, setLoading] = useState(false); // Loading indicator
  const [selectedItem, setSelectedItem] = useState(null);  // Track the selected item
  const [isModalOpen, setModalOpen] = useState(false)
  


  const API_BASE = "https://queuedup-backend-6d9156837adf.herokuapp.com";



  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus(); // Auto-focus input when focusOnMount is true
    }
  }, [focusOnMount]);
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?query=${searchQuery}&type=${mediaType}`);
      
    }
    setShowDropdown(true);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE}/api/search?q=${searchQuery}&type=${mediaType}`
        );
        
        setSearchResults(response.data); // Update the search results
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSearchResults, 300); // Debounce API requests
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, mediaType]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      // Check if the clicked element is part of the dropdown
      if (!event.target.closest('.dropdown-item')) {
        setShowDropdown(false);
      }
    }
  };

  document.addEventListener('mouseup', handleClickOutside);
  return () => {
    document.removeEventListener('mouseup', handleClickOutside);
  };
}, []);
  const viewAllResults = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowDropdown(false);
    navigate(`/search?query=${searchQuery}&type=${mediaType}`);
  };

  const handleBlur = (event) => {
    setTimeout(() => {
      const newFocusElement = document.activeElement;
  
      
  
      // 🔥 If the modal is open, do NOT close the search
      if (document.querySelector('.chakra-modal__content')) {
       
        return;
      }
  
     
      setShowDropdown(false);
      setIsFocused(false);
      onFocusChange(false);
    }, 200); // Small delay to allow modal to take focus first
  };
  
  
  
  
  
  

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange(true);
  };

  const renderGroupedPreviews = () => {
    if (!searchResults.length) {
      return <Text p="4">No results found.</Text>;
    }

    return searchResults.slice(0, 4).map((item) => ( // Show top 6
      <WatchlistPreviewCard
        key={item._id || item.id}
        item={item}
        showDelete={false}
        onClick={() => {
          
          
          if (item.slug) {
            navigate(`/media/${item.media_type}/${item.slug}`);
          } else {
            console.error("🚨 Missing slug! Can't navigate.");
          }
        }}
      />
    ));
};
  

  return (
    <Flex flex={1} minW={0} mx={4} position="relative" ref={searchRef}>
      <InputGroup>
        <Select
          w="100px"
          borderRightRadius={0}
          value={mediaType}
          position="absolute"
          left="0"
          zIndex="2"
          color="gray.500"
          display={{ base: 'none', md: 'block' }}
          onChange={(e) => {
            setMediaType(e.target.value.toLowerCase());
            setShowDropdown(true);
          }}
        >
          <option value="all">All</option>
          <option value="books">Books</option>
          <option value="tv_seasons">TV Shows</option>
          <option value="movies">Movies</option>
        </Select>
        <InputLeftElement pointerEvents="none" left={iconLeftPosition} ml={3}>
          <Icon as={FaSearch} color="gray.300" />
        </InputLeftElement>
        <Input
         className="search-input"
          ref={inputRef}
          type="text"
          placeholder="Search any book, movie, or show to track its release date"
          variant="filled"
          pl={inputPaddingLeft}
          _placeholder={{ color: 'gray.500' }}
          value={searchQuery}
          _focus={{ bg: 'white' }}
          color="black"
          flex={1}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleSearch}
        />
        {searchQuery && (
          <InputRightElement width="2.5rem">
            <IconButton
              aria-label="Clear search"
              icon={<CloseIcon />}
              size="xs"
              variant="ghost"
              color="gray.500"
              onTouchStart={(e) => { // 🔥 Prevents losing focus on mobile
                e.preventDefault();
                setSearchQuery('');
                if (inputRef.current) {
                  inputRef.current.focus(); // 🔥 Keeps keyboard open!
                }
              }}
              onClick={(e) => { // 🔥 Still works for desktop
                e.preventDefault();
                setSearchQuery('');
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              _hover={{ color: 'gray.700' }}
            />
          </InputRightElement>
        )}
      </InputGroup>
      {showDropdown && searchQuery && isFocused && (
        <Box
        className="search-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            width: '100%',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            zIndex: 1000,
            overflow: 'hidden',
            color: 'black',
          }}
        >
          {loading ? <Text p="4">Loading...</Text> : renderGroupedPreviews()}
          <Flex justifyContent="center" p="4">
            <Button
              onClick={(e) => viewAllResults(e)}
              colorScheme="teal"
              width="full"
              variant="outline"
              style={{
                marginTop: '1rem',
                borderRadius: '0.375rem',
              }}
            >
              View More
            </Button>
          </Flex>
        </Box>
      )}
      {selectedItem && (
      <DetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        item={selectedItem} 
      />
    )}
    </Flex>
  );
};

export default SearchBar;
