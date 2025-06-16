import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, decodeJwt } from '../../services/authService';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { buttonStyle } from '../../styles/style';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const token = await login(email, password);
      if (!token) {
        setError('Login failed. Please try again.');
        return;
      }

      const decoded = await decodeJwt(token);
      if (!decoded) {
        setError('Failed to decode token.');
        return;
      }

      if (decoded.role === 'USER') {
        navigate('/home');
      } else if (decoded.role === 'ADMIN') {
        navigate('/admin');
      } else {
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
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={Boolean(error)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={Boolean(error)}
      />
      {error && (
        <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ ...buttonStyle, padding: '5px 10px', fontSize: '1rem', fontWeight: 'bold', mt: 2 }}
      >
        Log in
      </Button>
    </Box>
  );
}
