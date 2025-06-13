import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#385170', // Deep blue
      light: '#9fd3c7', // Light teal
      dark: '#142d4c', // Dark blue
    },
    secondary: {
      main: '#9fd3c7', // Light teal
      light: '#ececec', // Light gray
      dark: '#385170', // Deep blue
    },
    background: {
      default: '#ececec', // Light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#142d4c', // Dark blue
      secondary: '#385170', // Deep blue
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Nunito Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#142d4c',
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      color: '#142d4c',
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 700,
      color: '#142d4c',
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      color: '#142d4c',
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      color: '#142d4c',
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      color: '#142d4c',
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      color: '#385170',
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      color: '#385170',
      fontSize: '0.875rem',
    },
    body1: {
      fontWeight: 400,
      color: '#142d4c',
      fontSize: '1rem',
    },
    body2: {
      fontWeight: 400,
      color: '#385170',
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#142d4c',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme; 