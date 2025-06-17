import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#7FBC09' },
    secondary: { main: '#95C11F' },
    background: { default: '#f5f5dc' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h5: { fontWeight: 400, letterSpacing: '0.5px' },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      color: '#95C11F',
      fontSize: '1rem',
      padding: '8px 20px',
      borderRadius: 1,
    },
  },
});

export default theme;
