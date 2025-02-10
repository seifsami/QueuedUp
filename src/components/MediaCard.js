import React from 'react';
import { Box, Image, Text, Button, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import NotifyMeButton from './NotifyMeButton';

const defaultImages = {
  books: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
  movies: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
  tv_seasons: "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
};

const MediaCard = ({ item, userWatchlist, refetchWatchlist }) => {
  const navigate = useNavigate();

  // Format release date function
  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      let parsedDate = new Date(Date.parse(dateStr));
      if (isNaN(parsedDate.getTime())) throw new Error("Invalid Date");
      return parsedDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        timeZone: 'UTC' 
      });
    } catch (error) {
      console.error("Error parsing date:", dateStr);
      return 'Invalid Date';
    }
  };

  // Countdown renderer
  const renderer = ({ days, hours, minutes, completed }) => {
    if (completed) {
      return <Text fontSize="sm">Released!</Text>;
    } else {
      return <Text fontSize="sm">{days}d {hours}h {minutes}m left</Text>;
    }
  };

  // ✅ Navigate Immediately When Clicking the Card
  const handleCardClick = () => {
    console.log("🖱 Card Clicked:", item);
    
    if (item.slug) {
      console.log("🔍 Navigating to:", `/media/${item.media_type}/${item.slug}`);
      navigate(`/media/${item.media_type}/${item.slug}`);
    } else {
      console.error("❌ Missing slug for item:", item);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg", cursor: "pointer" }}
      w="220px"
      h="500px"
      m="0 8px"
      onClick={handleCardClick} // ✅ Clicking anywhere now correctly navigates
    >
      <Box 
        height="338px"
        position="relative"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Image
          src={(item.image && item.image !== "none") ? item.image : defaultImages[item.media_type || "books"]}
          alt={item.title}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>

      <VStack align="start" p={2} spacing="1">
        {/* Title */}
        <Box w="full" h="3.5rem" overflow="hidden">
          <Text fontSize="lg" fontWeight="bold" noOfLines={2} lineHeight="1.3">
            {item.title}
          </Text>
        </Box>

        {/* Release Date & Countdown */}
        <Text fontSize="sm">{formatReleaseDate(item.release_date)}</Text>
        {item.release_date && item.release_date !== 'N/A' ? (
          <Countdown date={formatReleaseDate(item.release_date)} renderer={renderer} />
        ) : (
          <Text fontSize="sm">Coming Soon</Text>
        )}

        <HStack justifyContent="space-between" width="full">
          {/* Notify Button */}
          <Box width="48%" onClick={(e) => e.stopPropagation()}>
            <NotifyMeButton
              item={item}
              userWatchlist={userWatchlist}
              refetchWatchlist={refetchWatchlist}
              mediaType={item.media_type}
              buttonProps={{ width: "100%", size: "sm" }}
            />
          </Box>

          {/* View More Button - Navigates to MediaDetailPage */}
          <Box width="48%" onClick={(e) => e.stopPropagation()}>
            <Button 
              className="view-more-btn"
              variant="outline" 
              borderColor="brand.100"
              color="brand.100"
              bg="white"
              _hover={{ bg: 'gray.100', color: 'brand.100', borderColor: 'brand.100' }}
              _active={{ bg: 'gray.200', color: 'brand.500', borderColor: 'brand.100' }}
              size="sm"
              width="100%"
              onClick={(e) => {
                console.log("🛠 View More Clicked!", item);
                e.stopPropagation();
                navigate(`/media/${item.media_type}/${item.slug}`); // ✅ Navigate immediately
              }}
            >
              View More
            </Button>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MediaCard;
