import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  InputGroup,
  Input,
  InputLeftElement,
  Icon,
  Select,
  Button,
  Box,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import WatchlistPreviewCard from './WatchlistPreviewCard';
import axios from 'axios';

const SearchBar = ({ mediaType, setMediaType, searchQuery, setSearchQuery, onFocusChange }) => {
  const inputPaddingLeft = useBreakpointValue({ base: '25px', md: '150px' });
  const iconLeftPosition = useBreakpointValue({ base: '-20px', md: '100px' });
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // Live search results
  const [loading, setLoading] = useState(false); // Loading indicator

  const API_BASE = "https://queuedup-backend-6d9156837adf.herokuapp.com";




  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?query=${searchQuery}&type=${mediaType}`);
    }
    setShowDropdown(true);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      console.log('Search Query:', searchQuery, 'Media Type:', mediaType)
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE}/api/search?q=${searchQuery}&type=${mediaType}`
        );
        console.log('API Response:', response.data)
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
        setShowDropdown(false);
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

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setIsFocused(false);
      onFocusChange(false);
    }, 200);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange(true);
  };

  const renderGroupedPreviews = () => {
    if (!searchResults.length) {
      return <Text p="4">No results found.</Text>;
    }
  
    const groupedResults = searchResults.reduce((group, item) => {
      const type = item.media_type || 'unknown';
      group[type] = group[type] || [];
      group[type].push(item);
      return group;
    }, {});
  
    if (mediaType === 'all') {
      // Truncate results to 2 per category
      return Object.keys(groupedResults).map((type) => (
        <Box key={type}>
          <Text fontSize="lg" fontWeight="bold" p="2">
            {type === 'tv_seasons'
              ? 'TV Shows'
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          {groupedResults[type].slice(0, 2).map((item) => ( // Limit to 2 results per category
            <WatchlistPreviewCard key={item._id || item.id} item={item} />
          ))}
        </Box>
      ));
    } else {
      // Limit to 6 total for specific media type
      const filteredResults = groupedResults[mediaType] || [];
      return filteredResults.slice(0, 6).map((item) => (
        <WatchlistPreviewCard key={item._id || item.id} item={item} />
      ));
    }
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
          type="text"
          placeholder="Search for TV shows, movies, books..."
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
      </InputGroup>
      {showDropdown && searchQuery && isFocused && (
        <Box
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
    </Flex>
  );
};

export default SearchBar;
