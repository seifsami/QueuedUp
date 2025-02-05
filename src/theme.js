import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      100: '#2E8B57',  // Muted Green (Primary)
      200: '#A8D5BA',  // Light Sage Green (Highlight/Hover)
      300: '#FF7043',  // Soft Coral (Active Highlight/Alerts)
      400: '#FAFAFA',  // Softer Background
      500: '#383838',  // Text Color (High Contrast)
      600: '#2E8B57',  // Teal for Primary Actions
      700: '#256B45',  // Softer Blue for Secondary Actions (if needed)
    },
    
    
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'brand.600',
          color: 'white',
          _hover: { bg: 'brand.700' },
        },
        outline: {
          borderColor: 'brand.600',
          color: 'brand.600',
          _hover: { bg: 'brand.100', color: 'white' },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.400', // Updated to softer background
        color: 'brand.500',
      },
      h1: { fontSize: '24px', fontWeight: '700' },
      h2: { fontSize: '20px', fontWeight: '600' },
      p: { fontSize: '14px', color: 'brand.500' },
    },
  },
});

export default theme;
