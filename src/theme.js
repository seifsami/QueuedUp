import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      100: '#32B992',  // Primary color
      200: '#AF8A64',  // Secondary color
      300: '#FF9500',  // Accent color
      400: '#ECEBEB8', // Background color
      500: '#383838',  // Text color
    },
  },
  components: {
    Button: {
      variants: {
        // Define custom variants here if necessary
      },
    },
  },
});

export default theme;
