import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, Icon } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import Countdown from 'react-countdown';
import NotifyMeButton from './NotifyMeButton';

const MediaCard = ({ item, onOpenModal }) => {
  const imageContainerHeight = '338px'; 

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

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
      transition="0.3s"
      _hover={{ boxShadow: 'md' }}
      w="220px"
      h="500px"
      m="0 8px"
    >
      <Box 
        height={imageContainerHeight}
        position="relative"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Image
          src={item.image}
          alt={item.title}
          objectFit="cover" // Cover the area, maintaining aspect ratio
          width="100%"
          height="100%"
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
        <Text fontWeight="bold" noOfLines={2} h="3rem">{item.title} </Text>
        <Text fontSize="sm">{new Date(item.releaseDate).toLocaleDateString()}</Text>
        <Countdown date={new Date(item.releaseDate)} renderer={renderer} />
        <HStack justifyContent="space-between" width="full" >
        <NotifyMeButton item={item}/>
        <Button variant="outline" colorScheme="teal" size="sm" flex={2} onClick={() => onOpenModal(item)}>View Details</Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MediaCard;
