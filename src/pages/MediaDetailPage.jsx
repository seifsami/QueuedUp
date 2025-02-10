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
import { FaCalendarAlt, FaTv, FaGlobe, FaFilm } from 'react-icons/fa';
import NotifyMeButton from '../components/NotifyMeButton';

const defaultImages = {
  books: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

// Countdown Renderer for the release
const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Text fontSize="lg" fontWeight="bold" color="green.500">Now Available!</Text>;
  }
  return (
    <HStack>
      <Text fontSize="lg" fontWeight="bold" color="brand.300">
        Releases in:
      </Text>
      <Text fontSize="lg">{days}d {hours}h {minutes}m</Text>
    </HStack>
  );
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

  const rawReleaseDate = media.releaseDate || media.release_date || null;
  const formattedReleaseDate = rawReleaseDate
    ? new Date(rawReleaseDate).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' 
      })
    : 'N/A';

  return (
    <Flex direction={{ base: "column", md: "row" }} p={8} gap={6} alignItems="start">
      {/* Left Column - Poster */}
      <Box flex="1" maxW="400px">
        <Image
          src={media.image || defaultImages[mediaType]}
          alt={media.title}
          borderRadius="lg"
          boxShadow="lg"
        />
      </Box>

      {/* Right Column - Details */}
      <Box flex="2">
        <Text fontSize="3xl" fontWeight="bold" color="brand.600" mb={2}>
          {media.title}
        </Text>

        <HStack spacing={4} mb={4} wrap="wrap">
          {/* Network Name */}
          {media.network_name && (
            <Tag size="lg" colorScheme="teal">
              <Icon as={FaTv} mr={1} /> {media.network_name}
            </Tag>
          )}

          {/* Release Date */}
          <Tag size="lg" bg="brand.200" color="brand.700">
            <Icon as={FaCalendarAlt} mr={1} /> {formattedReleaseDate}
          </Tag>

          {/* Spoken Languages */}
          {media.spoken_languages && media.spoken_languages.length > 0 && (
            <Tag size="lg" bg="brand.100" color="white">
              <Icon as={FaGlobe} mr={1} /> {media.spoken_languages.join(', ')}
            </Tag>
          )}
        </HStack>

        {/* Countdown */}
        {rawReleaseDate && (
          <Countdown date={new Date(rawReleaseDate)} renderer={CountdownRenderer} />
        )}

        <Divider my={4} />

        {/* Genres */}
        {media.genres && media.genres.length > 0 && (
          <Box mb={4}>
            <Text fontSize="xl" fontWeight="bold" mb={2}>Genres:</Text>
            <HStack wrap="wrap">
              {media.genres.map((genre, index) => (
                <Tag key={index} size="lg" colorScheme="orange">
                  <Icon as={FaFilm} mr={1} /> {genre}
                </Tag>
              ))}
            </HStack>
          </Box>
        )}

        {/* Description */}
        {media.description && (
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>Description:</Text>
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

        {/* Notify Me Button */}
        <NotifyMeButton
          item={media}
          buttonProps={{
            bg: "brand.300",
            color: "white",
            size: "lg",
            mt: 4,
            _hover: { bg: "brand.600" },
          }}
        />
      </Box>
    </Flex>
  );
};

export default MediaDetailPage;
