import React from 'react';
import { Grid, GridItem, Box, Icon, Text, Flex, useColorModeValue, SimpleGrid, VStack } from '@chakra-ui/react';
import { ViewIcon, StarIcon, HeartIcon, ChatIcon, CalendarIcon, ListIcon } from '@chakra-ui/icons';

const FeaturesSection = () => {


const featureItems = [
  {
    icon: ViewIcon,
    title: 'Personalized Watchlist',
    description: "Add any upcoming book, movie or TV series you'd like to keep track of.",
    bgColor: 'black',
  },
  {
    icon: StarIcon,
    title: 'Updated Release Dates',
    description: 'Release dates change. We keep up.',
    bgColor: 'black',
  },
  {
  icon: ViewIcon,
  title: 'Share Your Favourites',
  description: "Let everyone know what you're waiting for.",
  bgColor: 'black',
  },
  {
    icon: ViewIcon,
    title: "Can't Find Something?",
    description: "Let us know. We'll make sure to add it.",
    bgColor: 'black',
    },

  // ... Add more feature items here
];

const FeatureCard = ({ icon, title, description }) => (
  <VStack
    borderWidth="1px"
    rounded="lg"
    p={5}
    alignItems="center"
    bg="white"
    shadow="xl" // Apply a larger shadow for more depth
    _hover={{ shadow: "2xl" }} // Optional: Increase shadow on hover for an interactive effect
    transition="shadow 0.2s" // Smooth transition for the shadow on hover
    // Add any other hover effects you want here
    width="100%"
    minH="200px" // Adjust to your preference
    
  >
    <Icon as={icon} boxSize={10} color="brand.100" />
    <Text fontWeight="bold" fontSize="lg">{title}</Text>
    <Text fontSize="sm">{description}</Text>
  </VStack>
);
return (
  <Box pb={10} pt={5}>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 10 }} >
      {featureItems.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          
        />
      ))}
    </SimpleGrid>
  </Box>
);
};
export default FeaturesSection;