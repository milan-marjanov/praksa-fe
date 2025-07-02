import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { jwtDecode } from 'jwt-decode';
import { JwtDecoded } from '../../types/User';
import { buttonStyle } from '../../styles/CommonStyles';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false });

  const {setUserId} = useAuth();

  const navigate = useNavigate();

  const validate = (email: string, password: string) => {
    const newErrors = {
      email: email.trim() === '',
      password: password.trim() === '',
    };

    const hasError = newErrors.email || newErrors.password;
    return { hasError, newErrors };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const { hasError, newErrors } = validate(email, password);
    setErrors(newErrors);

    if (hasError) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const token = await login(email, password);
      if (!token) {
        setError('Login failed. Please try again.');
        return;
      }

      const decoded = jwtDecode<JwtDecoded>(token);

      setUserId(decoded.id);
      console.log("DECODED " + JSON.stringify(decoded));

      switch (decoded?.role) {
        case 'USER':
          navigate('/createdEvents');
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
        label="Email *"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <TextField
        margin="normal"
        fullWidth
        name="password"
        label="Password *"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
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
