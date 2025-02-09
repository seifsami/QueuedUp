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

  // Fetch the user's watchlist from the backend
  const fetchUserWatchlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await getUserWatchlist(user.uid);
      console.log('Fetched watchlist:', data);
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
          <Heading as="h2" size="xl" mb={4} color="brand.500">
            My Tracking List
          </Heading>
  
          {/* Tabs with Custom Colors */}
          <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" colorScheme="brand" pb={2}>
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
  
          {/* Content Section */}
          {loading ? (
            <Center>
              <Spinner size="xl" color="brand.100" />
            </Center>
          ) : (
            <VStack spacing={4} align="stretch">
              {filteredData.map((item) => (
                <WatchlistPreviewCard key={item._id} item={item} userId={user?.uid}/>
              ))}
              {filteredData.length === 0 && (
                <Text py={10} textAlign="center" color="brand.500">
                  Your watchlist is currently empty.
                </Text>
              )}
            </VStack>
          )}
        </Container>
      </>
    );
  };
  export default WatchlistPage;