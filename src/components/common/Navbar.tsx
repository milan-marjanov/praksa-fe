import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EventIcon from '@mui/icons-material/Event';

export default function Navbar() {
  return (
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
              SimpleEvent
            </Typography>
          </Box>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
