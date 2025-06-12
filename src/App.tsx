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
import HomePage from './pages/HomePage';
import MyProfilePage from './pages/MyProfilePage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Router>
          <Navbar />

          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/myprofile" element={<MyProfilePage/>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminHomePage />
                </ProtectedRoute>
              }
            />

            {/* <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <UserHomePage />
            </ProtectedRoute>
          }
        /> */}

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
