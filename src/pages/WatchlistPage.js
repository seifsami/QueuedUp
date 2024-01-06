import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import Header from '../components/Header';
import WatchlistPreviewCard from '../components/WatchlistPreviewCard';

// Dummy data
const initialWatchlistData = [
    { id: 1, title: "Stranger Things Season 2", series: "Stranger Things", type:"tv", image:`${process.env.PUBLIC_URL}51J4VWwlmvL.jpg`,creator: "Matt Dinniman", releaseDate: '2023-12-30', dateAdded:'2023-12-01'},
    { id: 2, title: "American Dad Season 12", series: "American Dad",  type: "tv", image:`${process.env.PUBLIC_URL}Americandad.jpeg`, creator: "Seleem Seleem ", releaseDate: '2024-09-30', dateAdded:'2023-12-02'},
    { id: 3, title: "Family Switch", series: "N/A" ,  type: "movie", image:`${process.env.PUBLIC_URL}familyswitch.jpeg`, creator: "Steven Spielberg", releaseDate: '2024-03-30', dateAdded:'2023-12-03'},
    { id: 4, title: "Malcolm In The Middle Season 6", series: "Malcolm In The Middle",  type: "tv", image:`${process.env.PUBLIC_URL}Malcolm.jpeg`, creator: "Steven Spielberg", releaseDate: '2023-11-30', dateAdded:'2023-12-04'},
    { id: 5, title: "Oppenheimer", series: "N/A",  type: "movie", image:`${process.env.PUBLIC_URL}oppenheimer.jpeg`, creator: "Christopher Nolan", releaseDate: '2024-12-30', dateAdded:'2023-12-05'},
    { id: 6, title: "The Simpsons Season 30", series: "The Simpsons",  type: "tv", image:`${process.env.PUBLIC_URL}simpsons.jpeg`, creator: "Matt Groening", releaseDate: '2025-12-30', dateAdded:'2023-12-06'},
    { id: 7, title: "What if?", series: "Marvel Mysteries",  type: "tv", image:`${process.env.PUBLIC_URL}whatif.jpeg`, creator: "Steven Spielberg", releaseDate: '2024-12-20', dateAdded:'2023-12-07'},
    { id: 8, title: "Tomorrow, and Tomorrow, And Tomorrow", series: "N/A",  type: "book", image:`${process.env.PUBLIC_URL}tomorrow.jpeg`, creator: "Gabrielle Zevin", releaseDate: '2024-12-21', dateAdded:'2023-12-08'},
    { id: 9, title: "The Name Of The Wind", series: "The KingKiller Chronicles",  type: "book", image:`${process.env.PUBLIC_URL}rothfuss.webp`, creator: "Patrick Rothfuss", releaseDate: '2024-12-22', dateAdded:'2023-12-09'},
    { id: 10, title: "Master and Margarita", series: "N/A",  type: "book", image:`${process.env.PUBLIC_URL}master.jpeg`, creator: "Mikhail Bulgagov", releaseDate: '2024-12-23', dateAdded:'2023-12-10'}
];


const filterOptions = ['all', 'book', 'tv', 'movie'];
const sortOptions = {
  releaseDate: 'Release Date',
  title: 'Title',
  dateAdded: 'Date Added',
};

  
const WatchlistPage = () => {
    const [watchlistData, setWatchlistData] = useState(initialWatchlistData);
    const [tabIndex, setTabIndex] = useState(0);
    const [sortCriterion, setSortCriterion] = useState('dateAdded');
    const [releaseStatus, setReleaseStatus] = useState('upcoming');

    
  
    
    
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
    const releaseDate = new Date(item.releaseDate);
    const isUpcoming = releaseDate >= today;
    return releaseStatus === 'upcoming' ? isUpcoming : !isUpcoming;
  })
  .filter((item) => {
    // Filter based on selected tab, 'all' shows all types
    const selectedType = filterOptions[tabIndex];
    return selectedType === 'all' || item.type === selectedType;
  })
    .sort((a, b) => {
      if (sortCriterion === 'releaseDate') {
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      } else if (sortCriterion === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortCriterion === 'dateAdded') {
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      }
      return 0;
    });

    
  
    return (
        <>
          <Header />
          <Container maxW="1200px" mx="auto" p={4} bg="white">
            <Heading as="h2" size="xl" mb={4}>My Tracking List</Heading>
            <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" colorScheme="green" pb={2}>
                <TabList>
                {filterOptions.map((filterOption, index) => (
                    <Tab key={filterOption} isSelected={tabIndex === index}>
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </Tab>
                ))}
                </TabList>
            </Tabs>
            <HStack spacing={4} mb={4}>
              <ButtonGroup isAttached variant="outline">
                <Button 
                  isActive={releaseStatus === 'upcoming'} 
                  onClick={() => handleReleaseStatusChange('upcoming')}
                >
                  Upcoming
                </Button>
                <Button 
                  isActive={releaseStatus === 'released'} 
                  onClick={() => handleReleaseStatusChange('released')}
                >
                  Released
                </Button>
              </ButtonGroup>
              <Select onChange={handleSortChange} value={sortCriterion} size="sm">
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </HStack>
            <VStack spacing={4} align="stretch">
              {filteredData.map((item) => (
                <WatchlistPreviewCard key={item.id} item={item} />
              ))}
              {filteredData.length === 0 && (
                <Text py={10} textAlign="center">Your watchlist is currently empty.</Text>
              )}
            </VStack>
          </Container>
        </>
      );
    };
    
    export default WatchlistPage;