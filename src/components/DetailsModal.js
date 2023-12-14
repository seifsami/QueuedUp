import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Image, Text } from '@chakra-ui/react';

const DetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) {
    return null; // Don't render the modal if item is null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{item.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={item.image}
            alt={item.title}
            width="100%"
            height="auto"
            marginBottom="20px"
            objectFit="contain"
          />
          <Text fontSize="lg">Release Date: {new Date(item.releaseDate).toLocaleDateString()}</Text>
          {/* Add more details as needed */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
