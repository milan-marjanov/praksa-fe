import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#7FBC09' },
    secondary: { main: '#0E2930' },
    background: { default: '#f0f2f5' },
  },
  shape: { borderRadius: 12 },
  typography: {
    h5: { fontWeight: 400, letterSpacing: '0.5px' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
})

export default theme