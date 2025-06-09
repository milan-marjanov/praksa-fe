import { Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import EventIcon from '@mui/icons-material/Event';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginForm from '../component/LoginForm';

export default function LoginPage() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ bgcolor: '#95C11F' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'inherit',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Avatar sx={{ m: 1, bgcolor: '#4B570E' }}>
                <EventIcon />
              </Avatar>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                SimpleEventApp
              </Typography>
            </Box>
          </Link>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#4B570E' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>

          <LoginForm />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
