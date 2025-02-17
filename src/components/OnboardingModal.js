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
import { isInAppBrowser } from '../utils/browserHelpers';

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
  const [isResetModalOpen, setIsResetModalOpen] = useState(false); // For password reset modal
  const [resetEmail, setResetEmail] = useState(''); // Email input for reset
  const [resetLoading, setResetLoading] = useState(false); // Loading state for reset button
  const [isResetMode, setIsResetMode] = useState(false);  // Add this state



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

      // Register user immediately after Firebase auth
      const username = generateUsername(email);
      
      const urlParts = window.location.href.split('#')[0];
      const url = new URL(urlParts);
      const utm_source = url.searchParams.get('utm_source') || '';
      const utm_medium = url.searchParams.get('utm_medium') || '';
      const utm_campaign = url.searchParams.get('utm_campaign') || '';

      const userData = {
        email: firebaseUser.email,
        firebase_id: firebaseUser.uid.trim(),
        username,
        first_name: '',
        last_name: '',
        phone_number: '',
        notification_preferences: ['email'],
        utm_source,
        utm_medium,
        utm_campaign
      };

      await registerUser(userData);

      toast({
        title: 'Account Created',
        description: 'Welcome to QueuedUp!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      resetModalState();
      closeModal();
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
    if (isInAppBrowser()) {
      toast({
        title: "Open in Browser",
        description: "For security reasons, please open this page in your browser to sign in with Google.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });

      // Attempt to open in an external browser (will only work on some devices)
      const url = window.location.href;
      window.location.href = `googlechrome://${url.replace(/^https?:\/\//, '')}`;

      return;  // Exit the function to prevent sign-in from continuing
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const firebaseUser = result.user;
      const firebaseUserId = firebaseUser.uid.trim();

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
          // Register new Google user
          const username = generateUsername(firebaseUser.email);
          
          const urlParts = window.location.href.split('#')[0];
          const url = new URL(urlParts);
          const utm_source = url.searchParams.get('utm_source') || '';
          const utm_medium = url.searchParams.get('utm_medium') || '';
          const utm_campaign = url.searchParams.get('utm_campaign') || '';

          const userData = {
            email: firebaseUser.email,
            firebase_id: firebaseUserId,
            username,
            first_name: firebaseUser.displayName ? firebaseUser.displayName.split(' ')[0] : '',
            last_name: firebaseUser.displayName ? firebaseUser.displayName.split(' ').slice(1).join(' ') : '',
            phone_number: '',
            notification_preferences: ['email'],
            utm_source,
            utm_medium,
            utm_campaign
          };

          await registerUser(userData);
          
          toast({
            title: 'Account Created',
            description: 'Welcome to QueuedUp!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          resetModalState();
          closeModal();
        } else {
          throw err;
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

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email to reset your password.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    setResetLoading(true);
    try {
      await firebase.auth().sendPasswordResetEmail(resetEmail);  // Firebase password reset
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for the reset link.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsResetModalOpen(false);  // Close the modal after success
      setResetEmail('');  // Clear the input field
    } catch (error) {
      toast({
        title: 'Reset Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setResetLoading(false);
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

  // Add helper function to generate username
  const generateUsername = (email) => {
    // Remove domain and special characters, add random numbers
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    return `${baseUsername}${randomNum}`;
  };

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
            <Box flex="1" fontSize="lg" fontWeight="bold">
              {isResetMode ? 'Reset Password' : isLogin ? 'Sign In' : 'Sign Up'}
            </Box>
            {currentStep === 1 && !isResetMode && (
              <Button variant="link" onClick={isLogin ? switchToSignUp : switchToSignIn} color={'brand.100'}>
                {isLogin ? "I don't have an account" : 'I have an account'}
              </Button>
            )}
            {currentStep > 1 && <Box />}
          </Flex>
        </ModalHeader>
  
        {/* Step 1: Login/Signup/Reset */}
        {currentStep === 1 && (
          <Fade in={true}>
            <ModalBody>
              <Fade in={true}>
                <VStack spacing={4}>
                  {isResetMode ? (
                    <>
                      {/* Password Reset Form */}
                      <FormControl id="resetEmail" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </FormControl>
                      <Button
                        color="white"
                        bgColor="brand.100"
                        width="full"
                        onClick={handlePasswordReset}
                        isLoading={resetLoading}
                      >
                        Send Reset Link
                      </Button>
                      <Button variant="link" onClick={() => setIsResetMode(false)} mt={2} color="teal.500">
                        Back to Sign In
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Sign In / Sign Up Form */}
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
                        <Text
                          mt={2}
                          fontSize="xs"
                          textAlign="center"
                          color="teal.500"
                          cursor="pointer"
                          onClick={() => setIsResetMode(true)}
                        >
                          Forgot Password?
                        </Text>
                      )}
                    </>
                  )}
                </VStack>
              </Fade>
            </ModalBody>
          </Fade>
        )}
      </ModalContent>
    </Modal>
  );
  
  
}

export default OnboardingModal;
