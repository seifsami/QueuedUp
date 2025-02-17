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
import { FaTwitter, FaFacebook, FaReddit, FaInstagram, FaTiktok, FaSun, FaMoon, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';

const SharePreviewModal = ({ isOpen, onClose, selectedItems }) => {
  const previewRef = useRef(null);
  const toast = useToast();
  const [isDark, setIsDark] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

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
    if (!originalUrl) return null;
    // Extract the image path from TMDB URL
    const match = originalUrl.match(/\/t\/p\/\w+\/.+/);
    if (match) {
      const imagePath = match[0];
      return `https://queuedup-backend-6d9156837adf.herokuapp.com/proxy-image${imagePath}`;
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
              const img = new Image();
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

  const generateImage = async () => {
    try {
      setIsGenerating(true);
      console.log('Starting image generation...');

      // First preload all images
      await preloadImages();

      // Then generate the canvas
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDark ? '#1A202C' : '#FFFFFF',
        allowTaint: false,
        foreignObjectRendering: false,
        logging: true,
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
        imageTimeout: 30000,
      });
      
      console.log('Canvas generated successfully');
      setIsGenerating(false);
      return canvas.toDataURL('image/png');
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
        title: "Image downloaded!",
        description: "Your watchlist preview has been downloaded",
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

  const handleShare = async (platform) => {
    try {
      const image = await generateImage();
      const text = "Check out my most anticipated upcoming releases! 📅 Track your own at QueuedUp: queuedup.com";
      
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://queuedup.com')}`, '_blank');
          break;
        case 'reddit':
          window.open(`https://reddit.com/submit?url=${encodeURIComponent('https://queuedup.com')}&title=${encodeURIComponent(text)}`, '_blank');
          break;
        case 'instagram':
        case 'tiktok':
          try {
            const blob = await fetch(image).then(r => r.blob());
            const file = new File([blob], 'queuedup-watchlist.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                text: text,
              });
            } else {
              // Fallback: download the image
              const link = document.createElement('a');
              link.href = image;
              link.download = 'queuedup-watchlist.png';
              link.click();
              
              toast({
                title: "Image downloaded!",
                description: "Share this image on Instagram or TikTok",
                status: "success",
                duration: 3000,
              });
            }
          } catch (shareError) {
            // If sharing fails, fallback to download
            const link = document.createElement('a');
            link.href = image;
            link.download = 'queuedup-watchlist.png';
            link.click();
            
            toast({
              title: "Image downloaded!",
              description: "Share this image on Instagram or TikTok",
              status: "success",
              duration: 3000,
            });
          }
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error sharing",
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
              bg={isDark ? "gray.900" : "white"}
              p={8}
              borderRadius="lg"
              width="100%"
              maxW="800px"
            >
              <VStack spacing={6} align="stretch">
                <Text 
                  fontSize="3xl" 
                  fontWeight="bold" 
                  textAlign="center"
                  color={isDark ? "white" : "gray.800"}
                  whiteSpace="nowrap"
                >
                  My Most Anticipated Releases
                </Text>
                
                <Grid 
                  templateColumns="repeat(3, 1fr)"
                  gap={6}
                >
                  {selectedItems.map((item) => (
                    <GridItem key={item.item_id}>
                      <Box 
                        bg={isDark ? "gray.800" : "gray.50"}
                        borderRadius="lg"
                        overflow="hidden"
                        height="280px"
                      >
                        <VStack height="100%" spacing={0}>
                          <Box width="100%" height="200px" position="relative">
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
                          <Box p={4} width="100%">
                            <Text 
                              fontSize="md" 
                              fontWeight="bold" 
                              color={isDark ? "white" : "gray.800"}
                              noOfLines={1}
                              mb={1}
                            >
                              {item.title}
                            </Text>
                            <Text 
                              fontSize="sm" 
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

                <Divider borderColor="brand.100" opacity={0.3} />
                
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
              <IconButton
                icon={<FaTwitter />}
                aria-label="Share on Twitter"
                colorScheme="twitter"
                onClick={() => handleShare('twitter')}
                size="lg"
                isLoading={isGenerating}
              />
              <IconButton
                icon={<FaFacebook />}
                aria-label="Share on Facebook"
                colorScheme="facebook"
                onClick={() => handleShare('facebook')}
                size="lg"
                isLoading={isGenerating}
              />
              <IconButton
                icon={<FaReddit />}
                aria-label="Share on Reddit"
                bg="brand.100"
                color="white"
                _hover={{ bg: "brand.200" }}
                onClick={() => handleShare('reddit')}
                size="lg"
                isLoading={isGenerating}
              />
              <IconButton
                icon={<FaInstagram />}
                aria-label="Share on Instagram"
                bg="brand.100"
                color="white"
                _hover={{ bg: "brand.200" }}
                onClick={() => handleShare('instagram')}
                size="lg"
                isLoading={isGenerating}
              />
              <IconButton
                icon={<FaTiktok />}
                aria-label="Share on TikTok"
                bg="brand.100"
                color="white"
                _hover={{ bg: "brand.200" }}
                onClick={() => handleShare('tiktok')}
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