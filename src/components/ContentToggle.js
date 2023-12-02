import React from 'react';
import { Tabs, TabList, Tab, Box, useColorModeValue } from '@chakra-ui/react';

const ContentToggle = () => {
  const tabSelectedStyle = {
    bg: useColorModeValue('teal.500', 'teal.200'), // For light mode: teal.500; for dark mode: teal.200
    color: 'white',
    p: 3,
    borderRadius: 'md',
    fontWeight: 'semibold',
    _hover: {
      boxShadow: 'md', // Optional: adds a shadow on hover
    },
  };

  return (
    <Box>
      <Tabs variant="soft-rounded" colorScheme="teal" align="center" isFitted>
        <TabList>
          <Tab _selected={tabSelectedStyle}>TV Shows</Tab>
          <Tab _selected={tabSelectedStyle}>Movies</Tab>
          <Tab _selected={tabSelectedStyle}>Books</Tab>
        </TabList>
      </Tabs>
    </Box>
  );
};

export default ContentToggle;
