import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './pages/LoginPage';
import AdminHomePage from './pages/AdminHomePage';
import Navbar from './components/common/Navbar';
import theme from './theme';

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
            <Route path="/admin" element={<AdminHomePage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
