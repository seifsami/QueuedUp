import React from 'react';
import { Tabs, TabList, Tab, Box } from '@chakra-ui/react';

const ContentToggle = ({ setMediaType }) => {
  const filters = ['Books', 'Movies', 'TV Shows'];
  const mediaTypes = ['books', 'movies', 'tv_seasons'];
  
  return (
    <Tabs
      isFitted
      variant="unstyled"
      defaultIndex={0}  // "Books" as default
      onChange={(index) => {
        setMediaType(mediaTypes[index]);
      }}
    >
      <TabList 
        bg="brand.400"
        borderRadius="lg"
        mx={0}            // Remove horizontal margins
        p={2}
        boxShadow="base"
        overflowX="auto"
        whiteSpace="nowrap"
      >
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
