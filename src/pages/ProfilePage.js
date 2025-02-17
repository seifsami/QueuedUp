import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Avatar, Text, VStack, Heading, Divider, Button,
  useColorModeValue, HStack, Input, Tooltip, Badge, Switch
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import Header from '../components/Header';
import WatchlistPreview from '../components/WatchlistPreview';
import { getUserProfile, updateUserProfile, getUserWatchlist } from '../services/api';

const ProfilePage = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [userWatchlist, setUserWatchlist] = useState([]);
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const firebaseId = user?.uid || 'some_firebase_id';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile(firebaseId);
        
        // Map 'mobile' to 'sms' for UI display
        const mappedPreferences = response.data.notification_preferences.map(pref =>
          pref === 'mobile' ? 'sms' : pref
        );
    
        setUserData(response.data);
        setNotificationPreferences(mappedPreferences);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    const fetchUserWatchlist = async () => {
      try {
        const { data } = await getUserWatchlist(firebaseId);
        setUserWatchlist(data);
      } catch (error) {
        console.error('Failed to load watchlist:', error);
      }
    };

    fetchUserData();
    fetchUserWatchlist();
  }, [firebaseId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const fetchUserData = async () => {
    try {
      const response = await getUserProfile(firebaseId);
      setUserData(response.data);
      setNotificationPreferences(
        response.data.notification_preferences.map(pref => (pref === 'mobile' ? 'sms' : pref))
      );
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };
  

  const handleCancel = async () => {
    setIsEditing(false);
    setEditedData({});
    
    // Refetch to revert any unsaved changes
    await fetchUserData();
  };

  const handleSave = async () => {
    try {
      // Map 'sms' to 'mobile' before sending to the backend
      const formattedPreferences = notificationPreferences.map(pref =>
        pref === 'sms' ? 'mobile' : pref
      );
  
      await updateUserProfile(firebaseId, { ...editedData, notification_preferences: formattedPreferences });
      
      setUserData(editedData);
      setNotificationPreferences(notificationPreferences);
      await fetchUserData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const toggleNotificationPreference = (preference) => {
    if (preference === 'email') {
      return; // Email can't be toggled off
    }

    if (preference === 'sms') {
      // Only allow SMS toggle if phone number exists
      if (isEditing && editedData.phone_number || (!isEditing && userData.phone_number)) {
        setNotificationPreferences((prev) =>
          prev.includes('sms')
            ? prev.filter((pref) => pref !== 'sms')
            : [...prev, 'sms']
        );
      }
    }
  };

  // Add this effect to handle phone number changes
  useEffect(() => {
    if (isEditing && !editedData.phone_number) {
      // Remove 'sms' from notification preferences when phone number is removed
      setNotificationPreferences(prev => prev.filter(pref => pref !== 'sms'));
    }
  }, [isEditing, editedData.phone_number]);

  if (!userData) return <Text>Loading...</Text>;

  return (
    <>
      <Header />
      <Box 
        maxW="1000px" 
        mx="auto" 
        bg="white" 
        p={{ base: 4, md: 8 }} 
        borderRadius="2xl" 
        boxShadow="2xl" 
        mt={{ base: 2, md: 8 }}
      >
        {/* Profile Header */}
        <Flex 
          direction={{ base: "column", md: "row" }} 
          alignItems={{ base: "center", md: "center" }} 
          justifyContent="space-between" 
          mb={8}
        >
          <Flex 
            direction={{ base: "column", md: "row" }} 
            alignItems="center"
            textAlign={{ base: "center", md: "left" }}
          >
            <Avatar 
              size={{ base: "xl", md: "2xl" }} 
              name={`${userData.first_name} ${userData.last_name}`} 
              src={userData.avatar || '../profileplaceholder.jpeg'} 
              mb={{ base: 4, md: 0 }} 
              mr={{ md: 8 }} 
            />
  
            <VStack alignItems={{ base: "center", md: "start" }} spacing={1}>
              {/* Editable Name */}
              {isEditing ? (
                <HStack spacing={2}>
                  <Input
                    name="first_name"
                    value={editedData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    variant="flushed"
                    size="sm"
                  />
                  <Input
                    name="last_name"
                    value={editedData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    variant="flushed"
                    size="sm"
                  />
                </HStack>
              ) : (
                <Heading as="h1" size={{ base: "lg", md: "2xl" }}>
                  {`${userData.first_name} ${userData.last_name}`}
                </Heading>
              )}
  
              {/* Username */}
              <HStack>
                <Text fontWeight="bold">Username:</Text>
                {isEditing ? (
                  <Input
                    name="username"
                    value={editedData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    variant="flushed"
                    size="sm"
                  />
                ) : (
                  <Text fontSize={{ base: "sm", md: "md" }}>@{userData.username}</Text>
                )}
              </HStack>
  
              {/* Email with Tooltip in Edit Mode */}
              <HStack>
                <Text fontWeight="bold">Email:</Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={isEditing ? "gray.400" : "black"}
                  cursor={isEditing ? "not-allowed" : "default"}
                >
                  {userData.email}
                </Text>
  
                {isEditing && (
                  <Tooltip label="For security purposes, please contact us at contact@queuedup.co for email change requests.">
                    <InfoOutlineIcon color="gray.500" ml={2} />
                  </Tooltip>
                )}
              </HStack>
  
              {/* Phone */}
              <HStack>
                <Text fontWeight="bold">Phone:</Text>
                {isEditing ? (
                  <Input
                    name="phone_number"
                    value={editedData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    variant="flushed"
                    size="sm"
                  />
                ) : (
                  <Text fontSize={{ base: "sm", md: "md" }}>{userData.phone_number}</Text>
                )}
              </HStack>
            </VStack>
          </Flex>
  
          {/* Edit / Save Buttons */}
          <HStack 
            spacing={4} 
            mt={{ base: 4, md: 0 }} 
            width={{ base: "100%", md: "auto" }}
            justifyContent={{ base: "center", md: "flex-end" }}
          >
            {isEditing ? (
              <>
                <Button 
                  colorScheme="green" 
                  size={{ base: "sm", md: "md" }} 
                  width={{ base: "50%", md: "auto" }} 
                  leftIcon={<CheckIcon />} 
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button 
                  colorScheme="red" 
                  size={{ base: "sm", md: "md" }} 
                  width={{ base: "50%", md: "auto" }} 
                  leftIcon={<CloseIcon />} 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                colorScheme="teal" 
                size={{ base: "sm", md: "md" }} 
                width={{ base: "100%", md: "auto" }} 
                leftIcon={<EditIcon />} 
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            )}
          </HStack>
        </Flex>
  
        <Divider my={6} />
  
        {/* Notification Preferences */}
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" mb={8}>
          <Heading as="h2" size="lg" mb={4}>Notification Preferences</Heading>
          
          <Flex 
            direction="column"
            gap={4}
          >
            {/* Notification Toggles Row */}
            <Flex 
              direction="row" 
              justify="flex-start" 
              align="center" 
              gap={{ base: 4, md: 8 }}
            >
              {/* Email Preference */}
              <HStack spacing={{ base: 2, md: 3 }}>
                <Text fontSize={{ base: "sm", md: "md" }}>Email:</Text>
                <Switch
                  isChecked={true}
                  colorScheme="green"
                  size="md"
                  isDisabled={true}
                />
                <Badge colorScheme="green" fontSize={{ base: "xs", md: "sm" }}>ENABLED</Badge>
              </HStack>

              {/* SMS Preference */}
              <HStack spacing={{ base: 2, md: 3 }}>
                <Text fontSize={{ base: "sm", md: "md" }}>SMS:</Text>
                <Switch
                  isChecked={notificationPreferences.includes('sms')}
                  onChange={() => toggleNotificationPreference('sms')}
                  colorScheme="green"
                  size="md"
                  isDisabled={
                    !isEditing || 
                    (isEditing && !editedData.phone_number) || 
                    (!isEditing && !userData.phone_number)
                  }
                />
                {notificationPreferences.includes('sms') && 
                  <Badge colorScheme="green" fontSize={{ base: "xs", md: "sm" }}>ENABLED</Badge>
                }
              </HStack>
            </Flex>

            {/* Help Text - Only show when relevant */}
            {isEditing && !editedData.phone_number && (
              <Text fontSize="sm" color="gray.500">
                Enter your phone number to enable SMS notifications (Coming Soon)
              </Text>
            )}
            {notificationPreferences.includes('sms') && editedData.phone_number && (
              <Text fontSize="sm" color="gray.500">
                SMS notifications are coming soon! We'll notify you when this feature is live
              </Text>
            )}
          </Flex>
        </Box>
  
        <Divider my={6} />
  
        {/* Watchlist Preview */}
        <Box>
          <Heading as="h2" size={{ base: "md", md: "lg" }} mb={4}>Your Watchlist</Heading>
          <WatchlistPreview watchlist={userWatchlist} userId={user?.uid} />
        </Box>
      </Box>
    </>
  );
} 

export default ProfilePage;
