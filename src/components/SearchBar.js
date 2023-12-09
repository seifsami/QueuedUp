import React, { useEffect, useRef } from 'react';
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
  useBreakpointValue
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import WatchlistPreviewCard from './WatchlistPreviewCard';

const SearchBar = ({ mediaType, setMediaType, searchQuery, setSearchQuery, suggestions }) => {
  const inputPaddingLeft = useBreakpointValue({ base: "25px", md: "150px" });
  const iconLeftPosition = useBreakpointValue({ base: "-20px", md: "100px" });
  const [showDropdown, setShowDropdown] = React.useState(false); // Only declare the state you need here
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
 

  
  
  const dummyPreviewData = [
    { id: 1, title: "Stranger Things Season 2", series: "Stranger Things", type:"book", image:`${process.env.PUBLIC_URL}51J4VWwlmvL.jpg`,creator: "Matt Dinniman", releaseDate: '2023-12-30'},
    { id: 2, title: "The First Law", series: "Mistborn",  type: "tv", image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`, creator: "Steven Spielberg", releaseDate: '2023-12-30'},
    {id: 5, title: "Oppenheimer", series: "N/A",  type: "tv", image:`${process.env.PUBLIC_URL}oppenheimer.jpeg`, creator: "Christopher Nolan", releaseDate: '2024-12-30', dateAdded:'2023-12-05'}
    // ... more items
];
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?query=${searchQuery}&type=${mediaType}`);
    }
    setShowDropdown(true);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
  
    // Attach the event listener to the document
    document.addEventListener('mouseup', handleClickOutside);
  
    // Return a cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);
  

  const viewAllResults = () => {
    navigate(`/search?query=${searchQuery}&type=${mediaType}`);
  };

  const renderPreviewCards = () => {
    return dummyPreviewData.map(item => (
      <WatchlistPreviewCard key={item.id} item={item} />
    ));
  };

  const renderGroupedPreviews = () => {
    // If the mediaType is 'all', show grouped data by type
    if (mediaType === 'all') {
      return Object.keys(groupedData).map(type => (
        <Box key={type}>
          {/* Adjust the title to display plural form or full name */}
          <Text fontSize="lg" fontWeight="bold" p="2">{type === 'tv' ? 'TV Shows' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}</Text>
          {groupedData[type].map(item => (
            <WatchlistPreviewCard key={item.id} item={item} />
          ))}
        </Box>
      ));
    } else {
      // If a specific mediaType is selected, show only that type without a section header
      const type = mediaType.toLowerCase(); // Convert to lowercase to match your groupedData keys
    if (groupedData[type]) {
      return groupedData[type].map(item => (
        <WatchlistPreviewCard key={item.id} item={item} />
      ));
    }
    return null; // Return null if there's no data for this type
  }
};

  const groupedData = dummyPreviewData.reduce((group, item) => {
    const { type } = item;
    group[type] = group[type] ?? [];
    group[type].push(item);
    return group;
  }, {});

  return (
    
    <Flex flex={1} minW={0} mx={4} position={'relative'} ref={searchRef}>
      <InputGroup >
        <Select
          w="100px"
          borderRightRadius={0}
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          position="absolute"
          left="0"
          zIndex="2" // Ensure dropdown is above other content
          color={'gray.500'}
          display={{ base: 'none', md: 'block' }}
          onChange={(e) => {
            setMediaType(e.target.value.toLowerCase()); // Convert to lowercase to match your groupedData keys
            setShowDropdown(true);
          }}
        >
          <option value="all">All</option>
          <option value="book">Books</option>
          <option value="tv">TV</option>
          <option value="movie">Movies</option>
        </Select>
        <InputLeftElement pointerEvents="none" left={iconLeftPosition} ml={3} >
          <Icon as={FaSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search for TV shows, movies, books..."
          variant="filled"
          pl={inputPaddingLeft}
           // Adjust padding to account for the media type dropdown
          _placeholder={{ color: 'gray.500' }}
          value={searchQuery}
          _focus={{ bg: 'white'}}
          color="black"
          flex={1}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true); // Open dropdown when typing
          }}
          onKeyDown={handleSearch}
        />
      </InputGroup>
      {showDropdown && searchQuery && ( // Only show this if showDropdown is true and searchQuery is not empty
       <Box
       display={{ base: 'none', md: 'block' }}
          style={{
            position: 'absolute',
            top: '100%',
            width: '100%',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            zIndex: 1000,
            overflow: 'hidden',
            color: 'black'
            
          }}
        >
          
          {renderGroupedPreviews()}
          <Flex justifyContent="center" p="4">
          <Button
            onClick={viewAllResults}
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
