import React, { useState, useEffect, useMemo } from 'react';
import { Box, Text, Spinner, Center, Button, HStack, Spacer, Icon } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header';
import ContentToggle from '../components/ContentToggle';
import FeaturedRelease from '../components/FeaturedRelease';
import WatchlistPreview from '../components/WatchlistPreview';
import Carousel from '../components/Carousel';
import DetailsModal from '../components/DetailsModal';
import DismissibleBanner from '../components/DismissibleBanner';
import { getTrendingMedia, getUpcomingMedia, getUserWatchlist, getFeaturedRelease } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  // Load last selected tab from localStorage
  const getInitialMediaType = () => {
    const storedType = localStorage.getItem('selectedMediaType');
    return storedType && ['tv_seasons', 'movies', 'books'].includes(storedType)
      ? storedType
      : 'tv_seasons'; // Default to TV Shows if missing or invalid
  };

  const [mediaType, setMediaType] = useState(getInitialMediaType);
  const [trendingData, setTrendingData] = useState([]);
  const [upcomingReleasesData, setUpcomingReleasesData] = useState([]);
  const [featuredItem, setFeaturedItem] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [cachedData, setCachedData] = useState({});

  // ✅ Function to fetch and update user watchlist
  const fetchUserWatchlist = async () => {
    if (!user) return;
    try {
      const { data } = await getUserWatchlist(user.uid);
      setUserWatchlist(data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    }
  };

  useEffect(() => {
    fetchUserWatchlist(); // Fetch watchlist once when user logs in
  }, [user]);

  // ✅ Function to format media items before storing
  const formatMediaItems = (items, mediaType) => {
    return items.map(item => ({
      ...item,
      media_type: mediaType,
      slug: item.slug || "",
    }));
  };

  // ✅ Function to parse and normalize release dates
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (typeof dateStr === 'string' && dateStr.includes(',')) {
      const parsedDate = Date.parse(dateStr);
      return isNaN(parsedDate) ? null : new Date(parsedDate);
    }
    return new Date(dateStr);
  };

  const parseReleaseDates = (items) => {
    return items.map(item => ({
      ...item,
      releaseDate: item.release_date ? normalizeDate(item.release_date) : null,
    }));
  };

  // ✅ Fetch data for a given media type (single API call at a time)
  const fetchDataForType = async (type) => {
    const trendingPromise = getTrendingMedia(type);
    const upcomingPromise = getUpcomingMedia(type);

    const trendingMedia = await trendingPromise;
    const formattedTrending = parseReleaseDates(formatMediaItems(trendingMedia, type));

    const upcomingMedia = await upcomingPromise;
    const formattedUpcoming = parseReleaseDates(formatMediaItems(upcomingMedia, type));

    return { trending: formattedTrending, upcoming: formattedUpcoming };
  };

  // ✅ Fetch and cache media data when mediaType changes
  useEffect(() => {
    let timeoutId;
  
    const fetchMediaData = async () => {
      if (!mediaType || !['tv_seasons', 'movies', 'books'].includes(mediaType)) return;
  
      setLoadingTrending(true);
      setLoadingUpcoming(true);
  
      timeoutId = setTimeout(async () => {
        try {
          if (cachedData[mediaType]) {
            // 🏎️ Use cached data first for a fast load
            const { trending, upcoming } = cachedData[mediaType];
            setTrendingData(trending);
            setUpcomingReleasesData(upcoming);
          } else {
            // ⏳ Fetch one by one (staggered API calls)
            const data = await fetchDataForType(mediaType);
            setTrendingData(data.trending);
            setUpcomingReleasesData(data.upcoming);
            setCachedData(prev => ({ ...prev, [mediaType]: data }));
          }
        } catch (err) {
          setError('Failed to fetch media');
        } finally {
          setLoadingTrending(false);
          setLoadingUpcoming(false);
        }
      }, 100);
    };

    fetchMediaData();
    return () => clearTimeout(timeoutId);
  }, [mediaType]);

  // ✅ Memoize parsed data so React doesn't keep recalculating
  const memoizedTrendingData = useMemo(() => trendingData, [trendingData]);
  const memoizedUpcomingData = useMemo(() => {
    return [...upcomingReleasesData].sort((a, b) => {
      if (!a.releaseDate) return 1; // Move items without releaseDate to the end
      if (!b.releaseDate) return -1;
      return new Date(a.releaseDate) - new Date(b.releaseDate); // Sort by soonest releaseDate
    });
  }, [upcomingReleasesData]);

  // ✅ Prefetch all media types (only once)
  useEffect(() => {
    const prefetchAllTypes = async () => {
      try {
        const typesToPrefetch = ['books', 'movies', 'tv_seasons'];
        const results = await Promise.all(
          typesToPrefetch.map(async (type) => {
            if (!cachedData[type]) {
              const data = await fetchDataForType(type);
              return { type, data };
            }
            return null;
          })
        );
        const newData = {};
        results.forEach(result => {
          if (result) {
            newData[result.type] = result.data;
          }
        });
        setCachedData(prev => ({ ...prev, ...newData }));
      } catch (err) {
        console.error('Error prefetching data:', err);
      }
    };

    prefetchAllTypes();
  }, []);


  useEffect(() => {
    if (!mediaType) return;
  
    const fetchFeaturedRelease = async () => {
      setLoading(true);
      try {
       
        const data = await getFeaturedRelease(mediaType);
        
        setFeaturedItem(data);
      } catch (error) {
        console.error("🚨 Error fetching featured release:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeaturedRelease();
  }, [mediaType]);

  // ✅ Avoid UI blocking on tab switch
  const handleMediaTypeChange = (newType) => {
    if (!['tv_seasons', 'movies', 'books'].includes(newType)) return;
    setMediaType(newType);
    setTimeout(() => {
      localStorage.setItem('selectedMediaType', newType);
    }, 10);
  };

  // 🛑 Error UI
  if (error) {
    return (
      <Center>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Box maxW={{ xl: '1200px' }} mx="auto" bg="white">
        {/* Sticky Content Toggle with margin top */}
       
        <Box position="sticky" top="2px" zIndex="100" bg="white">
          <ContentToggle setMediaType={handleMediaTypeChange} />
        </Box>
        
        {featuredItem && (
          <FeaturedRelease
            item={featuredItem}
            userWatchlist={userWatchlist}
            refetchWatchlist={fetchUserWatchlist} // ✅ FIXED: refetchWatchlist is now a function
            mediaType={mediaType}
          />
        )}

        <Box px={4} py={1}>
          <Text fontSize="2xl" fontWeight="bold" mt={2} mb={4}>
            Upcoming Releases
          </Text>
          {loadingUpcoming ? <Spinner size="xl" /> : <Carousel items={memoizedUpcomingData} userWatchlist={userWatchlist} refetchWatchlist={fetchUserWatchlist}/>}
          
          <HStack justify="space-between" align="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Trending
            </Text>
            <Text
              color="brand.100"
              fontSize="md"
              fontWeight="medium"
              cursor="pointer"
              onClick={() => navigate('/leaderboard')}
              pr={4}
            >
              View More
            </Text>
          </HStack>
          
          {loadingTrending ? <Spinner size="xl" /> : <Carousel items={memoizedTrendingData} userWatchlist={userWatchlist} refetchWatchlist={fetchUserWatchlist} />}
          <WatchlistPreview watchlist={userWatchlist} mediaType={mediaType} userId={user?.uid} />
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
