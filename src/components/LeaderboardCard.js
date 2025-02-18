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
import { FaCalendarAlt, FaInfoCircle, FaUser, FaTv, FaFilm } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifyMeButton from './NotifyMeButton';

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

const getCreatorIcon = (mediaType) => {
  switch (mediaType) {
    case 'movies':
      return FaFilm;
    case 'tv_seasons':
      return FaTv;
    default:
      return FaUser;
  }
};

const LeaderboardCard = ({ 
  item, 
  userWatchlist, 
  refetchWatchlist,
}) => {
  const bg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();

  // Get rank color based on position
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return { color: 'yellow.400', weight: '800' }; // Gold
      case 2:
        return { color: 'gray.400', weight: '800' }; // Silver
      case 3:
        return { color: 'orange.400', weight: '800' }; // Bronze
      default:
        return { color: 'brand.500', weight: 'bold' }; // Default color
    }
  };

  const rankStyle = getRankColor(item.rank);

  const handleCardClick = (event) => {
    // Only navigate if the click wasn't on the NotifyMeButton
    if (!event.defaultPrevented) {
      if (item.slug) {
        navigate(`/media/${item.media_type}/${item.slug}`);
      } else {
        console.error("Missing slug for item:", item);
      }
    }
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const formattedDate = formatReleaseDate(item.release_date);
  const showTBDTooltip = formattedDate === "TBD";
  const CreatorIcon = getCreatorIcon(item.media_type);

  return (
    <Box
      position="relative"
      width="full"
      onClick={handleCardClick}
      cursor="pointer"
    >
      <Box
        p={{ base: 3, md: 4 }}
        shadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        bg={bg}
        _hover={{ bg: hoverBg }}
        position="relative"
        maxW={{ base: "85%", md: "100%" }}
        mx="auto"
      >
        {/* Desktop Layout */}
        <Box display={{ base: 'none', md: 'block' }}>
          <HStack align="start" spacing={3}>
            {/* Rank Number */}
            <Text 
              fontSize="2xl"
              fontWeight={rankStyle.weight}
              color={rankStyle.color}
              minW="32px"
            >
              #{item.rank}
            </Text>

            {/* Left Column: Image */}
            <Box width="140px">
              <Image
                src={item.image || defaultImages[item.media_type || "books"]}
                alt={item.title}
                width="140px"
                height="180px"
                objectFit="cover"
                borderRadius="md"
              />
            </Box>

            {/* Content Column */}
            <VStack align="start" flex={1} spacing={2}>
              <Text 
                fontWeight="bold" 
                fontSize="xl"
                noOfLines={2}
              >
                {item.title}
              </Text>

              <HStack spacing={2}>
                <Icon as={CreatorIcon} color="gray.500" boxSize={5} />
                <Text fontSize="lg" color="gray.700" fontWeight="medium">
                  {item.creator || 'N/A'}
                </Text>
              </HStack>
              
              {showTBDTooltip ? (
                <Tooltip 
                  hasArrow 
                  label="No release date yet. Add to your watchlist & we'll notify you the second it's announced!" 
                  bg="gray.700" 
                  color="white"
                  placement="top"
                >
                  <HStack spacing={2} color="gray.600">
                    <Icon as={FaCalendarAlt} boxSize={5} />
                    <Text fontSize="lg">TBD</Text>
                    <Icon as={FaInfoCircle} />
                  </HStack>
                </Tooltip>
              ) : (
                <HStack spacing={2} color="gray.600">
                  <Icon as={FaCalendarAlt} boxSize={5} />
                  <Text fontSize="lg">{formattedDate}</Text>
                </HStack>
              )}

              <Box width="180px" onClick={handleButtonClick}>
                <NotifyMeButton
                  item={{
                    ...item,
                    _id: item.item_id || item._id, // Ensure we have the correct ID format
                    media_type: item.media_type
                  }}
                  userWatchlist={userWatchlist}
                  refetchWatchlist={refetchWatchlist}
                  buttonProps={{
                    size: 'sm',
                    width: "full"
                  }}
                />
              </Box>
            </VStack>
          </HStack>
        </Box>

        {/* Mobile Layout */}
        <Box display={{ base: 'block', md: 'none' }}>
          <HStack align="start" spacing={2}>
            {/* Rank Number */}
            <Text 
              fontSize="xl"
              fontWeight={rankStyle.weight}
              color={rankStyle.color}
              minW="28px"
            >
              #{item.rank}
            </Text>

            {/* Left: Image */}
            <Box width="120px">
              <Image
                src={item.image || defaultImages[item.media_type || "books"]}
                alt={item.title}
                width="120px"
                height="160px"
                objectFit="cover"
                borderRadius="md"
              />
            </Box>

            {/* Right: Content */}
            <VStack align="start" flex={1} spacing={2}>
              <Text 
                fontWeight="bold" 
                fontSize="lg"
                noOfLines={2}
              >
                {item.title}
              </Text>

              <HStack spacing={2}>
                <Icon as={CreatorIcon} color="gray.500" />
                <Text fontSize="md" color="gray.700" fontWeight="medium">
                  {item.creator || 'N/A'}
                </Text>
              </HStack>
              
              {showTBDTooltip ? (
                <Tooltip 
                  hasArrow 
                  label="No release date yet. Add to your watchlist & we'll notify you the second it's announced!" 
                  bg="gray.700" 
                  color="white"
                  placement="top"
                >
                  <HStack spacing={2} color="gray.600">
                    <Icon as={FaCalendarAlt} />
                    <Text>TBD</Text>
                    <Icon as={FaInfoCircle} />
                  </HStack>
                </Tooltip>
              ) : (
                <HStack spacing={2} color="gray.600">
                  <Icon as={FaCalendarAlt} />
                  <Text>{formattedDate}</Text>
                </HStack>
              )}

              <Box onClick={handleButtonClick}>
                <NotifyMeButton
                  item={{
                    ...item,
                    _id: item.item_id || item._id, // Ensure we have the correct ID format
                    media_type: item.media_type
                  }}
                  userWatchlist={userWatchlist}
                  refetchWatchlist={refetchWatchlist}
                  buttonProps={{
                    size: 'md',
                    width: "full"
                  }}
                />
              </Box>
            </VStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default LeaderboardCard; 