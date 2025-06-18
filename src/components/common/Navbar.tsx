import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import MenuIcon from '@mui/icons-material/Menu';
import { avatarStyle } from '../../styles/CommonStyles';

export default function Navbar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const token = localStorage.getItem('jwtToken');
  const isLoggedIn = Boolean(token);

  let isAdmin = false;
  if (token) {
    try {
      const parts = token.split('.');
      const decodedJson = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      isAdmin = decodedJson.role === 'ADMIN';
    } catch {
      console.log('No jwtToken found.');
    }
  }

  const navItems = [
    ...(isAdmin ? [{ text: 'Admin Panel', to: '/admin' }] : []),
    { text: 'Events', to: '/createdEvents' },
    { text: 'Profile', to: '/myprofile' },
    { text: 'Logout', to: '/logout' },
  ];

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  const handleNavClick = (to: string) => {
    setOpen(false);
    if (to === '/logout') {
      localStorage.removeItem('jwtToken');
      window.location.replace('/login');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const linkStyle = (path: string) => ({
    textTransform: 'none',
    color: location.pathname === path ? 'black' : 'inherit',
    borderBottom: location.pathname === path ? '2px solid black' : 'none',
    borderRadius: 0,
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    '&:hover': {
      borderBottom: '2px solid black',
      color: 'black',
    },
  });

  return (
    <Box sx={{ position: 'relative' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar
          sx={{
            justifyContent: isSm ? 'flex-end' : 'space-between',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              ...(isSm && {
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }),
            }}
          >
            <Avatar sx={avatarStyle}>
              <EventIcon />
            </Avatar>

            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', color: 'black' }}>
              SimpleEvent
            </Typography>
          </Box>

          {!isSm && isLoggedIn && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {navItems.map(({ text, to }) =>
                to === '/logout' ? (
                  <Button
                    key={to}
                    onClick={() => handleNavClick(to)}
                    sx={{
                      textTransform: 'none',
                      color: 'black',
                      fontWeight: 'normal',
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button key={to} component={RouterLink} to={to} sx={linkStyle(to)}>
                    {text}
                  </Button>
                ),
              )}
            </Box>
          )}

          {isSm && isLoggedIn && (
            <IconButton color="inherit" onClick={toggleOpen}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {isSm && isLoggedIn && open && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            bgcolor: theme.palette.background.default,
            boxShadow: theme.shadows[4],
            zIndex: theme.zIndex.appBar,
          }}
        >
          <List disablePadding>
            {navItems.map(({ text, to }) => (
              <ListItemButton
                key={to}
                component={to !== '/logout' ? RouterLink : 'div'}
                to={to !== '/logout' ? to : undefined}
                onClick={() => handleNavClick(to)}
                selected={location.pathname === to}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  px: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    variant: 'subtitle1',
                    fontWeight: location.pathname === to ? 'bold' : 'normal',
                    color: location.pathname === to ? 'text.primary' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
