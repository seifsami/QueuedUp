import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useToast,
  FormLabel,
  Input,
  FormControl,
  Flex,
  Box,
  VStack,
  Text,
  Fade,
  CheckboxGroup,
  Checkbox,
  HStack,
  IconButton,
  Tooltip,
  Icon,
  FormErrorMessage,
} from '@chakra-ui/react';
import firebase from '../firebaseConfig';
import { useModal } from '../ModalContext';
import { FaGoogle, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { registerUser, getUserProfile } from '../services/api'; // Import API calls

function OnboardingModal() {
  const { isModalOpen, closeModal, itemToAdd } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notificationPreference, setNotificationPreference] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneError, setPhoneError] = useState('');
  const [firstName, setFirstName] = useState('');  // Add first name state
const [lastName, setLastName] = useState('');

  const handleGoBack = () => {
    setCurrentStep((currentStep) => currentStep - 1);
  };

  const resetModalState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setPhoneNumber('');
    setNotificationPreference([]);
    setCurrentStep(1);
    setPasswordError('');
    setPhoneError('');
    setIsLogin(true);
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
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
    return true;
  };

  const handleEmailSignIn = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      const firebaseUserId = firebaseUser.uid.trim(); // Ensure no newline in the ID

      // Fetch user profile from backend
      const response = await getUserProfile(firebaseUserId);
      const userProfile = response.data;

      toast({
        title: 'Logged in',
        description: `Welcome back, ${userProfile.username || 'User'}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (itemToAdd) {
        console.log('Item added:', itemToAdd.title);
        toast({
          title: 'Success!',
          description: `${itemToAdd.title} has been added.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }

      resetModalState();
      closeModal(); // Close modal after successful login
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      }

      toast({
        title: 'Error logging in',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEmailSignUp = async () => {
    if (!validatePassword()) {
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      console.log('Firebase user created:', firebaseUser.uid.trim());

      // Go to personalization step (Step 2)
      setCurrentStep(2);
    } catch (error) {
      let errorMessage = error.message;
  
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please sign in instead.";
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }
  
      toast({
        title: "Sign-Up Error",
        description: errorMessage,
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
      const firebaseUser = result.user;

      const firebaseUserId = firebaseUser.uid.trim(); // Trim any newline characters

      // Check if user exists in backend
      try {
        await getUserProfile(firebaseUserId);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        resetModalState();
        closeModal();
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // If user is new
          toast({
            title: 'New User Detected',
            description: 'Please complete your profile.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          setCurrentStep(2); // Go to personalization step
        } else {
          throw err; // Handle unexpected errors
        }
      }
    } catch (error) {
      toast({
        title: 'Google Sign-In Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePersonalizationComplete = async () => {
    
    if (notificationPreference.includes('mobile') && !phoneNumber) {
      setPhoneError('A phone number is required for mobile notifications.');
      toast({
        title: 'Phone Number Required',
        description: 'You must provide a phone number to receive SMS notifications.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; // Exit the function to prevent closing the modal
    }

    setPhoneError(''); // Clear any phone error

    // Register user after personalization step
    try {
      const firebaseUser = firebase.auth().currentUser;
      const firebaseUserId = firebaseUser.uid.trim();

      const userData = {
        email: firebaseUser.email,
        firebase_id: firebaseUserId,
        username,
        first_name: firstName,  // Use `firstName` from the state
        last_name: lastName,
        phone_number: phoneNumber,
        notification_preferences: notificationPreference,
      };

      console.log('Sending user data:', {
        email: firebaseUser.email,
        firebase_id: firebaseUserId,
        username,
        phone_number: phoneNumber,
        notification_preferences: notificationPreference,
      });

      await registerUser(userData); // Backend API call to register user

      toast({
        title: 'Account Created',
        description: 'You can now start using QueuedUp!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      resetModalState();
      closeModal();
    } catch (error) {
      toast({
        title: 'Error Saving Profile',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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

  useEffect(() => {
    const requiresPhoneNumber = notificationPreference.includes('mobile');
    if (requiresPhoneNumber && !phoneNumber) {
      setPhoneError('A phone number is required for mobile notifications.');
    } else {
      setPhoneError('');
    }
  }, [notificationPreference, phoneNumber]);

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="md" m="4" p="4">
        <ModalHeader>
          <Flex justifyContent="space-between" alignItems="center">
            {currentStep > 1 && (
              <IconButton
                icon={<FaArrowLeft />}
                variant="ghost"
                onClick={handleGoBack}
                aria-label="Back"
                isRound
                ml={-7}
              />
            )}
            {currentStep === 1 ? (
              <Box flex="1" fontSize="lg" fontWeight="bold">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Box>
            ) : (
              <Box width="auto" fontSize="lg" fontWeight="bold">
                {currentStep === 2 ? 'Personalize Your Experience' : 'Add Your First Item'}
              </Box>
            )}
            {currentStep === 1 && (
              <Button variant="link" onClick={isLogin ? switchToSignUp : switchToSignIn} color={'brand.100'}>
                {isLogin ? "I don't have an account" : 'I have an account'}
              </Button>
            )}
            {currentStep > 1 && <Box />}
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
                  {!isLogin && (
                    <>
                      <FormControl id="confirm-password" isRequired>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input type="password" onChange={handlePasswordConfirmChange} />
                        {passwordError && <Text color="red.500" fontSize="sm">{passwordError}</Text>}
                      </FormControl>
                      <Text fontSize="xs" textAlign="center">
                        By continuing, you agree to the Privacy Policy and Terms, and to receive emails from
                        QueuedUp.
                      </Text>
                    </>
                  )}
                  <Button
                    color={'white'}
                    bgColor={'brand.100'}
                    width="full"
                    onClick={isLogin ? handleEmailSignIn : handleEmailSignUp}
                  >
                    {isLogin ? 'Sign in' : 'Sign up'}
                  </Button>
                  <Box pt={0.5} pb={0.5} width="full" textAlign="center">
                    OR
                  </Box>
                  <Button width="full" variant="outline" leftIcon={<FaGoogle />} onClick={handleGoogleSignIn}>
                    {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                  </Button>
                  {isLogin && (
                    <Text mt={2} fontSize="xs" textAlign="center">
                      Can't sign in?
                    </Text>
                  )}
                </VStack>
              </Fade>
            </ModalBody>
          </Fade>
        )}
        {currentStep === 2 && (
          <Fade in={true}>
            <ModalBody>
              <VStack spacing={4}>
              <FormControl id="first_name" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </FormControl>

            <FormControl id="last_name" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </FormControl>
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
                    <Tooltip
                      label="We will notify you about new releases according to your preferences."
                      hasArrow
                      shouldWrapChildren
                    >
                      <span>
                        <Icon as={FaInfoCircle} color="gray.500" />
                      </span>
                    </Tooltip>
                  </HStack>
                  <CheckboxGroup value={notificationPreference} onChange={(values) => setNotificationPreference(values)}>
                    <HStack>
                      <Checkbox value="email">Email</Checkbox>
                      <Checkbox value="mobile">Mobile</Checkbox>
                    </HStack>
                  </CheckboxGroup>
                </FormControl>
                <Button
                  color={'white'}
                  bgColor={'brand.100'}
                  width="full"
                  onClick={handlePersonalizationComplete}
                  isDisabled={phoneError !== ''}
                >
                  Finish
                </Button>
              </VStack>
            </ModalBody>
          </Fade>
        )}
      </ModalContent>
    </Modal>
  );
}

export default OnboardingModal;
