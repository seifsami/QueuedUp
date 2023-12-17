import React, { useState,useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, ModalCloseButton, FormLabel, Input, FormControl, Flex, Box, VStack, Text,Fade, background, CheckboxGroup, Checkbox, HStack, IconButton, Progress, Tooltip, Icon, FormErrorMessage} from '@chakra-ui/react';
import firebase from '../firebaseConfig';
import { useModal } from '../ModalContext';
import { FaGoogle, FaArrowLeft, FaInfoCircle} from 'react-icons/fa';
import OnboardingSearchBar from './OnboardingSearchBar';
import WatchlistPreviewCard from './WatchlistPreviewCard';






function OnboardingModal() {
  const { isModalOpen, closeModal, itemToAdd } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const onClose={closeModal}
  const [isLogin, setIsLogin] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notificationPreference, setNotificationPreference] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneError, setPhoneError] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [groupedResults, setGroupedResults] = useState({});
  

  const handleGoBack = () => {
    // Logic to go back a step
    setCurrentStep(currentStep => currentStep - 1);
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleSuccessfulAuth = () => {
    if (itemToAdd) {
        // Logic to add the item to the user's watchlist
        toast({
          title: "Item added to your watchlist",
          description: `${itemToAdd.title} has been added to your watchlist.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      console.log('Selected items:', Array.from(selectedItems));
      closeModal(); // Close the modal after successful authentication
    };

    const handleEmailSignIn = async () => {
        try {
          // Try to sign in with the provided email and password.
          await firebase.auth().signInWithEmailAndPassword(email, password);
          toast({
            title: "Logged in",
            description: "You have successfully logged in!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          if (itemToAdd) {
            console.log('Item added:', itemToAdd.title);
            toast({
              title: 'Success!',
              description: `Success! ${itemToAdd.title} has been added`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
        }
          closeModal();// Close the modal after successful login
        } catch (error) {
          // Handle errors during sign-in
          let errorMessage = error.message;
      
          // Customize error message for common errors
          if (error.code === 'auth/user-not-found') {
            errorMessage = "No user found with this email. Please sign up.";
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Incorrect password. Please try again.";
          } // Add more error code conditions as needed
      
          toast({
            title: "Error logging in",
            description: errorMessage,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };

      const handleEmailSignUp = async () => {
        if (!validatePassword()) {
          // If the password does not meet your criteria, exit the function.
          return;
        }
        if (password !== confirmPassword) {
          // If the passwords do not match, set an error and exit the function.
          setPasswordError('Passwords do not match.');
          return;
        }
        try {
          // Try to create a new account with the provided email and password.
          const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
          
          setCurrentStep(2);
          
        } catch (error) {
          // Handle errors for account creation, like weak password.
          toast({
            title: "Error signing up",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };
      
      

      const handleGoogleSignIn = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
          const result = await firebase.auth().signInWithPopup(provider);
          const isNewUser = result.additionalUserInfo.isNewUser;
          toast({
            title: isNewUser ? "Welcome!" : "Welcome back!",
            description: isNewUser ? "Let's personalize your experience." : "You have successfully signed in!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          if (isNewUser) {
            setCurrentStep(2);
          
          } else {
            if (itemToAdd) {
                console.log('Item added:', itemToAdd.title);
                toast({
                  title: 'Success!',
                  description: `Success! ${itemToAdd.title} has been added`,
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
            
        }
        closeModal();
          }
        } catch (error) {
          // Handle errors
        }
      };

      

      
      const switchToSignUp = () => {
        setIsLogin(false); // Switch to the sign-up view
        setCurrentStep(1); // Stay on the first step for the sign-up view
      };
    
      const switchToSignIn = () => {
        setIsLogin(true); // Switch to the sign-in view
        setCurrentStep(1); // Stay on the first step for the sign-in view
      };

      const handlePasswordConfirmChange = (e) => {
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
          setPasswordError('Passwords do not match');
        } else {
          setPasswordError('');
        }
      };

      const validatePassword = () => {
        if (password.length < 8) {
          setPasswordError('Password must be at least 8 characters');
          return false;
        }
        if (!/\d/.test(password)) {
          setPasswordError('Password must include a number');
          return false;
        }
        // Add any other password requirements here
        return true;
      };
      
      const handlePersonalizationComplete = () => {
        // Validate phone number if mobile notifications are selected
        if (notificationPreference.includes('mobile') && !phoneNumber) {
          setPhoneError('A phone number is required for mobile notifications.');
          toast({
            title: "Phone Number Required",
            description: "You must provide a phone number to receive SMS notifications.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return; // Exit the function to prevent closing the modal
        }
      
        // Clear any phone error
        setPhoneError('');
      
        // Handle different scenarios based on itemToAdd
        if (itemToAdd) {
          // Scenario when an item is to be added
          console.log('Item added:', itemToAdd.title);
          toast({
            title: 'Success!',
            description: `Success! Account Created`,
            status: 'success',
            duration: 10000,
            isClosable: true,
          });
          toast({
            title: 'Success!',
            description: `Success! ${itemToAdd.title} has been added`,
            status: 'success',
            duration: 10000,
            isClosable: true,
          });
          closeModal(); // Close the modal after adding the item
        } else {
            toast({
                title: 'Success!',
                description: `Success! Account Created`,
                status: 'success',
                duration: 10000,
                isClosable: true,
            });
            closeModal()
        
        }
      };
      

      useEffect(() => {
        const requiresPhoneNumber = notificationPreference.includes('mobile');
        if (requiresPhoneNumber && !phoneNumber) {
         
        } else {
          setPhoneError('');
        }
      }, [notificationPreference, phoneNumber]);

      const handleSelectItem = (item) => {
        setSelectedItems(prev => {
          const newSelection = new Set(prev);
          if (newSelection.has(item.id)) {
            newSelection.delete(item.id);
          } else {
            newSelection.add(item.id);
          }
          return newSelection;
        });
      };
    
    

      return (
        <Modal isOpen={isModalOpen} onClose={closeModal} isCentered size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="md" m="4" p="4">
            
            <ModalHeader>
  <Flex justifyContent="space-between"  alignItems="center" >
    {currentStep > 1 && (
      <IconButton
      
        icon={<FaArrowLeft />}
        variant="ghost"
        onClick={handleGoBack}
        aria-label="Back"
        isRound // Optional: for a round button
        ml={-7}
      />
    )}
    {currentStep === 1 ? (
      <Box flex="1"  fontSize="lg" fontWeight="bold">
        {isLogin ? 'Sign In' : 'Sign Up'}
        
      </Box>
    ) : (
    
      <Box width="auto" fontSize="lg" fontWeight="bold">
       {currentStep === 2 ? 'Personalize Your Experience' : 'Add Your First Item'}
      </Box>
    )}
    {currentStep === 1 && (
      <Button
        variant="link"
        onClick={isLogin ? switchToSignUp : switchToSignIn}
        color={"brand.100"}
      >
        {isLogin ? "I don't have an account" : "I have an account"}
      </Button>
    )}
    {currentStep > 1 && <Box />} {/* This empty Box acts as a spacer */}
  </Flex>
</ModalHeader>
            
            {currentStep === 1 && (
              <Fade in={true}>
                <ModalBody>
                    <Fade in={true}>
                        <VStack spacing={4}>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" onChange={handleEmailChange} />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" onChange={handlePasswordChange} />
                        </FormControl>
                        { !isLogin && 
                            <>
                            <FormControl id="confirm-password" isRequired>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input type="password" onChange={handlePasswordConfirmChange} />
                                {passwordError && <Text color="red.500" fontSize="sm">{passwordError}</Text>}
                            </FormControl>
                            <Text fontSize="xs" textAlign="center">
                            By continuing, you agree to the Privacy Policy and Terms, and to receive emails from QueuedUp.
                            </Text>
                            </>
                        }
                        <Button
                            color={"white"}
                            bgColor={"brand.100"}
                            width="full"
                            onClick={isLogin ? handleEmailSignIn : handleEmailSignUp}
                        >
                            {isLogin ? 'Sign in' : 'Sign up'}
                        </Button>
                        <Box pt={0.5} pb={0.5} width="full" textAlign="center">
                            OR
                        </Box>
                        <Button
                            width="full"
                            variant="outline"
                            leftIcon={<FaGoogle />}
                            onClick={handleGoogleSignIn}
                        >
                            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                        </Button>
                        { isLogin && 
                            <Text mt={2} fontSize="xs" textAlign="center">
                            Can't sign in?
                            </Text>
                        }
                        </VStack>
                    </Fade>
                </ModalBody>
              </Fade>
            )}
            {currentStep ===2  && (
              <>
                <Fade in={true}>
                <ModalBody>
                    <VStack spacing={4}>
                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </FormControl>
                    <FormControl id="phoneNumber" isInvalid={phoneError}>
                    <FormLabel>Phone Number (optional)</FormLabel>
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    {!phoneError ? null : <FormErrorMessage>{phoneError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="notificationPreferences">
                    <HStack spacing={1}>
                    <FormLabel mr={0.5}>Notification Preferences</FormLabel>
                    <Tooltip  label="We will notify you about new releases according to your preferences." hasArrow shouldWrapChildren>
                        <span>
                        <Icon as={FaInfoCircle} color="gray.500" />
                        </span>
                    </Tooltip>
                    </HStack>
                    <CheckboxGroup
                        value={notificationPreference}
                        onChange={(values) => setNotificationPreference(values)}
                      >
                        <HStack>
                            <Checkbox value="email">Email</Checkbox>
                            <Checkbox value="mobile">Mobile</Checkbox>
                        </HStack>
                    </CheckboxGroup>
                    </FormControl>
                    <Button
                        color={"white"}
                        bgColor={"brand.100"}
                        width="full"
                        onClick={handlePersonalizationComplete}
                        isDisabled={phoneError !== ''}
                    >
                      Finish
                    </Button>
                    </VStack>
          </ModalBody>
                </Fade>
            
              </>
              
            )}
           {currentStep === 3 && (
      <Fade in={true}>
        <ModalBody>
          <OnboardingSearchBar
            onSelectItem={handleSelectItem}
            selectedItems={selectedItems}
          />
          {/* Scrollable container for selected items */}
          <Box maxHeight="300px" overflowY="auto">
            {Array.from(selectedItems).map(itemId => {
              const item = groupedResults.find(item => item.id === itemId); // Find item by ID
              return (
                <WatchlistPreviewCard
                  key={item.id}
                  item={item}
                  // Optional: onClick to deselect
                />
              );
            })}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            isDisabled={selectedItems.size === 0}
            onClick={handleSuccessfulAuth} // Your function to finalize creation
          >
            Add Selected Items
          </Button>
        </ModalFooter>
      </Fade>
        )}
          </ModalContent>
        </Modal>
      );
    }
    
    export default OnboardingModal;