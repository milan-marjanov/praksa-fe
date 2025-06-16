import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Avatar, Typography, Button, CircularProgress } from '@mui/material';
import useProfile from '../hooks/useProfile';
import { buttonStyle } from '../styles/style';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const id = Number(userId);
  const { data, loading, error } = useProfile(id);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !data) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography color="error">Greška prilikom učitavanja profila.</Typography>
        <Button sx={buttonStyle} onClick={() => navigate(-1)}>
          Nazad
        </Button>
      </Container>
    );
  }

  const { firstName, lastName, profilePictureUrl } = data as any;

  return (
    <Container
      maxWidth="sm"
      sx={{
        my: 10,
        p: 4,
        backgroundColor: 'background.default',
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Avatar
          src={profilePictureUrl || undefined}
          alt={`${firstName} ${lastName}`}
          sx={{ width: 120, height: 120 }}
        />
        <Typography variant="h5">
          {firstName} {lastName}
        </Typography>
        <Button sx={buttonStyle} onClick={() => navigate(-1)}>
          Nazad
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
