import React from 'react';
import { Box, Image, Text, HStack, VStack, Icon, useColorModeValue,IconButton, useBreakpointValue, Tooltip   } from '@chakra-ui/react';
import { FaBook, FaTv, FaFilm, FaShareAlt   } from 'react-icons/fa'; // Icons for media types

const mediaTypeIcons = {
  book: FaBook,
  tv: FaTv,
  movie: FaFilm,
};


const WatchlistPreviewCard = ({ item, onClick }) => {
  const bg = useColorModeValue('white', 'gray.700'); // Adjusts based on color mode
  const shareIconSize = useBreakpointValue({ base: 'md', md: 'lg' }); // Larger on desktop
  const titleMaxLines = useBreakpointValue({ base: 2, md: 1 }); // Max lines for title
  const cardHeight = useBreakpointValue({ base: 'auto', md: '120px' }); // Adjust 'auto' as needed
  // Define a responsive line height for the title to ensure space for two lines
  const titleLineHeight = useBreakpointValue({ base: 'tall', md: 'normal' }); // 'tall' is an example value
  // Define responsive padding around the title
  const titlePadding = useBreakpointValue({ base: '1', md: '2' });


  const handleShareClick = () => {
    // Implement share functionality, e.g., opening a share dialog
    console.log(`Sharing ${item.title}`);
  };

  return (
    <HStack
      key={item.id}
      p={{ base: 2, md: 4 }}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bg} // Each item has a background based on color mode
      minHeight={cardHeight}
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
      <Box flex="1" pl={2}  minWidth={0} pr={titlePadding}>
      <Text fontWeight="bold" 
      noOfLines={titleMaxLines} 
      lineHeight={titleLineHeight}
      maxHeight={`${titleLineHeight * 2}em`}
      overflow="hidden"
      textOverflow="ellipsis"
      >
          {item.title}
        </Text>
        <Text fontSize="sm">{item.creator || 'N/A'}</Text>
        <Text fontSize="sm">{item.series}</Text>
        <Text fontSize="sm">{item.releaseDate || 'N/A'}</Text>
      </Box>
      {useBreakpointValue({ base: false, md: true }) ? (
        <Tooltip hasArrow label="Share" bg="teal.600">
          <IconButton
            aria-label="Share"
            icon={<Icon as={FaShareAlt} />}
            size={shareIconSize}
            onClick={handleShareClick}
           
          />
        </Tooltip>
      ) : (
        <VStack align="end">
          <IconButton
            aria-label="Share"
            icon={<Icon as={FaShareAlt} />}
            size="sm"
            variant="outline"
            onClick={handleShareClick}
          />
        </VStack>
      )}
    </HStack>

  );
};

export default WatchlistPreviewCard;