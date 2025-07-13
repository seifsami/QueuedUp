import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  colors: {
    brand: {
      50: '#f0fdf4',   // Lightest green
      100: '#dcfce7',  // Very light green
      200: '#bbf7d0',  // Light green
      300: '#86efac',  // Medium light green
      400: '#4ade80',  // Medium green
      500: '#22c55e',  // Primary green
      600: '#16a34a',  // Dark green
      700: '#15803d',  // Darker green
      800: '#166534',  // Very dark green
      900: '#14532d',  // Darkest green
    },
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
    dark: {
      50: '#fafafa',
      100: '#1a1a1a',
      200: '#171717',
      300: '#141414',
      400: '#111111',
      500: '#0d0d0d',
      600: '#0a0a0a',
      700: '#080808',
      800: '#050505',
      900: '#000000',
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '12px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        _focus: {
          boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
        },
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: { 
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 25px rgba(34, 197, 94, 0.2)',
          },
          _active: { 
            transform: 'translateY(0)',
            bg: 'brand.700',
          },
        },
        secondary: {
          bg: 'gray.100',
          color: 'gray.900',
          border: '1px solid',
          borderColor: 'gray.200',
          _hover: { 
            bg: 'gray.200',
            borderColor: 'gray.300',
            transform: 'translateY(-1px)',
          },
          _dark: {
            bg: 'gray.800',
            color: 'gray.100',
            borderColor: 'gray.700',
            _hover: {
              bg: 'gray.700',
              borderColor: 'gray.600',
            },
          },
        },
        ghost: {
          bg: 'transparent',
          _hover: {
            bg: 'gray.100',
            _dark: { bg: 'gray.800' },
          },
        },
      },
      sizes: {
        sm: {
          h: '36px',
          px: '16px',
          fontSize: '14px',
        },
        md: {
          h: '44px',
          px: '20px',
          fontSize: '16px',
        },
        lg: {
          h: '52px',
          px: '24px',
          fontSize: '18px',
        },
      },
    },
    Card: {
      baseStyle: {
        bg: 'white',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'gray.200',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        _hover: {
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
        _dark: {
          bg: 'gray.800',
          borderColor: 'gray.700',
          _hover: {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    Tabs: {
      variants: {
        modern: {
          tablist: {
            bg: 'gray.100',
            borderRadius: '12px',
            p: '4px',
            border: 'none',
            _dark: { bg: 'gray.800' },
          },
          tab: {
            borderRadius: '8px',
            fontWeight: '600',
            color: 'gray.600',
            _selected: {
              bg: 'white',
              color: 'gray.900',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              _dark: {
                bg: 'gray.700',
                color: 'white',
              },
            },
            _hover: {
              color: 'gray.900',
              _dark: { color: 'white' },
            },
            transition: 'all 0.2s',
          },
        },
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.900',
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      '*': {
        scrollBehavior: 'smooth',
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default theme;