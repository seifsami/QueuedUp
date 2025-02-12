import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, VStack, Heading, useBreakpointValue, Text } from '@chakra-ui/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import WatchlistPreviewCard from '../components/WatchlistPreviewCard';
import NoResults from '../components/NoResults';
import Filters from '../components/Filters';
import RequestNowButton from '../components/RequestNowButton';

const SearchResultsPage = ({ currentUser }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const resultsTextSize = useBreakpointValue({ base: 'md', md: 'xl' });
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const typeFromParams = searchParams.get('type') || 'all';
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]); // API results
  const [filteredResults, setFilteredResults] = useState([]); // Filtered results based on type
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedFilter, setSelectedFilter] = useState(typeFromParams); // Sidebar filter selection
  const API_BASE = "https://queuedup-backend-6d9156837adf.herokuapp.com";
  const typeToLabelMap = {
    all: 'All',
    movies: 'Movies',
    tv_seasons: 'TV Shows',
    books: 'Books',
  };

  // Fetch search results from the API
  const fetchSearchResults = useCallback(async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/api/search?q=${query}&type=${selectedFilter}`
      );
      
      setSearchResults(response.data);
      setFilteredResults(response.data); // Initial display shows all fetched results
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, selectedFilter]);

  // Re-fetch results when query or selectedFilter changes
  useEffect(() => {
    fetchSearchResults();
  }, [query, selectedFilter, fetchSearchResults]);

  // Update filtered results when the selected filter changes
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredResults(searchResults);
    } else {
      const filtered = searchResults.filter((item) => item.media_type === selectedFilter);
      setFilteredResults(filtered);
    }
  }, [selectedFilter, searchResults]);

  // Handle filter updates from the sidebar
  const updateFilter = (filter) => {
    setSelectedFilter(filter); // Update local state
    const params = new URLSearchParams(searchParams);
    params.set('type', filter); // Update URL
    setSearchParams(params);
  };

  const RenderRequestPrompt = () => (
    <Box mt={1} p={2} textAlign={{ base: 'center', md: 'left' }}>
      <Text mb={2}>Can't find what you're looking for?</Text>
      <RequestNowButton currentUser={currentUser} />  
    </Box>
  );

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Header searchQuery={query} />
      <Box bg="white" maxWidth="1200px" mx="auto" p={4} boxShadow="sm" borderRadius="lg">
        <Heading as="h2" size={resultsTextSize} mb={6}>
          {isMobile
            ? `Showing results for '${query.trim()}'`
            : `Showing results for '${query.trim()}' in '${typeToLabelMap[selectedFilter] || 'All'}'`}
        </Heading>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
          {!isMobile && (
            <VStack as="aside" spacing={4} width="250px" p={4}>
              <Filters selectedFilter={selectedFilter} updateFilter={updateFilter} />
              <RenderRequestPrompt />
            </VStack>
          )}
          {isMobile && <Filters selectedFilter={selectedFilter} updateFilter={updateFilter} />}
          <VStack flex="1" p={4} spacing={4} width="full" align="stretch">
            {loading ? (
              <Text>Loading...</Text>
            ) : filteredResults.length ? (
              filteredResults.map((item) => (
                <WatchlistPreviewCard 
                  key={item._id || item.id} 
                  item={item} 
                  showDelete={false} 
                  width="full" 
                  onClick={() => {
                    

                    if (item.slug) {
                      navigate(`/media/${item.media_type}/${item.slug}`);
                    } else {
                      console.error("🚨 Missing slug! Can't navigate.");
                    }
                  }} 
                />

              ))
            ) : (
              <NoResults />
            )}
          </VStack>
        </Flex>
        {isMobile && filteredResults.length > 0 && <RenderRequestPrompt />}
      </Box>
    </Box>
  );
};

export default SearchResultsPage;
