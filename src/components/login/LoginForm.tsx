import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { jwtDecode } from 'jwt-decode';
import { JwtDecoded } from '../../types/JwtDecoded';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginButtonStyle = {
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '1rem',
    fontWeight: 'bold',
    mt: 2,
    mb: 2,
    backgroundColor: '#95C11F',
    '&:hover': {
      backgroundColor: '#7A9717',
    },
  };

  const validateForm = (email: string, password: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = await login(email, password);
      if (!token) {
        setError('Login failed. Please try again.');
        return;
      }

      const decoded = jwtDecode<JwtDecoded>(token);
      if (!decoded) {
        setError('Failed to decode token.');
        return;
      }

      switch (decoded.role) {
        case 'USER':
          navigate('/userHomepage');
          break;
        case 'ADMIN':
          navigate('/admin');
          break;
        default:
          setError('Unauthorized role.');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        fullWidth
        label="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={Boolean(error)}
      />
      <TextField
        margin="normal"
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={Boolean(error)}
      />
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" fullWidth variant="contained" sx={loginButtonStyle}>
        Log in
      </Button>
    </Box>
  );
}
