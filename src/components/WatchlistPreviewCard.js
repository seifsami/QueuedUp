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
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
 
} from '@chakra-ui/react';
import { FaBook, FaTv, FaFilm, FaTrash, FaEllipsisV, FaTimes } from 'react-icons/fa';
import axios from 'axios'; // ✅ Import Axios for API calls
import DetailsModal from './DetailsModal';
import { useNavigate } from 'react-router-dom'


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
  const [fadeOut, setFadeOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();




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
  
    setFadeOut(true); // 🔥 Start fade-out effect

    setTimeout(() => {
    setHidden(true); // 🔥 Hide from UI after fade-out completes
    }, 400); // 400ms fade-out

  
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
        setFadeOut(false);
      }
    }, 5000);
  
    setUndoTimeout(timeoutId);
  
  

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
              setFadeOut(false);
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
  const handleCardClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("🟢 WatchlistPreviewCard Clicked!", item);

    if (item.slug) {
      console.log("🔗 Navigating to:", `/media/${item.media_type}/${item.slug}`);
      navigate(`/media/${item.media_type}/${item.slug}`);
    } else {
      console.error("🚨 Missing slug for item:", item);
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
        {/* 🗑️ Delete/Options Button (Top Right) */}
        {showDelete && (
          isMobile ? (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                size="sm"
                position="absolute"
                top="2px"
                right="2px"
                bg="transparent"
                color="gray.500"
                _hover={{ color: "gray.700", bg: "transparent" }}
                onClick={(e) => e.stopPropagation()} // Prevents card click
              />
              <MenuList
                   minW="120px" // ✅ Keeps it compact
                   borderRadius="md"
                   boxShadow="0px 4px 12px rgba(0,0,0,0.15)" // ✅ Smooth shadow
                   zIndex="1000"
                   transform="translateY(-5px)"  // ✅ Ensures it stays above everything
              >
                <MenuItem
                  icon={<FaTrash />}
                  color="red.500" // ✅ Make the trash icon red for clarity
                  fontSize="sm" // ✅ Reduce font size to match design better
                  p="8px 12px" // ✅ More compact padding
                  _hover={{ bg: "red.50", color: "red.600" }} // ✅ Subtle hover effect
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveClick();
                  }}
                >
                  Remove
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Tooltip
              label="Remove from Watchlist"
              bg="#F5F5F5" // ✅ Light gray for contrast
              color="#333" // ✅ Darker text for readability
              fontSize="xs"
              borderRadius="md"
              p={2}
              boxShadow="0px 4px 10px rgba(0,0,0,0.1)" // ✅ Subtle shadow for depth
            >
              <IconButton
                aria-label="Remove"
                icon={<FaTimes />}
                size="sm"
                position="absolute"
                top="2px"
                right="2px"
                bg="transparent"
                color="gray.500"
                _hover={{ color: "red.500", bg: "transparent" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveClick();
                }}
              />
            </Tooltip>
          )
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
          style={{
            opacity: fadeOut ? 0 : 1, // 🔥 Gradual fade-out
            transition: "opacity 0.4s ease-in-out", // 🔥 Smooth transition over 400ms
            pointerEvents: isMobile ? "none" : "auto"
          }}
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
