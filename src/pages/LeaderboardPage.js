import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  VStack,
  HStack,
  Tabs,
  TabList,
  Tab,
  Button,
  Text,
  Spinner,
  Center,
  Icon,
  useToast,
  Box,
  ButtonGroup
} from '@chakra-ui/react';
import { FaFire } from 'react-icons/fa';
import Header from '../components/Header';
import LeaderboardCard from '../components/LeaderboardCard';
import { useModal } from '../ModalContext';
import { getLeaderboardData, getUserWatchlist } from '../services/api';

const mediaTypeOptions = [
  { value: 'tv_seasons', label: 'TV Shows' },
  { value: 'movies', label: 'Movies' },
  { value: 'books', label: 'Books' },
];

const timeframeOptions = [
  { value: 'weekly', label: 'Week' },
  { value: 'monthly', label: 'Month' },
];

const LeaderboardPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mediaTypeIndex, setMediaTypeIndex] = useState(0);
  const [timeframeIndex, setTimeframeIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const { currentUser } = useModal();
  const toast = useToast();

  const fetchLeaderboardData = async (page = 1, append = false) => {
    try {
      setLoading(true);
      const mediaType = mediaTypeOptions[mediaTypeIndex].value;
      const timeframe = timeframeOptions[timeframeIndex].value;

      const data = await getLeaderboardData(timeframe, mediaType, page);
      
      if (append) {
        setItems(prev => [...prev, ...data.items]);
      } else {
        setItems(data.items);
      }

      setHasMore(data.pagination.has_next);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leaderboard data. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // Fetch user's watchlist if logged in
  const fetchUserWatchlist = async () => {
    if (!currentUser) return;
    try {
      const response = await getUserWatchlist(currentUser.uid);
      setUserWatchlist(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  useEffect(() => {
    fetchUserWatchlist();
  }, [currentUser]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchLeaderboardData(1, false);
  }, [mediaTypeIndex, timeframeIndex]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchLeaderboardData(nextPage, true);
  };

  const handleMediaTypeChange = (index) => {
    setMediaTypeIndex(index);
  };

  const handleTimeframeChange = (index) => {
    setTimeframeIndex(index);
  };

  return (
    <>
      <Header />
      <Container maxW="1400px" mx="auto" p={{ base: 2, md: 4 }} bg="brand.400" borderRadius="xl" boxShadow="md">
        {/* Header Section */}
        <Heading as="h2" size="xl" color="brand.500" mb={6}>
          Most Tracked This {timeframeOptions[timeframeIndex].label}
        </Heading>

        {/* Filters Section */}
        <VStack spacing={4} mb={6} align="stretch">
          {/* Timeframe Tabs */}
          <Tabs 
            index={timeframeIndex} 
            onChange={handleTimeframeChange} 
            width="100%"
            variant="line"
            colorScheme="brand"
          >
            <TabList>
              {timeframeOptions.map((option) => (
                <Tab
                  key={option.value}
                  _selected={{
                    color: 'brand.500',
                    borderColor: 'brand.500'
                  }}
                >
                  This {option.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>

          {/* Media Type Pills */}
          <Box>
            <ButtonGroup spacing={2} size="md" variant="outline">
              {mediaTypeOptions.map((option, index) => (
                <Button
                  key={option.value}
                  onClick={() => handleMediaTypeChange(index)}
                  colorScheme="brand"
                  variant={mediaTypeIndex === index ? "solid" : "outline"}
                  borderRadius="full"
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </VStack>

        {/* Content Section */}
        {loading && currentPage === 1 ? (
          <Center py={10}>
            <Spinner size="xl" color="brand.100" />
          </Center>
        ) : (
          <>
            {/* Two-column grid on desktop, single column on mobile */}
            <Box 
              display="grid" 
              gridTemplateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
              gap={{ base: 4, md: 6 }}
            >
              {items.map((item) => (
                <LeaderboardCard
                  key={`${item.item_id}-${item.rank}`}
                  item={item}
                  userWatchlist={userWatchlist}
                  refetchWatchlist={fetchUserWatchlist}
                />
              ))}
            </Box>
            
            {items.length === 0 && !loading && (
              <Text py={10} textAlign="center" color="brand.500">
                No items found in the leaderboard.
              </Text>
            )}

            {hasMore && (
              <Center py={4}>
                <Button
                  onClick={handleLoadMore}
                  colorScheme="brand"
                  size="lg"
                  isLoading={loading}
                  loadingText="Loading more..."
                >
                  Load More
                </Button>
              </Center>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default LeaderboardPage; 