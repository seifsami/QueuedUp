import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  Button,
  VStack,
  HStack,
  Text,
  Image,
  useColorModeValue,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ModernSearchBar = ({ focusOnMount, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://queuedup-backend-6d9156837adf.herokuapp.com/api/search?q=${query}&type=all`
        );
        setResults(response.data.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${query}&type=all`);
      setShowResults(false);
      onClose?.();
    }
  };

  const handleResultClick = (item) => {
    if (item.slug) {
      navigate(`/media/${item.media_type}/${item.slug}`);
      setShowResults(false);
      onClose?.();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box position="relative" w="full">
      <InputGroup size="lg">
        <InputLeftElement>
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        
        <Input
          ref={inputRef}
          placeholder="Search movies, TV shows, books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onKeyPress={handleKeyPress}
          bg={bg}
          border="2px solid"
          borderColor={borderColor}
          borderRadius="16px"
          fontSize="16px"
          fontWeight="500"
          _focus={{
            borderColor: 'brand.500',
            boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
          }}
          _placeholder={{
            color: 'gray.400',
            fontWeight: '400',
          }}
        />

        <InputRightElement width="auto" pr={2}>
          {query && (
            <IconButton
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            />
          )}
        </InputRightElement>
      </InputGroup>

      {/* Search Results Dropdown */}
      {showResults && (query || results.length > 0) && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left="0"
          right="0"
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="16px"
          boxShadow="xl"
          zIndex="1000"
          maxH="400px"
          overflowY="auto"
        >
          {loading ? (
            <Box p={4} textAlign="center">
              <Spinner size="sm" color="brand.500" />
            </Box>
          ) : results.length > 0 ? (
            <VStack spacing={0} align="stretch">
              {results.map((item) => (
                <Box
                  key={item._id}
                  p={3}
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => handleResultClick(item)}
                  borderRadius="12px"
                  mx={2}
                  my={1}
                >
                  <HStack spacing={3}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      w="40px"
                      h="60px"
                      objectFit="cover"
                      borderRadius="6px"
                      fallbackSrc="https://via.placeholder.com/40x60?text=?"
                    />
                    <VStack align="start" spacing={0} flex="1">
                      <Text fontWeight="600" fontSize="sm" noOfLines={1}>
                        {item.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                        {item.media_type?.replace('_', ' ')}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
              
              {query && (
                <Box p={3} borderTop="1px solid" borderColor={borderColor}>
                  <Button
                    variant="ghost"
                    size="sm"
                    w="full"
                    onClick={handleSearch}
                    color="brand.500"
                    fontWeight="600"
                  >
                    View all results for "{query}"
                  </Button>
                </Box>
              )}
            </VStack>
          ) : query ? (
            <Box p={4} textAlign="center">
              <Text color="gray.500">No results found</Text>
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default ModernSearchBar;