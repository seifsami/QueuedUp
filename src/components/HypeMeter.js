import React from "react";
import { Box, Text, Icon, Flex, HStack, Tooltip } from "@chakra-ui/react";
import { FaGem, FaBullhorn, FaChartLine, FaRocket, FaFire, FaInfoCircle } from "react-icons/fa";

// Define the hype level categories
const hypeLevels = [
  { label: "Hidden Gem", min: 0, max: 10, color: "green.700", icon: FaGem },
  { label: "Starting to Buzz", min: 10, max: 30, color: "green.400", icon: FaBullhorn },
  { label: "Trending", min: 30, max: 50, color: "yellow.400", icon: FaChartLine },
  { label: "Highly Anticipated", min: 50, max: 80, color: "orange.400", icon: FaRocket },
  { label: "Breakout Hit", min: 80, max: 100, color: "red.500", icon: FaFire },
];

// Function to determine the hype label & styling
const getHypeLabel = (percentage) => {
  return hypeLevels.find(level => percentage >= level.min && percentage < level.max) || hypeLevels[hypeLevels.length - 1];
};

const HypeMeter = ({ hypeMeterPercentage, showTooltip = false }) => {
  const hypeInfo = getHypeLabel(hypeMeterPercentage);

  return (
    <Box mt={4} textAlign="left">
      {/* Hype Meter Header */}
      <HStack spacing={2} mb={2} align="center">
        <Icon as={FaFire} color="red.500" />
        <Text fontSize="xl" fontWeight="bold">Hype Meter</Text>
        {showTooltip && (
          <Tooltip 
            label="Hype Meter is based on lifetime tracking. This week's ranking is based on new watchlist adds."
            bg="gray.700"
            color="white"
            placement="right"
            hasArrow
          >
            <Box display="inline-block">
              <Icon 
                as={FaInfoCircle} 
                color="gray.400" 
                cursor="pointer"
                _hover={{ color: "gray.600" }}
              />
            </Box>
          </Tooltip>
        )}
      </HStack>

      {/* Filled Hype Bar */}
      <Box 
        width="100%" 
        maxW="400px" 
        height="20px" 
        borderRadius="full" 
        bg="gray.200" 
        overflow="hidden"
        position="relative"
      >
        <Box 
          width={`${hypeMeterPercentage}%`} 
          height="100%" 
          bg={hypeInfo.color} 
          transition="width 0.5s ease-in-out"
        />
      </Box>

      {/* Hype Label Above the Bar */}
      <Text fontSize="md" fontWeight="bold" color={hypeInfo.color} mt={2} display="flex" alignItems="center">
        <Icon as={hypeInfo.icon} mr={2} />
        {hypeInfo.label}
      </Text>
    </Box>
  );
};

export default HypeMeter;
