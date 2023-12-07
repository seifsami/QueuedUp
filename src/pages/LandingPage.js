import React from 'react';
import { Box, Text, Button, Flex, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Create a motion component
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const LandingPage = () => {
    // Define your animation variants
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

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
                <VStack spacing={6} maxW={{ xl: "1200px" }} width="full" px={4} p={6}>
                    <MotionBox
                        bg="rgba(255, 255, 255, 0.6)"
                        borderRadius="md"
                        p={1}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Text fontSize="6xl" fontWeight="bold" textAlign="center" color="black">
                            QueuedUp
                        </Text>
                    </MotionBox>
                    <MotionBox
                        bg="rgba(255, 255, 255, 0.6)"
                        borderRadius="md"
                        p={1}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Text fontSize="2xl" textAlign="center" color="black">
                            Get notified when your favorite books, movies, and TV shows are available.
                        </Text>
                    </MotionBox>
                    <MotionButton
                        colorScheme="blue"
                        size="lg"
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        Browse
                    </MotionButton>
                </VStack>
            </Flex>
        </>
    );
};

export default LandingPage;
