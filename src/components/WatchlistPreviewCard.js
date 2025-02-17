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
  MenuItem,
  Checkbox
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

const WatchlistPreviewCard = ({ 
  item, 
  userWatchlist, 
  refetchWatchlist, 
  openModal, 
  showDelete = true, 
  userId,
  isSelectionMode = false,
  isSelected = false,
  onSelect
}) => {
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
 


  const handleRemoveClick = async () => {
    const itemId = item.item_id || item._id || item.id;  // ✅ Ensure we extract correctly
    // ✅ Now this should print the correct ID
  
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
    
  };

  // 🟢 Fetch full item details when card is clicked
  const handleCardClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isSelectionMode) {
      onSelect?.();
      return;
    }

    if (item.slug) {
      navigate(`/media/${item.media_type}/${item.slug}`);
    } else {
      console.error("🚨 Missing slug for item:", item);
    }
  };
  

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        let date = new Date(Date.parse(dateString));
        if (isNaN(date.getTime())) throw new Error("Invalid Date");
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric', 
            timeZone: 'UTC'  // ✅ Ensures consistent UTC formatting
        });
    } catch (error) {
        console.error("Error parsing date:", dateString);
        return 'Invalid Date';
    }
};

  


  return (
    <>
      <Box position="relative" width="full">
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
                onClick={(e) => e.stopPropagation()}
                zIndex="1"
              />
              <MenuList
                minW="120px"
                borderRadius="md"
                boxShadow="0px 4px 12px rgba(0,0,0,0.15)"
                zIndex="1000"
              >
                <MenuItem
                  icon={<FaTrash />}
                  color="red.500"
                  fontSize="sm"
                  p="8px 12px"
                  _hover={{ bg: "red.50", color: "red.600" }}
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
              bg="#F5F5F5"
              color="#333"
              fontSize="xs"
              borderRadius="md"
              p={2}
              boxShadow="0px 4px 10px rgba(0,0,0,0.1)"
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
                zIndex="1"
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
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 0.4s ease-in-out",
          }}
          cursor="pointer"
          position="relative"
        >
          {isSelectionMode && (
            <Box 
              position="absolute" 
              left="2" 
              top="50%" 
              transform="translateY(-50%)"
              zIndex="1"
            >
              <Checkbox 
                isChecked={isSelected}
                colorScheme="brand"
                size="lg"
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect?.();
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          )}
          
          <HStack pl={isSelectionMode ? "40px" : "0"} width="100%">
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
              <Text fontSize="sm">{formatReleaseDate(item.release_date)}</Text>
            </Box>
          </HStack>
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



