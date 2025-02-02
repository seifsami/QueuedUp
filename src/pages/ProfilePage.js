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

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleSave = async () => {
    try {
      // Map 'sms' to 'mobile' before sending to the backend
      const formattedPreferences = notificationPreferences.map(pref =>
        pref === 'sms' ? 'mobile' : pref
      );
  
      await updateUserProfile(firebaseId, { ...editedData, notification_preferences: formattedPreferences });
      
      // Keep UI consistent with 'sms' display
      setUserData(editedData);
      setNotificationPreferences(notificationPreferences);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const toggleNotificationPreference = (preference) => {
    setNotificationPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((pref) => pref !== preference)
        : [...prev, preference]
    );
  };

  if (!userData) return <Text>Loading...</Text>;

  return (
    <>
      <Header />
      <Box maxW="1000px" mx="auto" bg="white" p={8} borderRadius="2xl" boxShadow="2xl" mt={8}>
        
        {/* Profile Header */}
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Flex direction={{ base: "column", md: "row" }} alignItems="center">
            <Avatar size="2xl" name={`${userData.first_name} ${userData.last_name}`} src={userData.avatar || '../profileplaceholder.jpeg'} mr={{ md: 8 }} />
            <VStack alignItems="start" spacing={1}>

              {/* Editable Name */}
              {isEditing ? (
                <HStack spacing={2}>
                  <Input
                    name="first_name"
                    value={editedData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    variant="flushed"
                  />
                  <Input
                    name="last_name"
                    value={editedData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    variant="flushed"
                  />
                </HStack>
              ) : (
                <Heading as="h1" size="2xl">{`${userData.first_name} ${userData.last_name}`}</Heading>
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
                  />
                ) : (
                  <Text fontSize="md">@{userData.username}</Text>
                )}
              </HStack>

              {/* Email with Tooltip in Edit Mode */}
              <HStack>
                <Text fontWeight="bold">Email:</Text>
                
                {/* Conditionally grey out in edit mode */}
                <Text
                  fontSize="md"
                  color={isEditing ? "gray.400" : "black"}  // Greyed out only when editing
                  cursor={isEditing ? "not-allowed" : "default"}
                >
                  {userData.email}
                </Text>

                {/* Show tooltip only in edit mode */}
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
                  />
                ) : (
                  <Text fontSize="md">{userData.phone_number}</Text>
                )}
              </HStack>
            </VStack>
          </Flex>

          {/* Edit / Save Buttons */}
          {isEditing ? (
            <HStack spacing={4}>
              <Button colorScheme="green" size="md" leftIcon={<CheckIcon />} onClick={handleSave}>Save</Button>
              <Button colorScheme="red" size="md" leftIcon={<CloseIcon />} onClick={handleCancel}>Cancel</Button>
            </HStack>
          ) : (
            <Button colorScheme="teal" size="md" leftIcon={<EditIcon />} onClick={handleEdit}>Edit Profile</Button>
          )}
        </Flex>

        <Divider my={6} />

        {/* Notification Preferences */}
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" mb={8}>
          <Heading as="h2" size="lg" mb={4}>Notification Preferences</Heading>
          <HStack spacing={6}>
            <HStack>
              <Text>Email:</Text>
              <Switch
                isChecked={notificationPreferences.includes('email')}
                onChange={() => toggleNotificationPreference('email')}
                colorScheme= 'green'
                size="lg"
                isDisabled={!isEditing}
              />
              {notificationPreferences.includes('email') && <Badge colorScheme="green">ENABLED</Badge>}
            </HStack>

            <HStack>
              <Text>SMS:</Text>
              <Switch
                isChecked={notificationPreferences.includes('sms')}
                onChange={() => toggleNotificationPreference('sms')}
                colorScheme="green"
                size="lg"
                isDisabled={!isEditing}
              />
              {notificationPreferences.includes('sms') && <Badge colorScheme="green">ENABLED</Badge>}
            </HStack>
          </HStack>
        </Box>

        <Divider my={6} />

        {/* Watchlist Preview */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>Your Watchlist</Heading>
          <WatchlistPreview watchlist={userWatchlist} />
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
