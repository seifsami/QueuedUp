import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, Icon } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import Countdown from 'react-countdown';

const MediaCard = ({ item, onOpenModal }) => {
  const cardHeight = '500px'; // Adjust to match your current card height
  const imageContainerHeight = '338px'; 
  

  

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
      transition="0.3s"
      _hover={{ boxShadow: 'md' }}
      w="220px" // Width of the card
      h={cardHeight} // Fixed height for the card
      m="0 8px" // Margin for spacing between cards
    >
      <Box 
        height={imageContainerHeight}
        position="relative"
        borderBottom="1px solid" // Border at the bottom of the image container
        borderColor="gray.200" // Border color
      >
        <Image
          src={item.image}
          alt={item.title}
          objectFit="cover" // Cover the area, maintaining aspect ratio
          width="100%" // Use full width of the container
          height="100%" // Use full height of the container
        />
        {/* Tracking count overlay */}
        <Box position="absolute" top="2" right="2" p="2" bg="rgba(255, 255, 255, 0.6)" borderRadius="full">
          <HStack>
            <Icon as={FaEye} />
            <Text fontSize="sm">{item.trackingCount || '0'}</Text>
          </HStack>
        </Box>
      </Box>

      <VStack align="start" p={2} spacing="1">
        <Text fontWeight="bold" noOfLines={2} h="3rem">{item.title} </Text> // Text wrapping enabled
        <Text fontSize="sm">{new Date(item.releaseDate).toLocaleDateString()}</Text>
        <Countdown date={new Date(item.releaseDate)} renderer={renderer} />
        <HStack justifyContent="space-between" width="full" >
          <Button colorScheme="teal" size="sm" flex={2}>Notify Me</Button>
          <Button variant="outline" colorScheme="teal" size="sm" flex={2} onClick={() => onOpenModal(item)}>View Details</Button>
        </HStack>
      </VStack>
    </Box>
  );
};

// Custom renderer for countdown
const renderer = ({ days, hours, minutes, completed }) => {
  if (completed) {
    return <Text fontSize="sm">Released!</Text>;
  } else {
    return (
      <Text fontSize="sm">{days}d {hours}h {minutes}m left</Text> // Format can be adjusted as needed
    );
  }
};

export default MediaCard;
