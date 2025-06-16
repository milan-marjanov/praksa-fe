import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Avatar, Typography, Button, CircularProgress } from '@mui/material';
import useProfile from '../hooks/useProfile';
import { buttonStyle } from '../styles/style';

const defaultAvatar = '/default-avatar.png';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const id = Number(userId);
  const navigate = useNavigate();
  const { data, loading, error } = useProfile(id);

  const [avatarSrc, setAvatarSrc] = useState<string>(defaultAvatar);

  useEffect(() => {
    if (!data) return;
    if (data.profilePictureUrl) {
      // formiramo pun URL do fajla koji stoji u /images na backendu
      setAvatarSrc(`${import.meta.env.VITE_API_BASE_URL}/images/${data.profilePictureUrl}`);
    } else {
      setAvatarSrc(defaultAvatar);
    }
  }, [data]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !data) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>
          Greška prilikom učitavanja profila.
        </Typography>
        <Button sx={buttonStyle} onClick={() => navigate(-1)}>
          Nazad
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ my: 10, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Avatar
          src={avatarSrc}
          alt={`${data.firstName} ${data.lastName}`}
          sx={{ width: 120, height: 120 }}
        />
        <Typography variant="h5">
          {data.firstName} {data.lastName}
        </Typography>
        <Button variant="contained" sx={buttonStyle} onClick={() => navigate(-1)}>
          Nazad na listu
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
