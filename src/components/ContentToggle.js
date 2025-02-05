import React from 'react';
import { Tabs, TabList, Tab, Box } from '@chakra-ui/react';

const ContentToggle = ({ setMediaType }) => {
  return (
    <Tabs
      isFitted
      variant="unstyled"
      onChange={(index) => {
        const mediaTypes = ['tv_seasons', 'movies', 'books'];
        setMediaType(mediaTypes[index]);
      }}
    >
      <TabList 
        bg="brand.400"  // Softer background
        borderRadius="lg"
        mx={4}
        p={2}
        boxShadow="sm"
        overflowX="auto"  // Enable horizontal scroll on mobile
        whiteSpace="nowrap"  // Prevent tabs from wrapping to the next line
      >
        {['TV Shows', 'Movies', 'Books'].map((label, index) => (
          <Tab
            key={index}
            _selected={{
              bg: 'brand.100',  // Muted Green for active tab
              color: 'white',   // White text when selected
              fontWeight: '600',
              boxShadow: 'md',  // Slight elevation for active tab
            }}
            _hover={{ 
              bg: 'brand.200',  // Light Sage Green for hover
              color: 'brand.500',  // Dark gray text on hover
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
            color="brand.500"   // Dark gray text for inactive tabs
            borderRadius="xl"  // Pill-shaped tabs
            fontWeight="400"
            fontSize={{ base: 'sm', md: 'md' }}  // Smaller font on mobile
            px={{ base: 4, md: 5 }}  // Slightly reduced padding on mobile
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
