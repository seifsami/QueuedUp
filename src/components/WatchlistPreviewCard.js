import React from 'react';
import { Box, Image, Text, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaBook, FaTv, FaFilm } from 'react-icons/fa'; // Icons for media types

const mediaTypeIcons = {
  book: FaBook,
  tv: FaTv,
  movie: FaFilm,
};

const WatchlistPreviewCard = ({ item, onClick }) => {
  const bg = useColorModeValue('white', 'gray.700'); // Adjusts based on color mode

  return (
    <HStack
      key={item.id}
      p={4}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bg} // Each item has a background based on color mode
      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }} // Hover effect
      onClick={onClick}
      cursor="pointer" // Change cursor on hover
    >
      <Icon as={mediaTypeIcons[item.type]} boxSize={6} mr={2} />
      <Image
        src={`${process.env.PUBLIC_URL}/${item.image}`}
        alt={item.title}
        htmlWidth="80px"
        htmlHeight="120px"
        objectFit="cover"
        borderRadius="md"
      />
      <Box flex="1" pl={2}>
        <Text fontWeight="bold" isTruncated>{item.title}</Text>
        <Text fontSize="sm">{item.creator || 'N/A'}</Text>
        <Text fontSize="sm">{item.series}</Text>
        <Text fontSize="sm">{item.releaseDate || 'N/A'}</Text>
        
      </Box>
    </HStack>
  );
};

export default WatchlistPreviewCard;