import React from 'react';
import { Grid, GridItem, Box, Icon, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { ViewIcon, StarIcon, HeartIcon, ChatIcon, CalendarIcon, ListIcon } from '@chakra-ui/icons';

const FeaturesSection = () => {
  const bgColor = useColorModeValue('black', 'black'); // Use color mode value for light/dark theme
  const featureItems = [
    {
      icon: ViewIcon,
      title: 'Keep track of every film you’ve ever watched',
      description: '(or just start from the day you join)',
      bgColor: 'black',
    },
    {
      icon: StarIcon,
      title: 'Rate each film on a five-star scale',
      description: '(with halves) to record and share your reaction',
      bgColor: 'black',
    },
    {
    icon: ViewIcon,
    title: 'Keep track of every film you’ve ever watched',
    description: '(or just start from the day you join)',
    bgColor: 'black',
    },
    {
    icon: StarIcon,
    title: 'Rate each film on a five-star scale',
    description: '(with halves) to record and share your reaction',
    bgColor: 'black',
    },
    {
    icon: ViewIcon,
    title: 'Keep track of every film you’ve ever watched',
    description: '(or just start from the day you join)',
    bgColor: 'black',
    },
    {
    icon: StarIcon,
    title: 'Rate each film on a five-star scale',
    description: '(with halves) to record and share your reaction',
    bgColor: 'black',
    },
      
    // ... Add more feature items here
  ];

  return (
    <Grid templateColumns={['repeat(1, 1fr)', null, 'repeat(3, minmax(180px, 1fr))']} gap={6} p={6}>
      {featureItems.map((feature, index) => (
        <GridItem 
          key={index} 
          bg={feature.bgColor || bgColor} 
          p={6} 
          borderRadius="md"
          _hover={{ bg: 'gray.600', transform: 'scale(1.05)', cursor: 'pointer' }}  // Hover effect on the entire card
        >
          <Flex alignItems="center" color="white">
            <Icon as={feature.icon} w={10} h={10} mr={2} />
            <Text fontSize="md" fontWeight="bold">{feature.title}</Text>
          </Flex>
        </GridItem>
      ))}
    </Grid>
  );
};

export default FeaturesSection;
