import React, { useState, useEffect } from 'react';
import { Input, Box, VStack, Text } from '@chakra-ui/react';
import WatchlistPreviewCard from './WatchlistPreviewCard';

const OnboardingSearchBar = ({ onSelectItem, selectedItems }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  


  // Dummy data (from your existing SearchBar)
  const dummyPreviewData = [
    { id: 1, title: "Stranger Things Season 2", series: "Stranger Things", type:"book", image:`${process.env.PUBLIC_URL}51J4VWwlmvL.jpg`,creator: "Matt Dinniman", releaseDate: '2023-12-30'},
    { id: 2, title: "The First Law", series: "Mistborn",  type: "tv", image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`, creator: "Steven Spielberg", releaseDate: '2023-12-30'},
    {id: 5, title: "Oppenheimer", series: "N/A",  type: "tv", image:`${process.env.PUBLIC_URL}oppenheimer.jpeg`, creator: "Christopher Nolan", releaseDate: '2024-12-30', dateAdded:'2023-12-05'}
    // ... more items
];

const handleSelectItem = (item) => {
    onSelectItem(item); // Pass the item to the parent component (OnboardingModal)
  };

  useEffect(() => {
    // Filter function
    const filteredResults = dummyPreviewData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults);

    // Group by type
    const groupedByType = filteredResults.reduce((acc, item) => {
      const type = item.type.toLowerCase();
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});

    setGroupedResults(groupedByType);

  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  

  return (
    <VStack spacing={4}>
      <Input
        placeholder="Search for TV shows, movies, books..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {/* Render grouped search results */}
      {Object.keys(groupedResults).map(type => (
        <Box key={type}>
          <Text fontSize="lg" fontWeight="bold" p="2">{type}</Text>
          {groupedResults[type].map(item => (
            <Box
              key={item.id}
              onClick={() => handleSelectItem(item)}
              bg={selectedItems.has(item.id) ? 'teal.100' : 'transparent'} // Highlight if selected
            >
              <WatchlistPreviewCard item={item} />
            </Box>
          ))}
        </Box>
      ))}
    </VStack>
  );
};
export default OnboardingSearchBar;
