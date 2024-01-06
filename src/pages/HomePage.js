import React, {useState} from 'react';
import { Box, Text} from '@chakra-ui/react';
import Header from '../components/Header';
import ContentToggle from '../components/ContentToggle';
import FeaturedRelease from '../components/FeaturedRelease';
import WatchlistPreview from '../components/WatchlistPreview';
import Carousel from '../components/Carousel';
import DetailsModal from '../components/DetailsModal';

const HomePage = ({ user }) => {
  const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const openModalWithItem = (item) => {
      setSelectedItem(item);
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
      setSelectedItem(null);
    };

    
    const upcomingReleasesData = [
      {
        id: 1,
        title: "The Great Escape",
        releaseDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
        image:`${process.env.PUBLIC_URL}51J4VWwlmvL.jpg`,
        author:'John Sturges',
        description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
      },
      {
        id: 2,
        title: "Adventures of Sherlock Holmes",
        releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        image: `${process.env.PUBLIC_URL}Americandad.jpeg`,
        author:'John Sturges',
        description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
      },
      {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}familyswitch.jpeg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}hitchikers.jpeg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}oppenheimer.jpeg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}simpsons.jpeg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}whatif.jpeg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`https://image.tmdb.org/t/p/w500/v77WjVsTMPKTpXZoW2RVNegappO.jpg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
        {
          id: 3,
          title: "Sweeney Todd",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`,
          author:'John Sturges',
          description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",
        },
      // ... more items
  ];

  const trendingData = [
      { id: 1, title: "Tress Of The Emerald Sea", releaseDate:  new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`, author:'John Sturges', description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",},
      { id: 2, title: "Mother Night", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}71RY4785nIL._AC_UF1000,1000_QL80_.jpg`, author:'Kurt Vonnegut', description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.", },
      { id: 3, title: "East Of Eden", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),image:`${process.env.PUBLIC_URL}510g2SGySaL.jpg`, author:'John Sturges',description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",} ,
      { id: 4, title: "Tomorrow, and tomorrow, and tomorrow", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}tomorrow.jpeg`, author:'John Sturges', description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",},
      { id: 5, title: "Name of The Wind", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}rothfuss.webp`, author:'John Sturges',description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.", },
      { id: 6, title: "Master and Margarita", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}master.jpeg`, author:'John Sturges',description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.", },
      { id: 7, title: "Hitchikers Guide To The Galaxy", releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), image:`${process.env.PUBLIC_URL}hitchikers.jpeg`, author:'John Sturges',description: "Combining the intellect of Malcolm Gladwell with the irreverent humor of Mary Roach and the paradigm-shifting analysis of Jared Diamond, a leading social scientist offers an unprecedented look inside our complex and often paradoxical relationships with animals.",},
  ];


    const watchlistData = [
        { id: 1, title: "Stranger Things Season 2", series: "Stranger Things", type:"book", image:`${process.env.PUBLIC_URL}51J4VWwlmvL.jpg`,creator: "Matt Dinniman", releaseDate: '2023-12-30'},
        { id: 2, title: "The First Law", series: "Mistborn",  type: "tv", image:`${process.env.PUBLIC_URL}51x86u3P-4L.jpg`, creator: "Steven Spielberg", releaseDate: '2023-12-30'},
        // ... more items
    ];
      

      
      

    return (
      <>
      <Header/>
      {/* Apply max width directly to the Box and use auto margins for horizontal centering */}
      <Box maxW={{ xl: "1200px" }} mx="auto" bg="white">
      <ContentToggle />
      <Box bg='brand.100'>
        <Box bg='brand.100'>
          <FeaturedRelease/>
        </Box>
        </Box>
        <Box px={4} py={1} >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Upcoming Releases</Text>
        <Carousel items={upcomingReleasesData} 
          onOpenModal={openModalWithItem} />
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Trending</Text>
          <Carousel 
          items={trendingData}
          onOpenModal={openModalWithItem} 
        />
          <WatchlistPreview watchlist={watchlistData} />
        </Box>
        <DetailsModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          item={selectedItem} 
        />
      </Box>
    </>
  );
    };
    
    export default HomePage;
