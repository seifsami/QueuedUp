import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Grid,
  GridItem,
  useToast,
  IconButton,
  Divider,
  Switch,
  Icon
} from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaReddit, FaInstagram, FaTiktok, FaSun, FaMoon, FaDownload, FaPencilAlt } from 'react-icons/fa';
import domtoimage from 'dom-to-image';

const SharePreviewModal = ({ isOpen, onClose, selectedItems }) => {
  const previewRef = useRef(null);
  const toast = useToast();
  const [isDark, setIsDark] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [title, setTitle] = useState('My Most Anticipated Releases');
  const [isEditing, setIsEditing] = useState(false);

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Release date TBA';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Release date TBA';
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      });
    } catch (error) {
      return 'Release date TBA';
    }
  };

  const getProxiedImageUrl = (originalUrl) => {
    console.log('calling function')
    if (!originalUrl) return null;
    // Check for ISBNDB URL
    if (originalUrl.includes('isbndb.com')) {
      const imagePath = originalUrl.split('isbndb.com')[1];
      return `https://queuedup-backend-6d9156837adf.herokuapp.com/proxy-image/isbndb/images.isbndb.com${imagePath}`;
    }
    // Extract the image path from TMDB URL
    const match = originalUrl.match(/\/t\/p\/\w+\/.+/);
    if (match) {
      const imagePath = match[0];
      return `https://queuedup-backend-6d9156837adf.herokuapp.com/proxy-image/tmdb${imagePath}`;
    }
    return originalUrl;
  };

  const preloadImages = async () => {
    try {
      console.log('Starting to preload images...');
      const loadedImagesMap = {};
      
      await Promise.all(
        selectedItems.map(
          (item) =>
            new Promise((resolve, reject) => {
              const img = new window.Image();  // Use native Image constructor
              const proxiedUrl = getProxiedImageUrl(item.image);
              img.crossOrigin = "anonymous";
              img.onload = () => {
                console.log(`Loaded image: ${item.title}`);
                loadedImagesMap[item.item_id] = proxiedUrl;
                resolve(img);
              };
              img.onerror = () => {
                console.error(`Failed to load image: ${item.title}`);
                reject(new Error(`Failed to load image: ${item.title}`));
              };
              img.src = proxiedUrl;
            })
        )
      );
      
      setLoadedImages(loadedImagesMap);
      console.log('All images preloaded successfully');
    } catch (error) {
      console.error('Error preloading images:', error);
      throw error;
    }
  };

  const handleSaveTitle = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTitle('My Most Anticipated Releases');
    setIsEditing(false);
  };

  const generateImage = async () => {
    try {
      setIsGenerating(true);
      setIsEditing(false); // Ensure editing is off
      console.log('Starting image generation...');

      // First preload all images
      await preloadImages();

      // Use dom-to-image to generate the canvas
      const dataUrl = await domtoimage.toPng(previewRef.current);
      console.log('Image generated successfully');
      setIsGenerating(false);
      return dataUrl;
    } catch (error) {
      console.error('Error in generateImage:', error);
      setIsGenerating(false);
      throw error;
    }
  };

  const handleDownload = async () => {
    try {
      const image = await generateImage();
      const link = document.createElement('a');
      link.href = image;
      link.download = 'queuedup-watchlist.png';
      link.click();
      
      toast({
        title: "Image saved!",
        description: "Share it anywhere you like",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading:', error);
      toast({
        title: "Error downloading",
        description: "Please try again",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg={isDark ? "gray.900" : "white"}>
        <ModalHeader display="flex" justifyContent="space-between" alignItems="center" pr={16}>
          <Text color={isDark ? "white" : "gray.800"}>Share Your Watchlist</Text>
          <HStack spacing={2}>
            <Icon as={FaSun} color={isDark ? "gray.400" : "yellow.500"} />
            <Switch 
              isChecked={isDark}
              onChange={(e) => setIsDark(e.target.checked)}
              colorScheme="brand"
            />
            <Icon as={FaMoon} color={isDark ? "blue.200" : "gray.400"} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton color={isDark ? "white" : "gray.800"} />
        <ModalBody pb={6}>
          <VStack spacing={6}>
            {/* Preview Section */}
            <Box 
              ref={previewRef}
              bg={isDark ? "gray.900" : "gray.100"}
              p={8}
              borderRadius="lg"
              width="100%"
              maxW="800px"
            >
              <VStack spacing={6} align="stretch">
                <HStack justifyContent="center" alignItems="center" mb={4}>
                  {isEditing ? (
                    <>
                      <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, 30))} // Limit to 30 characters
                        style={{
                          fontSize: '3xl',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          color: isDark ? 'white' : 'gray.800',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          width: '100%',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      />
                      <Text fontSize="sm" color="gray.500">{title.length}/30</Text>
                      <Button size="sm" onClick={handleSaveTitle} colorScheme="brand">Save</Button>
                      <Button size="sm" onClick={handleCancelEdit} variant="outline">Cancel</Button>
                    </>
                  ) : (
                    <Text 
                      fontSize="3xl" 
                      fontWeight="bold" 
                      textAlign="center"
                      color={isDark ? "white" : "gray.800"}
                      onClick={() => setIsEditing(true)}
                      cursor="pointer"
                    >
                      {title}
                    </Text>
                  )}
                </HStack>
                
                <Grid 
                  templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
                  gap={6}
                >
                  {selectedItems.map((item) => (
                    <GridItem key={item.item_id}>
                      <Box 
                        bg={isDark ? "gray.800" : "white"}
                        borderRadius="lg"
                        overflow="hidden"
                        height="260px"
                        border={isDark ? "none" : "1px solid #E2E8F0"}
                      >
                        <VStack height="100%" spacing={0}>
                          <Box width="100%" height="180px" position="relative" pb={0}>
                            <Image
                              src={loadedImages[item.item_id] || getProxiedImageUrl(item.image)}
                              alt={item.title}
                              width="100%"
                              height="100%"
                              objectFit="cover"
                              loading="eager"
                              crossOrigin="anonymous"
                            />
                          </Box>
                          <Box p={3} width="100%" minH="70px" display="flex" flexDirection="column" justifyContent="space-between">
                            <Text 
                              fontSize="sm"
                              fontWeight="bold"
                              color={isDark ? "white" : "gray.800"}
                              textAlign="left"
                              overflow="hidden"
                              display="-webkit-box"
                              WebkitLineClamp={2}
                              WebkitBoxOrient="vertical"
                              lineHeight="1.2em"
                              height="2.4em"
                            >
                              {item.title}
                            </Text>

                            <Text 
                              fontSize="xs"
                              color="brand.100"
                              fontWeight="semibold"
                              textAlign="left"
                            >
                              {formatReleaseDate(item.release_date)}
                            </Text>
                          </Box>

                        </VStack>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>

                <Divider borderColor="brand.100" opacity={0.3} my={2} />
                
                <HStack justify="space-between" align="center">
                  <Text fontSize="2xl" fontWeight="bold" color="brand.100">
                    QueuedUp
                  </Text>
                  <Text fontSize="md" color="brand.100">
                    Track your own at QueuedUp.com
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Share Buttons */}
            <HStack spacing={4} justify="center" pt={4}>
              <IconButton
                icon={<FaDownload />}
                aria-label="Download Preview"
                colorScheme="brand"
                onClick={handleDownload}
                size="lg"
                isLoading={isGenerating}
              />
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SharePreviewModal; 