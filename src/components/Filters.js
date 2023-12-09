// Filters.js
import React from 'react';
import { Flex, Button, Box, Heading,  Select, useBreakpointValue } from '@chakra-ui/react';

// Filters.js

const Filters = ({ selectedFilter, updateFilter }) => {
    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Movies', value: 'movie' },
      { label: 'TV Shows', value: 'tv' },
      { label: 'Books', value: 'book' },
    ];
    const minWidth = "120px"; // Use the length of the longest label to set the width
    const isMobile = useBreakpointValue({ base: true, md: false });

    if (isMobile) {
        return (
          <Box p={4}>
            <Select onChange={(e) => updateFilter(e.target.value)} value={selectedFilter}>
              {filters.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </Box>
        );
      }
  
    return (
      <Box as="aside" width={{ base: "full", md: "250px" }} p={4} boxShadow="base" bg="white" maxH="250px">
        <Heading size="md" mb={4}>Filters</Heading>
        <Flex direction="column" alignItems="flex-start">
          {filters.map(({ label, value }) => (
            <Button
            key={value}
            onClick={() => updateFilter(value)}
            variant={selectedFilter === value ? 'solid' : 'ghost'}
            colorScheme={selectedFilter === value ? 'teal' : 'gray'}
            mb={2}
            minWidth={minWidth}
            justifyContent="flex-start"
             // Set padding to zero
            m={0} // Set margin to zero if necessary
            p={2}
            
          >
            {label}
          </Button>
          
          ))}
        </Flex>
      </Box>
    );
  };
  export default Filters;
  