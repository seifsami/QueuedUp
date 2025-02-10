import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, Center } from '@chakra-ui/react';
import Header from '../components/Header';
import ContentToggle from '../components/ContentToggle';
import FeaturedRelease from '../components/FeaturedRelease';
import WatchlistPreview from '../components/WatchlistPreview';
import Carousel from '../components/Carousel';
import DetailsModal from '../components/DetailsModal';
import { getTrendingMedia, getUpcomingMedia, getUserWatchlist } from '../services/api';

const HomePage = ({ user }) => {
  // Current mediaType for visible carousel (initially TV shows)
  const [mediaType, setMediaType] = useState('tv_seasons');
  // Data for current mediaType
  const [trendingData, setTrendingData] = useState([]);
  const [upcomingReleasesData, setUpcomingReleasesData] = useState([]);
  // Global featured item (prefetched across all media types)
  const [featuredItem, setFeaturedItem] = useState(null);
  // Loading states for current mediaType
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [error, setError] = useState(null);
  // User's watchlist
  const [userWatchlist, setUserWatchlist] = useState([]);
  // Cached data for each media type
  const [cachedData, setCachedData] = useState({});

  


  const fetchUserWatchlist = async () => {
    if (!user) return;
    try {
      const { data } = await getUserWatchlist(user.uid);
      setUserWatchlist(data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    }
  };

  // Helper functions for data processing.
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

  const formatMediaItems = (items, mediaType) => {
    return items.map(item => ({
      ...item,
      media_type: mediaType,
      slug: item.slug || ""
    }));
  };

  // Helper function to fetch data for a given media type.
  const fetchDataForType = async (type) => {
    const trendingMedia = await getTrendingMedia(type);
    const formattedTrending = formatMediaItems(trendingMedia, type);
    const parsedTrending = parseReleaseDates(formattedTrending);

    const upcomingMedia = await getUpcomingMedia(type);
    const formattedUpcoming = formatMediaItems(upcomingMedia, type);
    const parsedUpcoming = parseReleaseDates(formattedUpcoming);

    return { trending: parsedTrending, upcoming: parsedUpcoming };
  };

  // Fetch carousel data for the current mediaType.
  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoadingTrending(true);
        setLoadingUpcoming(true);
        if (cachedData[mediaType]) {
          // Use cached data if available.
          const { trending, upcoming } = cachedData[mediaType];
          setTrendingData(trending);
          console.log("about to print")
          console.log(trendingData);
          setUpcomingReleasesData(upcoming);
          setLoadingTrending(false);
          setLoadingUpcoming(false);
        } else {
          // Otherwise, fetch data and cache it.
          const data = await fetchDataForType(mediaType);
          setTrendingData(data.trending);
          setUpcomingReleasesData(data.upcoming);
          setCachedData(prev => ({ ...prev, [mediaType]: data }));
          setLoadingTrending(false);
          setLoadingUpcoming(false);
        }
      } catch (err) {
        setError('Failed to fetch media');
        setLoadingTrending(false);
        setLoadingUpcoming(false);
      }
    };

    fetchMediaData();
    fetchUserWatchlist();
  }, [mediaType, user]);
  

  // Prefetch data for all media types (runs only once on mount).
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



  // Once all media types are cached, compute the global featured item.
  useEffect(() => {
    const allTypes = ['books', 'movies', 'tv_seasons'];
    const isAllCached = allTypes.every(type => cachedData[type]);
    if (isAllCached) {
      const combined = allTypes.flatMap(type => {
        const { trending, upcoming } = cachedData[type];
        return [...trending, ...upcoming];
      });
      if (combined.length > 0) {
        const randomIndex = Math.floor(Math.random() * combined.length);
        setFeaturedItem(combined[randomIndex]);
      }
    }
  }, [cachedData]);

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
          <ContentToggle setMediaType={setMediaType} />
        </Box>

        {featuredItem && (
          <FeaturedRelease
            item={featuredItem}
            userWatchlist={userWatchlist}
            refetchWatchlist={fetchUserWatchlist}
            mediaType={mediaType}
          />
        )}

        <Box px={4} py={1}>
          <Text fontSize="2xl" fontWeight="bold" mt={2} mb={4}>
            Upcoming Releases
          </Text>
          {loadingUpcoming ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Carousel
              items={upcomingReleasesData}
              userWatchlist={userWatchlist}
              refetchWatchlist={fetchUserWatchlist}
            />
          )}
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Trending
          </Text>
          {loadingTrending ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Carousel
              items={trendingData}
              userWatchlist={userWatchlist}
              refetchWatchlist={fetchUserWatchlist}
              mediaType={mediaType}
            />
          )}
          <WatchlistPreview watchlist={userWatchlist} mediaType={mediaType} userId={user?.uid} />
        </Box>
        
      </Box>
    </>
  );
};

export default HomePage;
