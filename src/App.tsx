import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './pages/LoginPage';
import AdminHomePage from './pages/AdminHomePage';
import Navbar from './components/common/Navbar';
import theme from './theme';
import ProtectedRoute from './components/common/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import UpdateEventPage from './pages/events/UpdateEventPage';
import CreateEventPage from './pages/events/CreateEventPage';
import CreatedEventsPage from './pages/events/CreatedEventsPage';
import HomePage from './pages/HomePage';
import MyProfilePage from './pages/MyProfilePage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import EventDetailsPage  from './pages/events/EventDetailsPage'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className="App">
        <AuthProvider>
          <Router>
            <Navbar />

            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<LoginPage />} />

              <Route
                path="/home"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/myprofile"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <MyProfilePage />
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
                path="/createEvent"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/updateEvent"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <UpdateEventPage />
                  </ProtectedRoute>
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


              <Route
                path="/createdEvents"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <CreatedEventsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}
