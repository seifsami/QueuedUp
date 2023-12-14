import React from 'react';
import { Box, Flex, Avatar, Text, VStack, Heading, SimpleGrid, GridItem, Button } from '@chakra-ui/react';
import Header from '../components/Header';

const ProfilePage = () => {
  // Sample user data
  const userData = {
    name: "Jane Doe",
    email: "janedoe@example.com",
    avatar: "https://via.placeholder.com/150",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    favorites: ["The Great Gatsby", "To Kill a Mockingbird", "1984"],
    recentActivity: ["Reviewed 'The Great Gatsby'", "Added '1984' to favorites"]
  };

  return (
    <>
      <Header />
      <Box maxW={{ xl: "1200px" }} mx="auto" bg="white" p={4}>
        {/* User Profile Section */}
        <Flex direction={{ base: "column", md: "row" }} alignItems="center" mb={6}>
          <Avatar size="2xl" name={userData.name} src={userData.avatar} mr={4} />
          <VStack alignItems={{ base: "center", md: "start" }} mt={{ base: 4, md: 0 }}>
            <Heading as="h1" size="xl">{userData.name}</Heading>
            <Text fontSize="lg">{userData.email}</Text>
            <Text textAlign={{ base: "center", md: "left" }} px={{ md: 4 }}>{userData.bio}</Text>
          </VStack>
        </Flex>

        {/* User Favorites Section */}
        <Box mb={6}>
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
        <Box mb={6}>
          <Heading as="h2" size="lg" mb={2}>Recent Activity</Heading>
          <VStack spacing={2}>
            {userData.recentActivity.map((activity, index) => (
              <Text key={index}>{activity}</Text>
            ))}
          </VStack>
        </Box>

        {/* Additional User Settings or Actions */}
        <Box textAlign="center">
          <Button colorScheme="teal" size="md">Edit Profile</Button>
          {/* Additional buttons or actions can be added here */}
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
