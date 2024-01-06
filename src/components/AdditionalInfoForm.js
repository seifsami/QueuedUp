// AdditionalInfoForm.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Stack,
} from '@chakra-ui/react';

const AdditionalInfoForm = ({ isOpen, onClose, onAddItemToList }) => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notifications, setNotifications] = useState({ email: true, sms: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the additional info (You will need to handle this part)
    // ...

    // Require the user to add an item to their list before completing the sign-up
    onAddItemToList();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete Your Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Phone Number (optional)</FormLabel>
              <Input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Notification Preferences</FormLabel>
              <Stack spacing={5} direction="row">
                <Checkbox
                  isChecked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                >
                  Email
                </Checkbox>
                <Checkbox
                  isChecked={notifications.sms}
                  onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                >
                  SMS
                </Checkbox>
              </Stack>
            </FormControl>
            <Button mt={4} colorScheme="blue" type="submit">
              Save and Continue
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdditionalInfoForm;
