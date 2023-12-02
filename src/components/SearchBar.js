import React from 'react';
import { InputGroup, InputLeftElement, Input, Box, Icon } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <Box my={4} width="full" px={5}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={FaSearch} color="gray.300" />}
        />
        <Input
          type="text"
          placeholder="Search for TV shows, movies, books..."
          variant="filled"
          size="lg"
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
