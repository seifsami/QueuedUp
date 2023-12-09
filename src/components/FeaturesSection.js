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
          border="1px solid gray" // Adding a border
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)" // Adding a box shadow
          _hover={{ 
            bg: 'gray.600', 
            transform: 'scale(1.05)', 
            cursor: 'pointer',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)' // Enhanced hover effect with shadow
          }}  
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
