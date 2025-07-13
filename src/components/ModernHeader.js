import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaMoon, FaSun, FaSearch, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../ModalContext';
import firebase from '../firebaseConfig';
import ModernSearchBar from './ModernSearchBar';

const ModernHeader = ({ searchQuery: initialSearchQuery, user }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { openModal, currentUser } = useModal();
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(24, 24, 27, 0.8)');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleHomeClick = () => {
    navigate('/homepage');
  };

  const handleLoginClick = () => {
    openModal();
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg={bg}
      backdropFilter="blur(20px)"
      borderBottom="1px solid"
      borderColor={borderColor}
      transition="all 0.2s"
    >
      <Flex
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        {(!isMobile || !showMobileSearch) && (
          <Box flexShrink={0}>
            <VStack spacing={0} align="start" cursor="pointer" onClick={handleHomeClick}>
              <Text
                fontSize={{ base: '24px', md: '28px' }}
                fontWeight="800"
                bgGradient="linear(to-r, brand.500, brand.600)"
                bgClip="text"
                letterSpacing="-0.02em"
              >
                QueuedUp
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                fontWeight="600"
                letterSpacing="0.05em"
                textTransform="uppercase"
                mt="-2px"
              >
                Never Miss A Release
              </Text>
            </VStack>
          </Box>
        )}

        {/* Search Bar */}
        {isMobile ? (
          showMobileSearch ? (
            <Box flex="1" mx={4}>
              <ModernSearchBar
                focusOnMount={true}
                onClose={() => setShowMobileSearch(false)}
              />
            </Box>
          ) : (
            <IconButton
              icon={<FaSearch />}
              variant="ghost"
              size="lg"
              onClick={() => setShowMobileSearch(true)}
              aria-label="Search"
            />
          )
        ) : (
          <Box flex="1" maxW="600px" mx={8}>
            <ModernSearchBar />
          </Box>
        )}

        {/* Right Side Actions */}
        {(!isMobile || !showMobileSearch) && (
          <HStack spacing={3}>
            {/* Dark Mode Toggle */}
            <IconButton
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="md"
              aria-label="Toggle color mode"
            />

            {/* User Menu */}
            {currentUser ? (
              <Menu>
                <MenuButton>
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      bg="brand.500"
                      color="white"
                      name={currentUser.email}
                    />
                    {!isMobile && (
                      <Text fontSize="sm" fontWeight="600">
                        {currentUser.email?.split('@')[0]}
                      </Text>
                    )}
                  </HStack>
                </MenuButton>
                <MenuList
                  bg={useColorModeValue('white', 'gray.800')}
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  boxShadow="xl"
                >
                  <MenuItem onClick={() => navigate('/profile')}>
                    View Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/watchlist')}>
                    My Watchlist
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout} color="red.500">
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                onClick={handleLoginClick}
                variant="primary"
                size="md"
              >
                Sign In
              </Button>
            )}
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default ModernHeader;