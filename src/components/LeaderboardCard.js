import React from 'react';
import {
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { FaBook, FaTv, FaFilm, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifyMeButton from './NotifyMeButton';
import HypeMeter from './HypeMeter';

const mediaTypeIcons = {
  books: FaBook,
  tv_seasons: FaTv,
  movies: FaFilm,
};

const defaultImages = {
  books: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

const formatReleaseDate = (dateString) => {
  if (!dateString || dateString.toLowerCase() === "n/a") {
    return "TBD";
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric', 
    timeZone: 'UTC'
  });
};

const getCreatorLabel = (mediaType) => {
  switch (mediaType) {
    case 'books':
      return 'Author';
    case 'movies':
      return 'Director';
    case 'tv_seasons':
      return 'Network';
    default:
      return 'Creator';
  }
};

const getCreator = (item) => {
  return item.author || item.director || item.network_name || 'N/A';
};

const LeaderboardCard = ({ 
  item, 
  userWatchlist, 
  refetchWatchlist,
}) => {
  const bg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const rankingColor = useColorModeValue('brand.500', 'brand.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();

  const handleCardClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (item.slug) {
      navigate(`/media/${item.media_type}/${item.slug}`);
    } else {
      console.error("Missing slug for item:", item);
    }
  };

  const creatorLabel = getCreatorLabel(item.media_type);
  const creator = getCreator(item);
  const formattedDate = formatReleaseDate(item.release_date);
  const showTBDTooltip = formattedDate === "TBD";

  return (
    <Box
      position="relative"
      width="full"
      onClick={handleCardClick}
      cursor="pointer"
    >
      <HStack
        p={{ base: 2, md: 4 }}
        shadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        bg={bg}
        minHeight="120px"
        _hover={{ bg: hoverBg }}
        spacing={4}
        position="relative"
      >
        {/* Ranking Number */}
        <Box
          position="absolute"
          top={2}
          left={2}
          fontSize="2xl"
          fontWeight="bold"
          color={rankingColor}
          zIndex={1}
        >
          #{item.rank}
        </Box>

        <HStack spacing={4} width="100%" pl={12}>
          {/* Media Type Icon & Image */}
          <Box position="relative">
            <Icon 
              as={mediaTypeIcons[item.media_type]} 
              position="absolute"
              top={2}
              left={2}
              boxSize={5}
              color="gray.500"
              zIndex={1}
            />
            <Image
              src={item.image || defaultImages[item.media_type || "books"]}
              alt={item.title}
              htmlWidth="80px"
              htmlHeight="120px"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>

          {/* Content Section */}
          <VStack align="start" flex={1} spacing={1} minWidth={0}>
            {/* Title and Creator */}
            <Text 
              fontWeight="bold" 
              fontSize="lg"
              noOfLines={2}
            >
              {item.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {creatorLabel}: {creator}
            </Text>
            <HStack>
              {showTBDTooltip ? (
                <Tooltip 
                  hasArrow 
                  label="No release date yet. Add to your watchlist & we'll notify you the second it's announced!" 
                  bg="gray.700" 
                  color="white"
                  placement="top"
                >
                  <HStack spacing={1} color="gray.500" fontSize="sm">
                    <Icon as={FaCalendarAlt} />
                    <Text>TBD</Text>
                    <Icon as={FaInfoCircle} />
                  </HStack>
                </Tooltip>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  <Icon as={FaCalendarAlt} mr={1} />
                  {formattedDate}
                </Text>
              )}
            </HStack>

            {/* Hype Meter Section */}
            <HStack width="100%" align="center" spacing={2}>
              <Box flex={1} maxW="200px">
                <HypeMeter hypeMeterPercentage={item.hype_score || 0} />
              </Box>
              <Tooltip
                label="Hype Score is based on the number of users tracking this item compared to the most-tracked item"
                placement="top"
                hasArrow
              >
                <Icon as={FaInfoCircle} color="gray.400" />
              </Tooltip>
            </HStack>
          </VStack>

          {/* Notify Me Button */}
          <Box>
            <NotifyMeButton
              item={item}
              userWatchlist={userWatchlist}
              refetchWatchlist={refetchWatchlist}
              buttonProps={{
                size: 'md',
                width: '120px'
              }}
            />
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
};

export default LeaderboardCard; 