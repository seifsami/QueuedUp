import React from 'react';
import { Box, Text, Avatar, Flex, VStack, Heading } from '@chakra-ui/react';
import Header from '../components/Header';

const ProfilePage = () => {
  // Sample user data - replace with actual data as needed
  const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://via.placeholder.com/150", // Placeholder image
    // Add other user-specific data here
  };

  return (
    <>
      <Header />
      <Box maxW={{ xl: "1200px" }} mx="auto" bg="white" p={4}>
        <Flex direction={{ base: "column", md: "row" }} alignItems="center">
          <Avatar size="xl" name={userData.name} src={userData.avatar} mr={4} />
          <VStack alignItems={{ base: "center", md: "start" }} mt={{ base: 4, md: 0 }}>
            <Heading as="h1" size="xl">{userData.name}</Heading>
            <Text fontSize="lg">{userData.email}</Text>
            {/* Add more user details here */}
          </VStack>
        </Flex>

        {/* Additional sections for the user profile can be added here */}
        {/* For example, user's favorite items, history, settings, etc. */}

      </Box>
    </>
  );
};

export default ProfilePage;
