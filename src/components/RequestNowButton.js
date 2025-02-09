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

const RequestNowButton = ({ currentUser }) => {
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
      userId: currentUser ? currentUser.uid : null,
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
        <ModalContent p={4}> 
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

          <ModalFooter mt={4} display="flex" flexDirection="column"> 
            <Button
              colorScheme="brand"
              bg="brand.100"
              color="white"
              fontWeight="bold"
              width="full"
              onClick={handleSubmit}
              _hover={{ bg: 'brand.700' }} 
            >
              Submit Request
            </Button>
            <Button
              variant="ghost"
              mt={2} 
              color="brand.500"
              width="full"
              _hover={{ textDecoration: 'underline', color: 'gray.800' }} 
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RequestNowButton;
