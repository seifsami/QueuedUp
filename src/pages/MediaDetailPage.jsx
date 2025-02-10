import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Tag,
  Icon,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import Countdown from 'react-countdown';
import { FaCalendarAlt, FaTv, FaGlobe, FaFilm, FaUser, FaBook } from 'react-icons/fa';
import NotifyMeButton from '../components/NotifyMeButton';

const defaultImages = {
  books: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

// Amazon helper function
const getAmazonDomain = () => {
  let domain = 'amazon.com';
  const regionMapping = {
    'US': 'amazon.com', 'GB': 'amazon.co.uk', 'DE': 'amazon.de', 'FR': 'amazon.fr',
    'IT': 'amazon.it', 'ES': 'amazon.es', 'CA': 'amazon.ca', 'JP': 'amazon.co.jp',
  };
  const lang = navigator.language.toUpperCase().split('-')[1];
  return regionMapping[lang] || domain;
};

const MediaDetailPage = () => {
  const { mediaType, slug } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    async function fetchMediaDetails() {
      try {
        const response = await axios.get(
          `https://queuedup-backend-6d9156837adf.herokuapp.com/media/slug/${mediaType}/${slug}`
        );
        setMedia(response.data);
      } catch (error) {
        console.error("Error fetching media:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchMediaDetails();
  }, [mediaType, slug]);

  if (loading) return <Text>Loading...</Text>;
  if (error || !media) return <Text>Media not found.</Text>;

  return (
    <Flex direction={{ base: "column", md: "row" }} p={8} gap={6} alignItems="start">
      <Box flex="1" maxW="400px">
        <Image src={media.image || defaultImages[mediaType]} alt={media.title} borderRadius="lg" boxShadow="lg" />
      </Box>

      <Box flex="2">
        <Text fontSize="3xl" fontWeight="bold" color="brand.600" mb={2}>{media.title}</Text>

        <HStack spacing={4} mb={4} wrap="wrap">
          <Tag size="lg" colorScheme="teal"><Icon as={FaUser} mr={1} /> {media.creator_label}: {media.creator}</Tag>
          <Tag size="lg" bg="brand.200" color="brand.700"><Icon as={FaCalendarAlt} mr={1} /> {media.release_date}</Tag>
          {media.language && <Tag size="lg" bg="brand.100" color="white"><Icon as={FaGlobe} mr={1} /> Language: {media.language}</Tag>}
          {media.publisher && <Tag size="lg" bg="gray.200" color="gray.800"><Icon as={FaBook} mr={1} /> Publisher: {media.publisher}</Tag>}
        </HStack>

        {media.description && (
          <Box mb={4}>
            <Text fontSize="xl" fontWeight="bold">Description:</Text>
            <Text fontSize="md" color="gray.600">
              {showFullDescription ? media.description : media.description?.slice(0, 250) + '...'}
              {media.description?.length > 250 && (
                <Button variant="link" colorScheme="blue" onClick={() => setShowFullDescription(!showFullDescription)}>
                  {showFullDescription ? 'See Less' : 'See More'}
                </Button>
              )}
            </Text>
          </Box>
        )}

        <HStack spacing={4} mt={6}>
          <NotifyMeButton item={media} buttonProps={{ colorScheme: "green", size: "lg" }} />
          {media.media_type === 'books' && (
            <Button as="a" href={`https://www.${getAmazonDomain()}/s?k=${encodeURIComponent(media.title)}&tag=queuedup0f-20`} target="_blank" colorScheme="orange" size="lg">Buy on Amazon</Button>
          )}
        </HStack>
      </Box>
    </Flex>
  );
};

export default MediaDetailPage;
