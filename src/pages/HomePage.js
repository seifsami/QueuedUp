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
  const [mediaType, setMediaType] = useState('books'); // Default media type
  const [trendingData, setTrendingData] = useState([]);
  const [upcomingReleasesData, setUpcomingReleasesData] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userWatchlist, setUserWatchlist] = useState([]);

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
      console.log('Fetching watchlist for user:', user.uid);
      const { data } = await getUserWatchlist(user.uid);  // Extract 'data' array directly
      console.log('Fetched watchlist:', data);
      setUserWatchlist(data);  // Save the array directly
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    }
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (typeof dateStr === 'string' && dateStr.includes(',')) {
      const parsedDate = Date.parse(dateStr);  // Convert to timestamp
      return isNaN(parsedDate) ? null : new Date(parsedDate);  // Return date or null if invalid
    }
    return new Date(dateStr);  // Default case for ISO strings
  };

  const parseReleaseDates = (items) => {
    return items.map(item => ({
      ...item,
      releaseDate: item.release_date ? normalizeDate(item.release_date) : null,
    }));
  };

  const formatMediaItems = (items, mediaType) => {
    return items.map((item) => ({
      ...item,
      media_type: mediaType,  // Add the media type
    }));
  };

  

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoadingTrending(true);
        setLoadingUpcoming(true);
    
        const trendingMedia = await getTrendingMedia(mediaType);
        const formattedTrendingMedia = formatMediaItems(trendingMedia, mediaType);  // Add media_type
        setTrendingData(parseReleaseDates(formattedTrendingMedia));  // Parse release dates
    
        const upcomingMedia = await getUpcomingMedia(mediaType);
        const formattedUpcomingMedia = formatMediaItems(upcomingMedia, mediaType);  // Add media_type
        setUpcomingReleasesData(parseReleaseDates(formattedUpcomingMedia));  // Parse release dates
    
        setLoadingTrending(false);
        setLoadingUpcoming(false);
      } catch (err) {
        setError('Failed to fetch media');
        setLoadingTrending(false);
        setLoadingUpcoming(false);
      }
    };

    fetchMediaData();
    fetchUserWatchlist();  // Fetch watchlist after fetching media
  }, [mediaType, user]);  // Refetch when mediaType or user changes

  if (error) {
    return <Center><Text color="red.500">{error}</Text></Center>;
  }
  console.log('Watchlist in HomePage:', userWatchlist);

  return (
    <>
      <Header />
      <Box maxW={{ xl: "1200px" }} mx="auto" bg="white">
        <ContentToggle setMediaType={setMediaType} />  {/* Pass setMediaType */}
        <Box bg='brand.100'>
          <Box bg='brand.100'>
            <FeaturedRelease />
          </Box>
        </Box>
        <Box px={4} py={1}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Upcoming Releases</Text>
          {loadingUpcoming ? (
            <Center><Spinner size="xl" /></Center>
          ) : (
            <Carousel
              items={upcomingReleasesData}
              onOpenModal={openModalWithItem}
              userWatchlist={userWatchlist}  // Pass watchlist to Carousel
              refetchWatchlist={fetchUserWatchlist}  // Pass refetch function to Carousel
            />
          )}
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Trending</Text>
          {loadingTrending ? (
            <Center><Spinner size="xl" /></Center>
          ) : (
            <Carousel
              items={trendingData}
              onOpenModal={openModalWithItem}
              userWatchlist={userWatchlist}  // Pass watchlist to Carousel
              refetchWatchlist={fetchUserWatchlist}  // Pass refetch function to Carousel
              mediaType={mediaType}
            />
          )}
          

          <WatchlistPreview watchlist={userWatchlist} mediaType={mediaType} />

        </Box>
        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();  // Close the modal
            fetchUserWatchlist();  // Refresh the watchlist when modal closes
          }}
          item={selectedItem}
          refetchWatchlist={fetchUserWatchlist}  // Pass refetch function
        />
      </Box>
    </>
  );
};

export default HomePage;
