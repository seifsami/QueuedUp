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
import { FaCalendarAlt, FaInfoCircle, FaFire } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotifyMeButton from './NotifyMeButton';
import HypeMeter from './HypeMeter';

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
        minHeight="160px"
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
          {/* Image */}
          <Box width="120px" height="160px" flexShrink={0}>
            <Image
              src={item.image || defaultImages[item.media_type || "books"]}
              alt={item.title}
              width="100%"
              height="100%"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>

          {/* Content Section */}
          <VStack align="start" flex={1} spacing={2} minWidth={0}>
            {/* Title and Creator */}
            <Text 
              fontWeight="bold" 
              fontSize="lg"
              noOfLines={2}
            >
              {item.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {item.creator || 'N/A'}
            </Text>
            
            {/* Release Date */}
            {showTBDTooltip ? (
              <Tooltip 
                hasArrow 
                label="No release date yet. Add to your watchlist & we'll notify you the second it's announced!" 
                bg="gray.700" 
                color="white"
                placement="top"
              >
                <HStack spacing={2} color="gray.500">
                  <Icon as={FaCalendarAlt} />
                  <Text>TBD</Text>
                  <Icon as={FaInfoCircle} />
                </HStack>
              </Tooltip>
            ) : (
              <HStack spacing={2} color="gray.500">
                <Icon as={FaCalendarAlt} />
                <Text>{formattedDate}</Text>
              </HStack>
            )}

            {/* Hype Meter Section */}
            <Box width="100%" maxW="200px">
              <HypeMeter 
                hypeMeterPercentage={item.hype_score || 0} 
                tooltipContent="Hype Score is based on the number of users tracking this item compared to the most-tracked item"
              />
            </Box>
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