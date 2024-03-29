import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody,
  ModalCloseButton, Button, Image, Text, Flex, Box
} from '@chakra-ui/react';

const DetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) {
    return null; // Don't render the modal if item is null
  }

  const handleNotifyMe = () => {
    // Implement the logic for Notify Me action
    console.log('Notify Me clicked for item:', item.title);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }} isCentered>
      <ModalOverlay />
      <ModalContent 
        maxWidth={{ base: "96%", md: "70%" }}
        overflowY="auto"
        m={{ base: 2, md: 0 }}
      >
        <ModalCloseButton />
        <ModalBody>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            alignItems={{ base: "center", md: "start" }} 
            justifyContent="center"
          >
            <Box flexShrink={0} mb={{ base: 4, md: 0 }} textAlign={{ base: "center", md: "left" }}>
              <Image
                src={item.image}
                alt={item.title}
                width={{ base: "30vh", md: "50vh" }}
                height={{ base: "30vh", md: "50vh" }}
                mt = {6}
                objectFit="contain"
              />
            </Box>
            <Box flex="1" px={{ base: 2, md: 4 }}>
              <Text fontSize="2xl" fontWeight="bold" mt = {{base:"0", md:"30px"}} mb={2} textAlign={{ base: "center", md: "left" }}>
                {item.title}
              </Text>
              {item.author && (
                <Text fontSize="lg" mb={2} textAlign={{ base: "center", md: "left" }}>
                  Author: {item.author}
                </Text>
              )}
              <Text fontSize="lg" mb={2} textAlign={{ base: "center", md: "left" }}>
                Release Date: {new Date(item.releaseDate).toLocaleDateString()}
              </Text>
              {item.description && (
                <Text fontSize="md" textAlign={{ base: "center", md: "left" }}>
                  Description: {item.description}
                </Text>
              )}
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="green" size="lg" mr={3} onClick={handleNotifyMe}>
            Notify Me!
          </Button>
          <Button colorScheme="teal" size="md" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
