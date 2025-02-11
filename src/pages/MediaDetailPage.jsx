import React, { useState, useEffect, lazy, Suspense } from 'react';
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
  Spinner,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import axios from 'axios';
import Countdown from 'react-countdown';
import { FaCalendarAlt, FaTv, FaGlobe, FaFilm, FaUser, FaBook, FaInfoCircle } from 'react-icons/fa';
import NotifyMeButton from '../components/NotifyMeButton';
import Carousel from '../components/Carousel';
import HypeMeter from '../components/HypeMeter';
import Header from '../components/Header';

const API_BASE_URL = "https://queuedup-backend-6d9156837adf.herokuapp.com";


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
    if (!dateString || dateString.toLowerCase() === "n/a") {
      return "TBD";
    }
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


  

const MediaDetailPage = ({ user }) => {
  const { mediaType, slug } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const hypeMeterPercentage = media?.hype_meter_percentage ?? 25;  // Default 25%
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const toast = useToast();
 
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

  const fetchWatchlist = async () => {
    if (!user) {
      console.log("⚠️ No user logged in, skipping watchlist fetch.");
      return;
    }
  
    try {
      console.log("🔄 Fetching watchlist for user:", user.uid);
      const { data } = await axios.get(`${API_BASE_URL}/watchlist/${user.uid}`);
      
      console.log("📌 Fetched Watchlist Data:", data);
      
      if (!Array.isArray(data)) {
        console.error("🚨 Error: Watchlist API response is not an array!", data);
        return;
      }
  
      setUserWatchlist(data);
      console.log("✅ Updated userWatchlist state:", data);
    } catch (error) {
      console.error("❌ Error fetching watchlist:", error);
    }
  };
  
  

  // 🔥 Fetch watchlist when the page loads
  useEffect(() => {
    fetchWatchlist();
  }, [user]);
  
  useEffect(() => {
    if (media) {
      async function fetchRecommendations() {
        try {
          setLoadingRecs(true);
          const recResponse = await axios.get(
            `https://queuedup-backend-6d9156837adf.herokuapp.com/media/recommendations/${mediaType}/${media._id}`
          );
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
    <>
    <Header />
    <Flex direction="column" p={8} gap={6}>
      <Flex direction={{ base: "column", md: "row" }} gap={6} alignItems="start">
        {/* Left: Poster */}
        <Box flex="1" maxW="400px">
          <Image src={media.image || defaultImages[mediaType]} alt={media.title} borderRadius="lg" boxShadow="lg" loading="lazy" />
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
            <HStack>
                <Tooltip 
                    hasArrow 
                    label="No release date yet. Add to your watchlist & we’ll notify you the second it’s announced!" 
                    bg="gray.700" 
                    color="white"
                    placement="top"
                    isDisabled={media.release_date && media.release_date.toLowerCase() !== "n/a"}
                >
                    <Tag size="md" bg="gray.100" color="gray.700" cursor="pointer">
                    <Icon as={FaCalendarAlt} mr={1} /> TBD
                    <Icon as={FaInfoCircle} ml={1} color="gray.500" />
                    </Tag>
                </Tooltip>
            </HStack>

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
          <Suspense fallback={<Spinner size="lg" />}>
            <HypeMeter hypeMeterPercentage={hypeMeterPercentage} />
          </Suspense>
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
          <NotifyMeButton 
                item={media}
                userWatchlist={userWatchlist}  // ✅ Pass watchlist to update UI correctly
                refetchWatchlist={fetchWatchlist}  // ✅ Refetch when adding
                mediaType={media.media_type}
                buttonProps={{ colorScheme: "green", size: "lg" }}
              />
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
    </>
  );
  
};

export default MediaDetailPage;
