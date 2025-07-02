import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  useTheme,
  Box,
  useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { getUserNotifications, markNotificationAsRead, deleteNotification } from '../../services/userService';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notifications, setNotifications, setUnreadCount } = useNotificationContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      try {
        const data = await getUserNotifications();
        setNotifications(data);
      } catch (err) {
        setError('Failed to fetch or subscribe.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSubscribe();
  }, []);

  if (loading) return <p>Loading.....</p>;
  if (error) return <p>{error}</p>;

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Notifications
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>Title</TableCell>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>Description</TableCell>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>Date</TableCell>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notif) => (
              <TableRow sx={{
                bgcolor: notif.isRead ? '#ffffff' : '#f0f0f0', cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' }
              }}
                key={notif.eventId + notif.createdAt}
                onClick={() => navigate(`/eventDetails/${notif.eventId}`)}
              >
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem', fontWeight: notif.isRead ? 'normal' : 'bold' }}>{notif.title}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem', fontWeight: notif.isRead ? 'normal' : 'bold' }}>{notif.text}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem', fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem', verticalAlign: 'middle', py: isMobile ? 0.5 : 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Chip
                      label={notif.isRead ? 'Read' : 'Unread'}
                      color={notif.isRead ? 'default' : 'success'}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ minWidth: '70px', justifyContent: 'center' }}
                      onClick={() => {
                        if (!notif.isRead) {
                          handleMarkAsRead(notif.id)
                        }
                      }}
                    />
                    <IconButton
                      aria-label="delete"
                      size={isMobile ? 'small' : 'medium'}
                      onClick={() => handleDelete(notif.id)}
                      sx={{ ml: notif.isRead ? '3px' : '4px' }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}