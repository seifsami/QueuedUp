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
  Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import Countdown from 'react-countdown';
import { FaCalendarAlt, FaTv, FaGlobe, FaFilm, FaUser, FaBook } from 'react-icons/fa';
import NotifyMeButton from '../components/NotifyMeButton';
import Carousel from '../components/Carousel';
import HypeMeter from '../components/HypeMeter';

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

// Helper function to format release date properly
const formatReleaseDate = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const CountdownRenderer = ({ days, hours, minutes, completed }) => {
  if (completed) {
    return <Text fontSize="lg" fontWeight="bold" color="green.500">Now Available!</Text>;
  }
  return (
    <Text fontSize="lg" fontWeight="bold" color="brand.300">
      Releases in {days}d {hours}h {minutes}m
    </Text>
  );
};


  

const MediaDetailPage = () => {
  const { mediaType, slug } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const hypeMeterPercentage = media.hype_meter_percentage ||50;  // Default 25%
 

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

  useEffect(() => {
    if (media) {
      async function fetchRecommendations() {
        try {
          setLoadingRecs(true);
          const recResponse = await axios.get(`https://queuedup-backend-6d9156837adf.herokuapp.com/media/recommendations/${mediaType}/${media._id}`);
          console.log("Recommendations Data:", recResponse.data.recommendations);
          setRecommendations(recResponse.data.recommendations);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        } finally {
          setLoadingRecs(false);
        }
      }
      fetchRecommendations();
    }
  }, [media]);

  if (loading) return <Text>Loading...</Text>;
  if (error || !media) return <Text>Media not found.</Text>;
  console.log("Carousel received items:", recommendations);

  return (
    <Flex direction="column" p={8} gap={6}>
      <Flex direction={{ base: "column", md: "row" }} gap={6} alignItems="start">
        {/* Left: Poster */}
        <Box flex="1" maxW="400px">
          <Image src={media.image || defaultImages[mediaType]} alt={media.title} borderRadius="lg" boxShadow="lg" />
        </Box>
  
        {/* Right: Title, Countdown, Metadata */}
        <Box flex="2">
          {/* Title */}
          <Text fontSize="3xl" fontWeight="bold" color="brand.600" mb={2}>{media.title}</Text>
  
          {/* Countdown */}
          {media.release_date && (
            <Countdown date={new Date(media.release_date)} renderer={CountdownRenderer} />
          )}
  
          {/* Metadata Tags */}
          <HStack spacing={4} mt={4} wrap="wrap">
            {media.creator && (
              <Tag size="md" bg="brand.200" color="brand.700">
                <Icon as={FaUser} mr={1} /> {media.creator_label}: {media.creator}
              </Tag>
            )}
            {media.release_date && (
              <Tag size="md" bg="gray.100" color="gray.700">
                <Icon as={FaCalendarAlt} mr={1} /> {formatReleaseDate(media.release_date)}
              </Tag>
            )}
            {media.language && media.language.toLowerCase() !== 'en' && (
              <Tag size="md" bg="blue.100" color="blue.700">
                <Icon as={FaGlobe} mr={1} /> Language: {media.language}
              </Tag>
            )}
          </HStack>
  
          <Divider my={4} />
  
          {/* Genres Section */}
          {media.genres && media.genres.length > 0 && mediaType !== 'books' && (
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2}>Genres:</Text>
              <HStack wrap="wrap">
                {media.genres.map((genre, index) => (
                  <Tag key={index} size="md" bg="orange.100" color="orange.700">
                    <Icon as={FaFilm} mr={1} /> {genre}
                  </Tag>
                ))}
              </HStack>
            </Box>
          )}
  
          <Divider my={4} />
          <HypeMeter hypeMeterPercentage={hypeMeterPercentage} />
          {/* Description Section */}
          {media.description && (
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2}>Description:</Text>
              <Text fontSize="md" color="gray.600">
                {showFullDescription ? media.description : media.description?.slice(0, 300) + '...'}
                {media.description?.length > 300 && (
                  <Button variant="link" colorScheme="blue" onClick={() => setShowFullDescription(!showFullDescription)}>
                    {showFullDescription ? 'See Less' : 'See More'}
                  </Button>
                )}
              </Text>
            </Box>
          )}
  
          {/* Action Buttons */}
          <HStack spacing={6} mt={6}>
            <NotifyMeButton item={media} buttonProps={{ colorScheme: "green", size: "lg" }} />
            {media.media_type === 'books' && (
              <Button as="a" href={`https://www.${getAmazonDomain()}/s?k=${encodeURIComponent(media.title)}&tag=queuedup0f-20`} target="_blank" 
                bg="brand.300" color="white" size="lg" _hover={{ bg: "brand.700" }}>
                Buy on Amazon
              </Button>
            )}
          </HStack>
        </Box>
      </Flex>
  
      {/* Recommendations Section */}
      {loadingRecs ? (
        <Spinner size="lg" />
      ) : (
        recommendations.length > 0 && (
          <Box mt={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>People Also Have</Text>
            <Carousel items={recommendations} />
          </Box>
        )
      )}
    </Flex>
  );
  
};

export default MediaDetailPage;
