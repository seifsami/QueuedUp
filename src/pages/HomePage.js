import React from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import Header from '../components/Header';
import ContentToggle from '../components/ContentToggle';
import SearchBar from '../components/SearchBar';
import FeaturedRelease from '../components/FeaturedRelease';
import UpcomingReleases from '../components/UpcomingReleases';
import TrendingNow from '../components/TrendingNow';
import WatchlistPreview from '../components/WatchlistPreview';
import Carousel from '../components/Carousel';

const HomePage = () => {
    const upcomingReleasesData = [
        {
          id: 1,
          title: "The Great Escape",
          releaseDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
          image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
        },
        {
          id: 2,
          title: "Adventures of Sherlock Holmes",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image: `${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
        },
        {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
          {
            id: 3,
            title: "Sweeney Todd",
            releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`
          },
        // ... more items
    ];

    const trendingData = [
        { id: 1, title: "Tress Of The Emerald Sea", releaseDate:  new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg` },
        { id: 2, title: "Mother Night", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}71RY4785nIL._AC_UF1000,1000_QL80_.jpg`},
        { id: 3, title: "East Of Eden", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),image:`${process.env.PUBLIC_URL}510g2SGySaL.jpg`} ,
        { id: 4, title: "Tomorrow, and tomorrow, and tomorrow", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}tomorrow.jpeg` },
        { id: 5, title: "Name of The Wind", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}rothfuss.webp` },
        { id: 6, title: "Master and Margarita", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}master.jpeg` },
        { id: 7, title: "Hitchikers Guide To The Galaxy", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}hitchikers.jpeg`},
    ];

    const watchlistData = [
        { id: 1, title: "Stranger Things", status: "2 episodes left" },
        { id: 2, title: "The Witcher", status: "5 episodes left" },
        // ... more items
    ];
      

      
      

    return (
      <>
      <Header/>
      {/* Apply max width directly to the Box and use auto margins for horizontal centering */}
      <Box maxW={{ xl: "1200px" }} mx="auto" bg="white">
      <ContentToggle />
      <Box bg="#32B992">
        <Box bg="#32B992">
          <FeaturedRelease />
        </Box>
        </Box>
        <Box px={4} py={1} >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Upcoming Releases</Text>
        <Carousel items={upcomingReleasesData} />
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Trending</Text>
          <Carousel items={trendingData} />
          <WatchlistPreview watchlist={watchlistData} />
        </Box>
      </Box>
    </>
  );
    };
    
    export default HomePage;
