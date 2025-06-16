import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EventIcon from '@mui/icons-material/Event';
import { avatarStyle } from '../../styles/CommonStyles';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Box
          sx={{
            mr: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: 2,
          }}
        >
          <Button component={RouterLink} to="/createdEvents" color="inherit">
            Created Events
          </Button>

          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Avatar sx={avatarStyle}>
              <EventIcon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black' }}>
              SimpleEvent
            </Typography>
          </Box>

          <Button component={RouterLink} to="/myprofile" color="inherit">
            My Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
