import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from '../components/Header';
import ContentToggle from '../components/ContentToggle';
import SearchBar from '../components/SearchBar';
import FeaturedRelease from '../components/FeaturedRelease';
import UpcomingReleases from '../components/UpcomingReleases';
import TrendingNow from '../components/TrendingNow';
import WatchlistPreview from '../components/WatchlistPreview';

const HomePage = () => {
    const upcomingReleasesData = [
        {
          id: 1,
          title: "The Great Escape",
          releaseDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        },
        {
          id: 2,
          title: "Adventures of Sherlock Holmes",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        },
        {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          },
        // ... more items
    ];

    const trendingData = [
        { id: 1, title: "Breaking Boundaries", releaseDate:  new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 2, title: "Extraction", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
        // ... more items
    ];

    const watchlistData = [
        { id: 1, title: "Stranger Things", status: "2 episodes left" },
        { id: 2, title: "The Witcher", status: "5 episodes left" },
        // ... more items
    ];
      

      
      

    return (
        <Box px={{ base: 4, md: 6, lg: 8 }} py={4}> {/* px is for horizontal padding */}
          <Header  w="100vw"/>
          <ContentToggle />
          <SearchBar />
          <FeaturedRelease />
          <UpcomingReleases releases={upcomingReleasesData} />
          <TrendingNow trending={trendingData} />
          <WatchlistPreview watchlist={watchlistData} />
        </Box>
      );
    };
    
    export default HomePage;
