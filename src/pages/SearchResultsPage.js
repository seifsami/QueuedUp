// SearchResultsPage.js
import React, {useState, useEffect} from 'react';
import { Box, Flex, VStack, Heading, useBreakpointValue, Text, Button } from '@chakra-ui/react';
import Header from '../components/Header';
import WatchlistPreviewCard from '../components/WatchlistPreviewCard';
import NoResults from '../components/NoResults';
import Filters from '../components/Filters';
import { useSearchParams } from 'react-router-dom';
import RequestNowButton from '../components/RequestNowButton';

const SearchResultsPage = ({ searchQuery }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const resultsTextSize = useBreakpointValue({ base: 'md', md: 'xl' });
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const typeFromParams = searchParams.get('type');
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(typeFromParams || 'All');
    const typeToLabelMap = {
        'all': 'All',
        'movie': 'Movies',
        'tv': 'TV Shows',
        'book': 'Books',
      };
   
  
    useEffect(() => {
        // When selectedFilter changes, we filter the dummyResults
        setFilteredResults(filterResults(typeFromParams || 'All'));
      }, [typeFromParams]); 

    

    

      
      
      const filterResults = (type) => {
        if (type === 'all') {
          return dummyResults;
        } else {
          return dummyResults.filter(item => item.type === type);
        }
      };
      
        

      useEffect(() => {
        // When selectedFilter changes, we filter the dummyResults again
        setFilteredResults(filterResults(selectedFilter));
      }, [selectedFilter]);

      const updateFilter = (filter) => {
        setSelectedFilter(filter);
        const newFilteredResults = filterResults(filter);
        setFilteredResults(newFilteredResults);
      };

      

 
  // Dummy data for demonstration purposes
  const dummyResults = [
    
     { id: 1, title: "Stranger Things Season 2", series: "Stranger Things", type:"book", image:`${process.env.PUBLIC_URL}51J4VWwlmvL.jpg`,creator: "Matt Dinniman", releaseDate: '2023-12-30'},
    { id: 2, title: "The First Law", series: "Mistborn",  type: "tv", image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`, creator: "Steven Spielberg", releaseDate: '2023-12-30'},
    {id: 5, title: "Oppenheimer", series: "N/A",  type: "tv", image:`${process.env.PUBLIC_URL}oppenheimer.jpeg`, creator: "Christopher Nolan", releaseDate: '2024-12-30', dateAdded:'2023-12-05'}
    
  ];

  const RenderRequestPrompt = () => (
    <Box
    mt={1} // Reducing top margin
    p={2} // Adjust padding as needed
    textAlign={{ base: "center", md: "left" }} // Set text alignment to left for all devices
  >
      <Text mb={2}>Can't find what you're looking for?</Text>
      <RequestNowButton />
    </Box>
  );

  
  

  // Layout for the page
  return (
    <Box bg="gray.100" minHeight="100vh">
      <Header searchQuery={query} />
      {/* All content should be wrapped in a Box to create a white background as per your design */}
      <Box bg="white" maxWidth="1200px" mx="auto" p={4} boxShadow="sm" borderRadius="lg">
      <Heading as="h2" size={resultsTextSize} mb={6}>
      {isMobile
            ? `Showing results for '${query.trim()}'`
            : `Showing results for '${query.trim()}' in '${typeToLabelMap[selectedFilter.toLowerCase()] || 'All'}'`
        }
      
      </Heading>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
        {!isMobile && (
        <VStack as="aside" spacing={4} width="250px" p={4}>
              <Filters selectedFilter={selectedFilter} updateFilter={updateFilter} />
              <RenderRequestPrompt />
            </VStack>
        )}
        {isMobile && (
          <Filters selectedFilter={selectedFilter} updateFilter={updateFilter} />
          )}
            {/* Ensure you have the selectedFilters and updateFilters props managed and passed */}
            

          {/* Main content area for search results */}
          <VStack flex="1" p={4} spacing={4} width="full" align="stretch">
          {/* Ensure your WatchlistPreviewCard takes up full width */}
          {filteredResults.length ? (
            filteredResults.map(item => (
              <WatchlistPreviewCard key={item.id} item={item} width="full" />
            ))
          ) : (
            <NoResults />
          )}
        </VStack>
        </Flex>
        {isMobile && filteredResults.length > 0 && (
            
            <RenderRequestPrompt />
            )}
      </Box>
    </Box>
  );
};

export default SearchResultsPage;