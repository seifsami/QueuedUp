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
      <Container maxW="1200px" mx="auto" p={4} bg="white">
        <Heading as="h2" size="xl" mb={4}>
          My Tracking List
        </Heading>
        <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" colorScheme="green" pb={2}>
          <TabList>
            {filterOptions.map((filterOption, index) => (
              <Tab key={filterOption.value} isSelected={tabIndex === index}>
                {filterOption.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <HStack spacing={4} mb={4}>
          <ButtonGroup isAttached variant="outline">
            <Button isActive={releaseStatus === 'upcoming'} onClick={() => handleReleaseStatusChange('upcoming')}>
              Upcoming
            </Button>
            <Button isActive={releaseStatus === 'released'} onClick={() => handleReleaseStatusChange('released')}>
              Released
            </Button>
          </ButtonGroup>
          <Select onChange={handleSortChange} value={sortCriterion} size="sm">
            {Object.entries(sortOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </HStack>
        {loading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredData.map((item) => (
              <WatchlistPreviewCard key={item._id} item={item} />
            ))}
            {filteredData.length === 0 && <Text py={10} textAlign="center">Your watchlist is currently empty.</Text>}
          </VStack>
        )}
      </Container>
    </>
  );
};

export default WatchlistPage;
