const FeatureCard = ({ icon, title, description }) => (
    <VStack
      borderWidth="1px"
      rounded="lg"
      p={5}
      align="center"
      bg="white"
    >
      <Icon as={icon} boxSize={10} color="brand.100" />
      <Text fontWeight="bold">{title}</Text>
      <Text fontSize="sm">{description}</Text>
    </VStack>
  );