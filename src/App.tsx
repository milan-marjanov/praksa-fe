import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './pages/user/LoginPage';
import AdminHomePage from './pages/user/AdminHomePage';
import Navbar from './components/common/Navbar';
import theme from './theme';
import ProtectedRoute from './components/common/ProtectedRoute';
import UnauthorizedPage from './pages/user/UnauthorizedPage';
import EventsPage from './pages/events/EventsPage';
import MyProfilePage from './pages/user/MyProfilePage';
import ProfilePage from './pages/user/ProfilePage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import { EventFormProvider } from './contexts/EventContext';
import Notifications from './pages/notifications/NotificationPage';
import { useNotificationContext } from './contexts/NotificationContext';
import { useEffect, useState } from 'react';
import { createNotificationClient } from './notificationSocket';
import { jwtDecode } from 'jwt-decode';
import { JwtDecoded } from './types/User';

export default function App() {
  const { setNotifications, setUnreadCount } = useNotificationContext();
  const [id, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    const { id } = jwtDecode<JwtDecoded>(token);
    setUserId(id);

    const client = createNotificationClient(id, (newNotification) => {
      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        setUnreadCount(updated.filter((n) => !n.isRead).length);

        return updated;
      });
    });
    return () => {
      client.deactivate();
    };
  }, [id]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/myprofile"
              element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:userId"
              element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createdEvents"
              element={
                <EventFormProvider>
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <EventsPage />
                  </ProtectedRoute>
                </EventFormProvider>
              }
            />
            <Route
              path="/eventDetails/:id"
              element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <EventDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
