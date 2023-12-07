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
                        textShadow="0 0 10px black, 0 0 12px black, 0 0 14px black" // Enhanced first shadow
                    >
                        QueuedUp
                    </Text>
                    <Text 
                        fontSize="2xl" 
                        fontWeight="bold" 
                        textAlign="center" 
                        color="white"
                        textShadow="0 0 10px black, 0 0 12px black, 0 0 14px black" // Same shadow effect for consistency
                    >
                        Get notified when your favorite books, movies, and TV shows are available.
                    </Text>
                    <MotionButton
                        bg="black" // Set background color to black
                        color="white" // Set text color to white for contrast
                        size="lg"
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        boxShadow="0 4px 12px 0 rgba(0,0,0,0.5)" // Shadow for depth
                        borderRadius="md" // Slightly rounded corners
                        whileHover={{ scale: 1.05, backgroundColor: "gray.700" }} // Slightly change color on hover
                        whileFocus={{ scale: 1.05, backgroundColor: "gray.700" }} // Slightly change color on focus
                        whileTap={{ scale: 0.95 }} // Scale down slightly on tap/click
                        _hover={{ textDecoration: 'none' }} // Remove text underline on hover
                        _focus={{ outline: 'none' }} // Remove focus outline
                    >
                        Browse
                    </MotionButton>
                </VStack>
            </Flex>
        </>
    );
};

export default LandingPage;
