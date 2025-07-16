import React from 'react';
import { Text, Button, Flex, VStack, Box} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import FeaturesSection from '../components/FeaturesSection';
import TailwindButton from '../components/TailwindButton';

const MotionButton = motion(Button);

const LandingPage = () => {
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
        <Box
            w="100%"
            bg="brand.100" // Use your theme color
            p={4}
            color="white"
            textAlign="center"
            >
            <Text fontSize="3xl" fontWeight="bold" color="white">
                QueuedUp
            </Text>
        </Box>
            <Flex className="landing-page-flex" bgImage={`${process.env.PUBLIC_URL}/landing.jpg`} 
             position="relative"
             minHeight={{ base: "80vh", md: "70vh" }}
            

            >
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="blackAlpha.600" // Adjust the transparency
                borderRadius="lg"
                width={{ base: "90%", md: "80%", lg: "60%" }}
                p={6}
               // Set a max-width if necessary
                maxWidth="3xl" // Example max-width
            >
                <VStack spacing={4}>
                    <Text color="white" fontSize="5xl" fontWeight="bold" letterSpacing="wide" textAlign="center">
                    Never Miss A Release!
                    </Text>
                    <Text color="white" fontSize="xl">
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
                    onClick={navigateToHomePage}
                    color="white"
                    bg="brand.100"
                    width="auto"
                    px={10} // Increase padding on the sides for a wider button
                    >
                    Get Started
                    </MotionButton>
                </VStack>
                </Box>
            </Flex>
            <div className="gradient-divider"></div> 
            <Box bg="white" py={0} px= {10}>
            <FeaturesSection />
            </Box>
            <div className="gradient-divider"></div> 
            <Box
            textAlign="center"
            pb={12}
            pt={0} 
            bg="white" // Soft background color
            >
            <Text fontSize="3xl" fontWeight="bold" mb={4}>
                Don't Let the Story End
            </Text>
            <Text fontSize="xl" mb={6}>
                Let us remind you when your favorite book, movie, or TV series continues.
            </Text>
            <TailwindButton onClick={navigateToHomePage} className="text-lg px-10">
                Get Started Now
            </TailwindButton>
            </Box>
        </>
    );
};

export default LandingPage;
