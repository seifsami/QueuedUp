import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Image, Text } from '@chakra-ui/react';

const DetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) {
    return null; // Don't render the modal if item is null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "md", md: "lg" }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{item.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={item.image}
            alt={item.title}
            width="50vh"
            height="50vh"
            marginBottom="20px"
            objectFit="contain"
          />
          <Text fontSize="lg">Release Date: {new Date(item.releaseDate).toLocaleDateString()}</Text>
          {/* Add more details as needed */}
        </ModalBody>
        <ModalFooter>
            <Button  colorScheme="teal" size="sm" flex={2} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
