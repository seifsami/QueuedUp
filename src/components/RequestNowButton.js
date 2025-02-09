import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { submitRequest } from '../services/api';

const RequestNowButton = ({ currentUser }) => {  // ✅ Accept user as a prop
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [mediaType, setMediaType] = useState('books');
  const [title, setTitle] = useState('');
  const [extraInfo, setExtraInfo] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const requestData = {
      mediaType,
      title,
      extraInfo,
      userId: currentUser ? currentUser.uid : null, // ✅ Use passed `currentUser`
      createdAt: new Date().toISOString(),
    };

    try {
      await submitRequest(requestData);

      toast({
        title: 'Request Submitted',
        description: 'Your request has been sent!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setMediaType('books');
      setTitle('');
      setExtraInfo('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not submit request. Try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button colorScheme="brand" variant="outline" width="full" onClick={onOpen}>
        Request Missing Content
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Missing Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Media Type</FormLabel>
              <Select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                <option value="books">Books</option>
                <option value="tv_seasons">TV Shows</option>
                <option value="movies">Movies</option>
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Optional Extra Info</FormLabel>
              <Textarea
                placeholder="Additional details (optional)..."
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand.100" onClick={handleSubmit}>
              Submit Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RequestNowButton;
