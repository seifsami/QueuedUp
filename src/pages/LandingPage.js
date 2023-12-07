import React from 'react';
import { Box, Text, Button, Flex, Image, VStack } from '@chakra-ui/react';

const LandingPage = () => {
    return (
        <>
            <Flex
                direction="column"
                align="center"
                justify="center"
                minHeight="100vh"
                bgImage={`${process.env.PUBLIC_URL}/landing.jpg`} // Background image
                bgPosition="center"
                bgRepeat="no-repeat"
                bgSize="cover"
            >
                <VStack spacing={6} maxW={{ xl: "1200px" }} width="full" px={4} bg="rgba(255, 255, 255, 0.6)" borderRadius="lg" p={6}>
                    <Text fontSize="5xl" fontWeight="bold" textAlign="center" color="black">
                        Welcome to Our World of Books!
                    </Text>
                    <Text fontSize="xl" textAlign="center" color="black">
                        Discover your next great read with us. Explore new releases, trending titles, and timeless classics.
                    </Text>
                    <Button colorScheme="blue" size="lg">
                        Browse
                    </Button>
                </VStack>
            </Flex>
        </>
    );
};

export default LandingPage;
