import React from 'react';
import { Text, Button, Flex, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Create a motion component
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
                    <Text 
                        fontSize="6xl" 
                        fontWeight="extrabold" 
                        textAlign="center" 
                        color="white"
                        textShadow="0 0 8px black, 0 0 10px black, 0 0 12px black" // More pronounced shadow
                    >
                        QueuedUp
                    </Text>
                    <Text 
                        fontSize="2xl" 
                        textAlign="center" 
                        color="white"
                        textShadow="0 0 8px black, 0 0 10px black, 0 0 12px black" // More pronounced shadow
                    >
                        Get notified when your favorite books, movies, and TV shows are available.
                    </Text>
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
