import React from 'react';
import { Tabs, TabList, Tab} from '@chakra-ui/react';

const ContentToggle = ({ setMediaType }) => {
  return (
    <Tabs
    isFitted
    variant="enclosed"
    w="full"
    onChange={(index) => {
      const mediaTypes = ['tv_seasons', 'movies', 'books'];  // Corresponding media types
      setMediaType(mediaTypes[index]);  // Emit media type based on tab index
    }}
  >
      <TabList >
      <Tab
        _selected={{ color: 'white', bg: 'teal.600', borderBottom: '4px solid', borderColor: 'teal.700' }}
        _hover={{ 
          bg: 'teal.50', 
          color: 'teal.700',
          _selected: {
            bg: 'teal.600', // Keep the background the same for the active tab on hover
            color: 'white',
          }
        }}
        borderRadius="md"
        p={3}
      >
          TV Shows
        </Tab>
        <Tab
          _selected={{ color: 'white', bg: 'teal.600', borderBottom: '4px solid', borderColor: 'teal.700' }}
          _hover={{ 
            bg: 'teal.50', 
            color: 'teal.700',
            _selected: {
              bg: 'teal.600', // Keep the background the same for the active tab on hover
              color: 'white',
            }
          }}
          borderRadius="md"
          p={3}
        >
          Movies
        </Tab>
        <Tab
          _selected={{ color: 'white', bg: 'teal.600', borderBottom: '4px solid', borderColor: 'teal.700' }}
          _hover={{ 
            bg: 'teal.50', 
            color: 'teal.700',
            _selected: {
              bg: 'teal.600', // Keep the background the same for the active tab on hover
              color: 'white',
            }
          }}
          borderRadius="md"
          p={3}
        >
          Books
        </Tab>
      </TabList>
      
    </Tabs>
  );
};

export default ContentToggle;
