import React, { useRef, useState, useEffect } from 'react';
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
  Icon,
  Input
} from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaReddit, FaInstagram, FaTiktok, FaSun, FaMoon, FaDownload, FaPencilAlt, FaTimes } from 'react-icons/fa';
import domtoimage from 'dom-to-image';

const defaultImages = {
  movie: 'https://via.placeholder.com/300x450?text=Movie',
  tv: 'https://via.placeholder.com/300x450?text=TV+Show',
  book: 'https://via.placeholder.com/300x450?text=Book'
};

const SharePreviewModal = ({ isOpen, onClose, selectedItems }) => {
  const previewRef = useRef(null);
  const toast = useToast();
  const [isDark, setIsDark] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('My Most Anticipated Releases');
  const [isEditing, setIsEditing] = useState(false);
  const MAX_TITLE_LENGTH = 30;

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
              const img = new window.Image();
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
      setIsLoading(false);
      console.log('All images preloaded successfully');
    } catch (error) {
      console.error('Error preloading images:', error);
      setIsLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (isOpen && selectedItems.length > 0) {
      preloadImages();
    }
  }, [isOpen, selectedItems]);

  const handleSaveTitle = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTitle('My Most Anticipated Releases');
    setIsEditing(false);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setTitle(newTitle);
    }
  };

  const generateImage = async () => {
    try {
      setIsGenerating(true);
      setIsEditing(false);
      console.log('Starting image generation...');

      // Ensure all images are loaded
      if (isLoading) {
        await preloadImages();
      }

      // Generate the image exactly as it appears
      const dataUrl = await domtoimage.toPng(previewRef.current, {
        quality: 1,
        bgcolor: isDark ? '#171923' : '#FFFFFF',
        height: previewRef.current.offsetHeight,
        width: previewRef.current.offsetWidth,
        style: {
          'border-radius': '0.5rem'
        }
      });
      
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
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "2xl" }}>
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
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              width="100%"
              maxW="600px"
              mx="auto"
            >
              <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                {isEditing ? (
                  <HStack width="100%" justifyContent="center" alignItems="center">
                    <input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value.slice(0, 30))}
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
                  </HStack>
                ) : (
                  <Text 
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    textAlign="center"
                    color={isDark ? "white" : "gray.800"}
                    onClick={() => setIsEditing(true)}
                    cursor="pointer"
                  >
                    {title}
                  </Text>
                )}
                
                <Grid 
                  templateColumns="repeat(3, 1fr)"
                  gap={{ base: 2, md: 4 }}
                >
                  {selectedItems.map((item) => (
                    <GridItem key={item.item_id}>
                      <Box 
                        bg={isDark ? "gray.800" : "white"}
                        borderRadius="lg"
                        overflow="hidden"
                        height={{ base: "180px", md: "260px" }}
                        border={isDark ? "none" : "1px solid #E2E8F0"}
                      >
                        <VStack height="100%" spacing={0}>
                          <Box width="100%" height={{ base: "120px", md: "180px" }} position="relative">
                            <Image
                              src={loadedImages[item.item_id] || getProxiedImageUrl(item.image)}
                              alt={item.title}
                              width="100%"
                              height="100%"
                              objectFit="cover"
                              loading="eager"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error(`Error loading image for ${item.title}`);
                                e.target.src = defaultImages[item.media_type];
                              }}
                            />
                          </Box>
                          <Box p={3} width="100%" minH={{ base: "auto", md: "70px" }} display="flex" flexDirection="column" justifyContent="space-between">
                            <Text 
                              fontSize={{ base: "2xs", md: "sm" }}
                              fontWeight="bold"
                              color={isDark ? "white" : "gray.800"}
                              noOfLines={2}
                              lineHeight="1.2em"
                              height="2.4em"
                              mb="auto"
                            >
                              {item.title}
                            </Text>
                            <Text 
                              fontSize={{ base: "3xs", md: "xs" }}
                              color="brand.100"
                              fontWeight="semibold"
                            >
                              {formatReleaseDate(item.release_date)}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>

                <Divider borderColor="brand.100" opacity={0.3} my={{ base: 1, md: 2 }} />
                
                <HStack justify="space-between" align="center">
                  <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="brand.100">
                    QueuedUp
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="brand.100">
                    Track your own at QueuedUp.com
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Button
              leftIcon={<FaDownload />}
              colorScheme="brand"
              onClick={handleDownload}
              isLoading={isGenerating}
              size="lg"
              width={{ base: "full", md: "auto" }}
            >
              Generate Image
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SharePreviewModal; 