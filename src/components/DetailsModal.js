import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, Image, Text, Flex, Box
} from '@chakra-ui/react';

const DetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) {
    return null; // Don't render the modal if item is null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }} isCentered>
      <ModalOverlay />
      <ModalContent 
        maxWidth={{ base: "96%", md: "70%" }} // Slightly less than full width on mobile for margin
        overflowY="auto"
        m={{ base: 2, md: 0 }} // Margin on mobile
      >
        <ModalHeader textAlign="center">{item.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            alignItems="center" 
            justifyContent="center"
          >
            <Box flexShrink={0} mb={{ base: 4, md: 0 }}>
              <Image
                src={item.image}
                alt={item.title}
                width={{ base: "30vh", md: "50vh" }}
                height={{ base: "30vh", md: "50vh" }}
                objectFit="contain"
              />
            </Box>
            <Box flex="1" px={{ base: 2, md: 4 }}>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Release Date: {new Date(item.releaseDate).toLocaleDateString()}
              </Text>
              {/* Add more details as needed */}
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="teal" size="md" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
