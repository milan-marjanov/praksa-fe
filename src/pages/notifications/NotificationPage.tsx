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
import React, { useEffect, useState } from 'react';
import { getUserNotifications } from '../../services/userService';
import { NotificationDto } from '../../types/Notification';

const notifications = [
  {
    eventId: 1,
    title: 'New Message Received',
    description: 'You have received a new message from John.',
    createdAt: '2025-06-15T10:20:30Z',
    isRead: true,
  },
  {
    eventId: 2,
    title: 'System Update',
    description: 'System will be updated tonight at 12 AM.',
    createdAt: '2025-06-14T23:00:00Z',
    isRead: false,
  },
  {
    eventId: 3,
    title: 'Meeting Reminder',
    description: "Don't forget the team meeting tomorrow at 10 AM.",
    createdAt: '2025-06-16T08:00:00Z',
    isRead: true,
  },
  {
    eventId: 4,
    title: 'Password Expiry',
    description: 'Your password will expire in 5 days.',
    createdAt: '2025-06-10T09:15:00Z',
    isRead: false,
  },
  {
    eventId: 5,
    title: 'New Comment',
    description: 'Anna commented on your post.',
    createdAt: '2025-06-15T14:45:00Z',
    isRead: true,
  },
  {
    eventId: 6,
    title: 'Subscription Expired',
    description: 'Your subscription expired yesterday.',
    createdAt: '2025-06-13T12:30:00Z',
    isRead: false,
  },
  {
    eventId: 7,
    title: 'Friend Request',
    description: 'Mike sent you a friend request.',
    createdAt: '2025-06-16T09:00:00Z',
    isRead: true,
  },
  {
    eventId: 8,
    title: 'Server Downtime',
    description: 'Server will be down for maintenance at midnight.',
    createdAt: '2025-06-14T22:00:00Z',
    isRead: false,
  },
  {
    eventId: 9,
    title: 'New Feature',
    description: 'Check out the new feature added to your dashboard.',
    createdAt: '2025-06-12T10:00:00Z',
    isRead: true,
  },
  {
    eventId: 10,
    title: 'Weekly Report',
    description: 'Your weekly report is ready for download.',
    createdAt: '2025-06-11T17:00:00Z',
    isRead: false,
  },
  {
    eventId: 11,
    title: 'Weekly Report',
    description: 'Your weekly report is ready for download.',
    createdAt: '2025-06-11T17:00:00Z',
    isRead: false,
  },
  {
    eventId: 12,
    title: 'Weekly Report',
    description: 'Your weekly report is ready for download.',
    createdAt: '2025-06-11T17:00:00Z',
    isRead: false,
  },
  {
    eventId: 13,
    title: 'Weekly Report',
    description: 'Your weekly report is ready for download.',
    createdAt: '2025-06-11T17:00:00Z',
    isRead: false,
  },
  {
    eventId: 14,
    title: 'Weekly Report',
    description: 'Your weekly report is ready for download.',
    createdAt: '2025-06-11T17:00:00Z',
    isRead: false,
  },
  {
    eventId: 15,
    title: 'Weekly Report',
    description: 'Your weekly report is ready for download.',
    createdAt: '2025-06-11T17:00:00Z',
    isRead: false,
  },
  {
    eventId: 16,
    title: 'Weekly Report',
    description: 'Your weekly report is ready for download.',
    createdAt: '2025-06-11T17:00:00Z',
    isRead: false,
  },
];

export default function Notifications() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const data = await getUserNotifications();
  //       setNotifications(data);
  //     } catch (err) {
  //       setError('Error.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);

  // if (loading) return <p>Loading.....</p>;
  // if (error) return <p>{error}</p>;

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
              <TableRow key={notif.eventId + notif.createdAt}>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem' }}>{notif.title}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem' }}>{notif.description}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem' }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '1rem', verticalAlign: 'middle', py: isMobile ? 0.5 : 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={notif.isRead ? 'Read' : 'Unread'}
                      color={notif.isRead ? 'default' : 'success' }
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ minWidth: '70px', justifyContent: 'center' }}
                      onClick={() => {
                        if (!notif.isRead) {
                          console.log('notif.open:', notif.isRead);
                          console.log('notif.open:', notif.isRead, 'eventId', notif.eventId);
                        }
                      }}
                    />
                    <IconButton
                      aria-label="delete"
                      size={isMobile ? 'small' : 'medium'}
                      onClick={() => console.log('Trash',notif.eventId)}
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