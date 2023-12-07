import React from 'react';
import { Box, Text, Button, Image, Flex, Spacer } from '@chakra-ui/react';
import Header from '../components/Header'; // Assuming you have a Header component

const LandingPage = () => {
    return (
        <>
            <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="white" px={4}>
                <Box maxW={{ xl: "1200px" }} width="full">
                    <Text fontSize="5xl" fontWeight="bold" textAlign="center" mb={6}>
                        Welcome to Our World of Books!
                    </Text>
                    <Text fontSize="xl" textAlign="center" mb={8}>
                        Discover your next great read with us. Explore new releases, trending titles, and timeless classics.
                    </Text>
                    <Flex justify="center">
                        <Button colorScheme="blue" mr={3}>
                            Browse Books
                        </Button>
                        <Button colorScheme="green">
                            Join our Community
                        </Button>
                    </Flex>
                </Box>
                <Spacer />
                <Box maxW={{ xl: "1200px" }} width="full">
                    <Image src={`${process.env.PUBLIC_URL}/landing.jpg`} alt="Landing Page" />
                </Box>
            </Flex>
        </>
    );
};

export default LandingPage;
