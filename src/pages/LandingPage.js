import React from 'react';
import { Text, Button, Flex, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './LandingPage.css';

const MotionButton = motion(Button);

const LandingPage = () => {
    // Define your animation variants
    const navigate = useNavigate(); // Initialize the navigate function using the useNavigate hook

    // Define your animation variants
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const navigateToHomePage = () => {
        navigate('/homepage'); // Navigate to HomePage
    };

    return (
        <>
            <Flex className="landing-page-flex" bgImage={`${process.env.PUBLIC_URL}/landing.jpg`}>
                <VStack className="landing-page-vstack">
                    <Text className="title-text">
                        QueuedUp
                    </Text>
                    <Text className="subtitle-text">
                        Get notified when your favorite books, movies, and TV shows are available.
                    </Text>
                    <MotionButton
                        className="motion-button"
                        size="lg"
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileFocus={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={navigateToHomePage} // Set the onClick handler
                    >
                        Browse
                    </MotionButton>
                </VStack>
            </Flex>
        </>
    );
};

export default LandingPage;
