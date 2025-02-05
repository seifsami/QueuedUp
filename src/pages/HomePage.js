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
  const [mediaType, setMediaType] = useState('tv_seasons');
  const [trendingData, setTrendingData] = useState([]);
  const [upcomingReleasesData, setUpcomingReleasesData] = useState([]);
  const [featuredItem, setFeaturedItem] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userWatchlist, setUserWatchlist] = useState([]);

  // Handlers for modal actions.
  const openModalWithItem = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

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
    }));
  };

  // Fetch carousel data for the selected mediaType.
  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoadingTrending(true);
        setLoadingUpcoming(true);

        // Fetch trending data.
        const trendingMedia = await getTrendingMedia(mediaType);
        const formattedTrending = formatMediaItems(trendingMedia, mediaType);
        const parsedTrending = parseReleaseDates(formattedTrending);
        setTrendingData(parsedTrending);

        // Fetch upcoming data.
        const upcomingMedia = await getUpcomingMedia(mediaType);
        const formattedUpcoming = formatMediaItems(upcomingMedia, mediaType);
        const parsedUpcoming = parseReleaseDates(formattedUpcoming);
        setUpcomingReleasesData(parsedUpcoming);

        setLoadingTrending(false);
        setLoadingUpcoming(false);
      } catch (err) {
        setError('Failed to fetch media');
        setLoadingTrending(false);
        setLoadingUpcoming(false);
      }
    };

    fetchMediaData();
    fetchUserWatchlist();
  }, [mediaType, user]);

  // Fetch a global featured item on mount using concurrent API calls.
  useEffect(() => {
    const fetchGlobalFeatured = async () => {
      try {
        const mediaTypes = ['books', 'movies', 'tv_seasons'];
        const results = await Promise.all(
          mediaTypes.map(async (type) => {
            const trendingMedia = await getTrendingMedia(type);
            const formattedTrending = formatMediaItems(trendingMedia, type);
            const parsedTrending = parseReleaseDates(formattedTrending);

            const upcomingMedia = await getUpcomingMedia(type);
            const formattedUpcoming = formatMediaItems(upcomingMedia, type);
            const parsedUpcoming = parseReleaseDates(formattedUpcoming);

            return [...parsedTrending, ...parsedUpcoming];
          })
        );

        // Flatten the results into a single array.
        const combined = results.flat();
        if (combined.length > 0) {
          const randomIndex = Math.floor(Math.random() * combined.length);
          setFeaturedItem(combined[randomIndex]);
        }
      } catch (err) {
        console.error('Failed to fetch global featured item:', err);
      }
    };

    fetchGlobalFeatured();
  }, []); // This effect runs only once on mount.

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
        <ContentToggle setMediaType={setMediaType} />

        {featuredItem && (
          <FeaturedRelease
            item={featuredItem}
            onViewDetails={openModalWithItem}
            userWatchlist={userWatchlist}
            refetchWatchlist={fetchUserWatchlist}
            mediaType={mediaType}
          />
        )}

        <Box px={4} py={1}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Upcoming Releases
          </Text>
          {loadingUpcoming ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Carousel
              items={upcomingReleasesData}
              onOpenModal={openModalWithItem}
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
              onOpenModal={openModalWithItem}
              userWatchlist={userWatchlist}
              refetchWatchlist={fetchUserWatchlist}
              mediaType={mediaType}
            />
          )}
          <WatchlistPreview watchlist={userWatchlist} mediaType={mediaType} />
        </Box>
        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
            fetchUserWatchlist();
          }}
          item={selectedItem}
          refetchWatchlist={fetchUserWatchlist}
        />
      </Box>
    </>
  );
};

export default HomePage;
