import React, { useState } from 'react';
import {
  Box, Flex, Avatar, Text, VStack, Heading, SimpleGrid, GridItem,
  Button, Select, Switch, FormLabel, FormControl, useColorModeValue,
} from '@chakra-ui/react';
import Header from '../components/Header';

const ProfilePage = () => {

  const [notificationFrequency, setNotificationFrequency] = useState('daily');
  const [notificationMedium, setNotificationMedium] = useState('email');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Sample user data
  const userData = {
    name: "Jane Doe",
    email: "janedoe@example.com",
    avatar: "../profileplaceholder.jpeg",
    //bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    favorites: ["The Great Gatsby", "To Kill a Mockingbird", "1984"],
    recentActivity: ["Reviewed 'The Great Gatsby'", "Added '1984' to favorites"]
  };

  return (
    <>
      <Header />
      <Box maxW={{ xl: "1200px" }} mx="auto" bg="white" p={8}>
        {/* User Profile Section */}
        <Flex direction={{ base: "column", md: "row" }} alignItems="center" mb={6}>
          <Avatar size="2xl" name={userData.name} src={userData.avatar} mr={4} />
          <VStack alignItems={{ base: "center", md: "start" }} mt={{ base: 4, md: 0 }}>
            <Heading as="h1" size="xl">{userData.name}</Heading>
            <Text fontSize="lg">{userData.email}</Text>
            <Text textAlign={{ base: "center", md: "left" }} px={{ md: 4 }}>{userData.bio}</Text>
          </VStack>
        </Flex>

         {/* Notification Preferences Section */}
        <Box mb={10} p={5} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
          <Heading as="h2" size="lg" mb={2}>Notification Preferences</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormControl>
              <FormLabel htmlFor='frequency'>Get Notified:</FormLabel>
              <Select id='frequency' value={notificationFrequency} onChange={(e) => setNotificationFrequency(e.target.value)}>
                <option value='daily'>Day Of Release</option>
                <option value='weekly'>1 Day Before Release</option>
                <option value='monthly'>1 Week Before Release</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='notification-medium'>Notification Medium:</FormLabel>
              <Select id='notification-medium' value={notificationMedium} onChange={(e) => setNotificationMedium(e.target.value)}>
                <option value='email'>Email</option>
                <option value='sms'>SMS</option>
              </Select>
            </FormControl>
          </SimpleGrid>
        </Box>

        {/* User Favorites Section */}
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={2}>Favorite Items</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            {userData.favorites.map((item, index) => (
              <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                <Text fontWeight="bold">{item}</Text>
                {/* Additional item details can go here */}
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* User Recent Activity Section */}
        <Box mb={10} p={5} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
          <Heading as="h2" size="lg" mb={2}>Recent Activity</Heading>
          <VStack spacing={2}>
            {userData.recentActivity.map((activity, index) => (
              <Text key={index}>{activity}</Text>
            ))}
          </VStack>
        </Box>

        {/* Additional User Settings or Actions */}
        <Flex justifyContent="center">
          <Button colorScheme="teal" size="lg" mr={4}>Edit Profile</Button>
          <Button colorScheme="gray" size="lg">Cancel</Button>
        </Flex>
      </Box>
    </>
  );
};

export default ProfilePage;
