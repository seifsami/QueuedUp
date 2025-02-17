import React, { useState, useEffect } from 'react';
import {
  Heading,
  Select,
  ButtonGroup,
  Button,
  Container,
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  Tab,
  Spinner,
  Center,
} from '@chakra-ui/react';
import Header from '../components/Header';
import WatchlistPreviewCard from '../components/WatchlistPreviewCard';
import { getUserWatchlist } from '../services/api';
import { FaShare } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import SharePreviewModal from '../components/SharePreviewModal';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'books', label: 'Books' },
  { value: 'tv_seasons', label: 'TV Shows' },
  { value: 'movies', label: 'Movies' },
];
const sortOptions = {
  releaseDate: 'Release Date',
  title: 'Title',
  dateAdded: 'Date Added',
};

const WatchlistPage = ({ user }) => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [sortCriterion, setSortCriterion] = useState('dateAdded');
  const [releaseStatus, setReleaseStatus] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Fetch the user's watchlist from the backend
  const fetchUserWatchlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await getUserWatchlist(user.uid);
      
      setWatchlistData(data); // Update state with fetched data
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWatchlist();
  }, [user]);

  const handleReleaseStatusChange = (status) => {
    setReleaseStatus(status);
  };

  const handleSortChange = (e) => {
    setSortCriterion(e.target.value);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      if (prev.length >= 12) return prev;
      return [...prev, itemId];
    });
  };

  const getSelectedItems = () => {
    return selectedItems.map(id => watchlistData.find(item => item.item_id === id)).filter(Boolean);
  };

  const handleShareClick = () => {
    setIsSelectionMode(true);
    setSelectedItems([]);
  };

  const handleGeneratePreview = () => {
    setIsShareModalOpen(true);
  };

  const handleTabChange = (index) => {
    setTabIndex(index);
    // No need to clear selected items
  };

  // Filter and sort logic
  const filteredData = watchlistData
  .filter((item) => {
    // Filter based on release status
    const today = new Date();
    
    // Handle null or missing release_date
    if (!item.release_date || item.release_date === "N/A") {
      return releaseStatus === 'upcoming'; // Treat as upcoming
    }

    const releaseDate = new Date(item.release_date);
    const isUpcoming = releaseDate >= today;

    return releaseStatus === 'upcoming' ? isUpcoming : !isUpcoming;
  })
    .filter((item) => {
      // Filter based on selected tab, 'all' shows all types
      const selectedType = filterOptions[tabIndex].value;
      return selectedType === 'all' || item.media_type === selectedType;

    })
    .sort((a, b) => {
      if (sortCriterion === 'releaseDate') {
        return new Date(a.release_date) - new Date(b.release_date);
      } else if (sortCriterion === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortCriterion === 'dateAdded') {
        return new Date(a.timestamp_added) - new Date(b.timestamp_added);
      }
      return 0;
    });

    return (
      <>
        <Header />
        <Container maxW="1200px" mx="auto" p={4} bg="brand.400" borderRadius="xl" boxShadow="md">
          <HStack justify="space-between" mb={4}>
            <Heading as="h2" size="xl" color="brand.500">
              My Tracking List
            </Heading>
            {!isSelectionMode ? (
              <Button
                onClick={handleShareClick}
                colorScheme="brand"
                size="sm"
                leftIcon={<Icon as={FaShare} />}
              >
                Share Watchlist
              </Button>
            ) : (
              <Button
                onClick={() => setIsSelectionMode(false)}
                colorScheme="brand"
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            )}
          </HStack>
  
          {/* Tabs with Custom Colors */}
          <Tabs index={tabIndex} onChange={handleTabChange} variant="soft-rounded" colorScheme="brand" pb={2}>
            <TabList>
              {filterOptions.map((filterOption, index) => (
                <Tab
                  key={filterOption.value}
                  _selected={{
                    bg: 'brand.100',
                    color: 'white',
                  }}
                  _hover={{
                    bg: 'brand.200',
                  }}
                >
                  {filterOption.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
  
          <HStack spacing={4} mb={4}>
            {/* ButtonGroup with Updated Colors */}
            <ButtonGroup isAttached variant="outline" size="sm">
  <Button
    isActive={releaseStatus === 'upcoming'}
    onClick={() => handleReleaseStatusChange('upcoming')}
    bg={releaseStatus === 'upcoming' ? 'brand.100' : 'white'}  // White background for inactive
    color={releaseStatus === 'upcoming' ? 'white' : 'brand.100'}  // Muted Green text when inactive
    borderColor="brand.100"
    _hover={{
      bg: releaseStatus === 'upcoming' ? 'brand.100' : 'brand.200',  // Light Sage on hover for inactive
      color: releaseStatus === 'upcoming' ? 'white' : 'brand.100',
    }}
    _active={{
      bg: 'brand.100',
      color: 'white',
    }}
    borderRightRadius="none"  // Smooth connection with the next button
  >
    Upcoming
  </Button>

  <Button
    isActive={releaseStatus === 'released'}
    onClick={() => handleReleaseStatusChange('released')}
    bg={releaseStatus === 'released' ? 'brand.100' : 'white'}
    color={releaseStatus === 'released' ? 'white' : 'brand.100'}
    borderColor="brand.100"
    _hover={{
      bg: releaseStatus === 'released' ? 'brand.100' : 'brand.200',
      color: releaseStatus === 'released' ? 'white' : 'brand.100',
    }}
    _active={{
      bg: 'brand.100',
      color: 'white',
    }}
    borderLeftRadius="none"  // Smooth connection with the previous button
  >
    Released
  </Button>
</ButtonGroup>

  
            {/* Select Dropdown with Custom Styles */}
            <Select
              onChange={handleSortChange}
              value={sortCriterion}
              size="sm"
              borderColor="brand.100"
              color="brand.500"
              _hover={{ borderColor: 'brand.100' }}
              _focus={{ borderColor: 'brand.100', boxShadow: '0 0 0 1px #2E8B57' }}
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </HStack>
  
          {isSelectionMode && (
            <HStack justify="space-between" mb={4} p={2} bg="gray.100" borderRadius="md">
              <Text color="brand.500">
                {selectedItems.length}/12 selected
              </Text>
              <Button
                colorScheme="brand"
                size="sm"
                isDisabled={selectedItems.length === 0}
                onClick={handleGeneratePreview}
              >
                Generate Preview
              </Button>
            </HStack>
          )}

          {/* Content Section */}
          {loading ? (
            <Center>
              <Spinner size="xl" color="brand.100" />
            </Center>
          ) : (
            <VStack spacing={4} align="stretch">
              {filteredData.map((item) => {
                return (
                  <WatchlistPreviewCard 
                    key={item.item_id} 
                    item={item} 
                    userId={user?.uid}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedItems.includes(item.item_id)}
                    onSelect={() => handleItemSelect(item.item_id)}
                    showDelete={true}
                    refetchWatchlist={fetchUserWatchlist}
                  />
                );
              })}
              {filteredData.length === 0 && (
                <Text py={10} textAlign="center" color="brand.500">
                  Your watchlist is currently empty.
                </Text>
              )}
            </VStack>
          )}
        </Container>

        <SharePreviewModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          selectedItems={getSelectedItems()}
        />
      </>
    );
  };
  export default WatchlistPage;