import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, Icon } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import Countdown from 'react-countdown';

const MediaCard = ({ item }) => {
    return (
        <Box
        w="220px" // Standard width for all cards
        h="auto" // Height will adjust dynamically
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        boxShadow="sm"
        transition="0.3s"
        _hover={{ boxShadow: 'md' }}
        mx={1}
        my={2} // Adjusted margin between cards
      >
        <Box position="relative">
          <Image
            src={`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`} // Replace with the correct image path
            alt={item.title}
            objectFit="scale-down"
            w="100%" // Image will scale to fit width
            h="auto" // Height will be automatic to maintain aspect ratio
          />
        {/* Tracking count overlay */}
        <Box position="absolute" top="2" right="2" p="2" bg="rgba(255, 255, 255, 0.6)" borderRadius="full">
          <HStack>
            <Icon as={FaEye} />
            <Text fontSize="sm">{item.trackingCount || '0'}</Text>
          </HStack>
        </Box>
      </Box>

      <VStack align="start" p={4}>
        <Text fontWeight="bold" noOfLines={2}>{item.title}</Text> // Text wrapping enabled
        <Text fontSize="sm">{new Date(item.releaseDate).toLocaleDateString()}</Text>
        <Countdown date={new Date(item.releaseDate)} renderer={renderer} />
        <HStack justifyContent="space-between" width="full">
          <Button colorScheme="teal" size="sm" flex={2}>Notify Me</Button>
          <Button variant="outline" colorScheme="teal" size="sm" flex={2}>View Details</Button>
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
