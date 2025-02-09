import React, { useState } from 'react';
import { Box, Image, Text, HStack, VStack, Icon, useColorModeValue, IconButton, useBreakpointValue, Tooltip, useToast } from '@chakra-ui/react';
import { FaBook, FaTv, FaFilm, FaShareAlt, FaPlus } from 'react-icons/fa';
import axios from 'axios'; // ✅ Import Axios for API calls
import DetailsModal from './DetailsModal';


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

const WatchlistPreviewCard = ({ item, userWatchlist, refetchWatchlist, openModal }) => {
  console.log("Item from WatchlistPreviewCard:", item)
  const [isModalOpen, setModalOpen] = useState(false);
  const [detailedItem, setDetailedItem] = useState(item); // 🟢 State to store full item data

  const bg = useColorModeValue('white', 'gray.700');
  const shareIconSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const titleMaxLines = useBreakpointValue({ base: 2, md: 1 });
  const cardHeight = useBreakpointValue({ base: 'auto', md: '120px' });
  const titleLineHeight = useBreakpointValue({ base: 'tall', md: 'normal' });
  const titlePadding = useBreakpointValue({ base: '1', md: '2' });

  const handleShareClick = (event) => {
    event.stopPropagation();
    console.log(`Sharing ${item.title}`);
  };

  // 🟢 Fetch full item details when card is clicked
  const handleCardClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    console.log("Card clicked, opening modal...");
  
    // 🔥 Ensure search input keeps focus
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 50); // Delay a bit to prevent flickering
    }
  
    let itemToShow = item;
  
    if (!item.description) {
      try {
        const { data } = await axios.get(
          `https://queuedup-backend-6d9156837adf.herokuapp.com/media/${item.media_type}/${item._id || item.item_id}`
        );
        console.log("Fetched detailed item:", data);
        setDetailedItem(data);
      } catch (error) {
        console.error("Error fetching detailed item:", error);
        setDetailedItem(item);
      }
    } else {
      setDetailedItem(item);
    }
  
    if (openModal) {
      openModal(itemToShow);
    } else {
      setModalOpen(true);
    }
  };
  

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
  console.log("Item passed to DetailsModal from WatchlistPreviewCard:", detailedItem);


  return (
    <>
      <HStack
        className="watchlist-card"
        key={item.id}
        p={{ base: 2, md: 4 }}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg={bg}
        minHeight={cardHeight}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
        onClick={handleCardClick} // 🟢 Fetch and open modal on click
        cursor="pointer"
      >
        <Icon as={mediaTypeIcons[item.media_type]} boxSize={6} mr={2} />
        <Image
          src={item.image || defaultImages[item.media_type || "books"]}
          alt={item.title}
          htmlWidth="80px"
          htmlHeight="120px"
          objectFit="cover"
          borderRadius="md"
        />
        <Box flex="1" pl={2} minWidth={0} pr={titlePadding}>
          <Text fontWeight="bold" noOfLines={titleMaxLines} lineHeight={titleLineHeight} maxHeight={`${titleLineHeight * 2}em`} overflow="hidden" textOverflow="ellipsis">
            {item.title}
          </Text>
          <Text fontSize="sm">{item.author || item.director || item.network_name || 'N/A'}</Text>
          <Text fontSize="sm">{item.series}</Text>
          <Text fontSize="sm">{formatReleaseDate(item.release_date)}</Text>
        </Box>
        {/* Share Button Temporarily Removed until functionality works */}
          {/*
          {useBreakpointValue({ base: false, md: true }) ? (
            <Tooltip hasArrow label="Share" bg="teal.600">
              <IconButton
                aria-label="Share"
                icon={<Icon as={FaShareAlt} />}
                size={shareIconSize}
                onClick={handleShareClick}
              />
            </Tooltip>
          ) : (
            <VStack align="end">
              <IconButton
                aria-label="Share"
                icon={<Icon as={FaShareAlt} />}
                size="sm"
                variant="outline"
                onClick={handleShareClick}
              />
            </VStack>
          )}
          */}
      </HStack>

      {/* Details Modal */}
      {!openModal && (
        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          item={detailedItem}
          userWatchlist={userWatchlist}
          refetchWatchlist={refetchWatchlist}
        />
      )}
    </>
  );
};

export default WatchlistPreviewCard;
