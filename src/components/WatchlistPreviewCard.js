import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Icon,
  IconButton,
  useColorModeValue,
  useBreakpointValue,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { FaBook, FaTv, FaFilm, FaTrash } from 'react-icons/fa';
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

const WatchlistPreviewCard = ({ item, userWatchlist, refetchWatchlist, openModal, showDelete = true, userId }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const shareIconSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const titleMaxLines = useBreakpointValue({ base: 2, md: 1 });
  const cardHeight = useBreakpointValue({ base: 'auto', md: '120px' });
  const titleLineHeight = useBreakpointValue({ base: 'tall', md: 'normal' });
  const titlePadding = useBreakpointValue({ base: '1', md: '2' });

  const [isModalOpen, setModalOpen] = useState(false);
  const [detailedItem, setDetailedItem] = useState(item); 
  const [isHidden, setHidden] = useState(false);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const toast = useToast();

  
  if (isHidden) return null; 
  console.log("🔍 Full Item Object in WatchlistPreviewCard:", item);
  console.log("🛠 Extracted item_id:", item._id || item.id); 


  const handleRemoveClick = async () => {
    const itemId = item.item_id || item._id || item.id;  // ✅ Ensure we extract correctly
    console.log("🛠 Removing item:", item);
    console.log("🛠 Extracted item_id:", itemId);  // ✅ Now this should print the correct ID
  
    if (!itemId) {
      console.error("🚨 ERROR: item_id is undefined!");
      return; // Prevent API call if item_id is missing
    }
  
    setHidden(true); // 🔥 Hide from UI immediately
  
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.delete(`https://queuedup-backend-6d9156837adf.herokuapp.com/watchlist/${userId}`, {
          data: { item_id: itemId }  // ✅ Send correct item_id
        });
  
        console.log("API Response:", response.data); // ✅ Check Heroku logs
        refetchWatchlist && refetchWatchlist();
      } catch (error) {
        console.error("Error removing item:", error);
        setHidden(false);
      }
    }, 7000);
  
    setUndoTimeout(timeoutId);
  };
  

    // Show Snackbar-style notification
    toast({
      position: "bottom",
      duration: 7000,
      render: ({ onClose }) => (
        <HStack
          bg="#2E2E2E" // 🔥 Darker gray for better contrast
          color="white"
          p={4} // 🔥 More padding for balance
          borderRadius="md"
          align="center"
          justify="space-between"
          width="auto"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)" // 🔥 Slightly deeper shadow
        >
          <Text fontSize="md" fontWeight="600" color="#F5F5F5"> {/* 🔥 Brighter for visibility */}
            Item removed
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold" // 🔥 Stronger emphasis
            cursor="pointer"
            letterSpacing="0.5px"
            color="#2E8B57"
            _hover={{ 
              textDecoration: "underline", 
              color: "#1E6A3A" 
            }} 
            onClick={() => {
              clearTimeout(timeoutId);
              setHidden(false);
              onClose();
            }}
          >
            UNDO
          </Text>
        </HStack>
      ),
    });
    
    
    
    
    
  };
  
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
      <Box position="relative" width="full">
        {/* Trash Button (Top Right) */}
        {showDelete && (
          <Tooltip 
          label="Remove from Watchlist" 
          bg="#333" 
          color="#FFF" 
          fontSize="xs"  // 🔥 Makes it slightly smaller
          borderRadius="md"
          p={2}
        >
          <IconButton
            aria-label="Remove"
            icon={<FaTrash />}
            size="sm"
            position="absolute"
            top="2px"   // 🔥 Adds more padding
            right="2px"
            bg="transparent"
            color="gray.500"
            _hover={{ color: "red.500", bg: "transparent" }}
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevents modal opening
              handleRemoveClick();
            }}
          />
        </Tooltip>
        
        )}
  
        {/* Card Content */}
        <HStack
          className="watchlist-card"
          key={item.id}
          p={{ base: 2, md: 4 }}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={bg}
          minHeight="120px"
          _hover={{ bg: hoverBg }}
          onClick={handleCardClick}
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
          <Box flex="1" pl={2} minWidth={0}>
            <Text fontWeight="bold" noOfLines={2} lineHeight="tall" overflow="hidden">
              {item.title}
            </Text>
            <Text fontSize="sm">{item.author || item.director || item.network_name || 'N/A'}</Text>
            <Text fontSize="sm">{item.series}</Text>
            <Text fontSize="sm">{item.release_date ? new Date(item.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</Text>
          </Box>
        </HStack>
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
      </Box>
  
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
