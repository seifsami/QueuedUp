import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';

const ModernTabs = ({ selectedIndex, onChange, options }) => {
  const bg = useColorModeValue('gray.100', 'gray.800');
  const selectedBg = useColorModeValue('white', 'gray.700');
  const selectedColor = useColorModeValue('gray.900', 'white');
  const color = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      position="sticky"
      top="80px"
      zIndex="100"
      bg={useColorModeValue('rgba(249, 250, 251, 0.8)', 'rgba(17, 24, 39, 0.8)')}
      backdropFilter="blur(20px)"
      py={4}
    >
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6 }}>
        <Tabs
          index={selectedIndex}
          onChange={onChange}
          variant="unstyled"
          size="lg"
        >
          <TabList
            bg={bg}
            borderRadius="16px"
            p="6px"
            display="inline-flex"
            border="none"
            boxShadow="sm"
          >
            {options.map((option, index) => (
              <Tab
                key={option.value}
                borderRadius="12px"
                fontWeight="600"
                fontSize="16px"
                color={color}
                px={6}
                py={3}
                mx={1}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                _selected={{
                  bg: selectedBg,
                  color: selectedColor,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-1px)',
                }}
                _hover={{
                  color: selectedColor,
                  transform: selectedIndex === index ? 'translateY(-1px)' : 'translateY(-0.5px)',
                }}
              >
                {option.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>
    </Box>
  );
};

export default ModernTabs;