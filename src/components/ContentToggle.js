import React, { useEffect, useState } from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';

const ContentToggle = ({ setMediaType }) => {
  const filters = ['TV Shows', 'Movies', 'Books'];
  const mediaTypes = ['tv_seasons', 'movies', 'books'];

  // Get stored media type index (default to 0)
  const storedMediaType = localStorage.getItem('selectedMediaType');
  const initialIndex = mediaTypes.includes(storedMediaType)
    ? mediaTypes.indexOf(storedMediaType)
    : 0;

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Update media type when tab changes
  const handleTabChange = (index) => {
    setSelectedIndex(index); // Update state immediately for snappy UI
    setMediaType(mediaTypes[index]);
  };

  // Persist selection in localStorage AFTER state update (avoids slow UI)
  useEffect(() => {
    localStorage.setItem('selectedMediaType', mediaTypes[selectedIndex]);
  }, [selectedIndex]);

  return (
    <Tabs
      isFitted
      variant="unstyled"
      index={selectedIndex}
      onChange={handleTabChange} // UI updates instantly
    >
      <TabList bg="brand.400" borderRadius="lg" mx={0} p={2} boxShadow="base">
        {filters.map((label, index) => (
          <Tab
            key={index}
            _selected={{
              bg: 'brand.100',
              color: 'white',
              fontWeight: '600',
              boxShadow: 'md',
            }}
            _hover={{
              bg: 'brand.200',
              color: 'brand.500',
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
            color="brand.500"
            borderRadius="xl"
            fontWeight="bold"
            fontSize={{ base: 'sm', md: 'md' }}
            px={{ base: 4, md: 5 }}
            py={2}
            mx={1}
            transition="all 0.2s ease"
          >
            {label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default ContentToggle;
