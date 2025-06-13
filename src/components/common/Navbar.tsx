import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EventIcon from '@mui/icons-material/Event';
import { avatarStyle, linkStyle } from '../../styles/CommonStyles';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary' }}>
      <Toolbar>
        <Link to="/" style={linkStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={avatarStyle}>
              <EventIcon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              SimpleEvent
            </Typography>
          </Box>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
