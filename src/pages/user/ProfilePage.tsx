import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Avatar, Typography, Button, CircularProgress } from '@mui/material';
import useProfile from '../../hooks/useProfile';
import { buttonStyle, cardForPublicProfile } from '../../styles/CommonStyles';

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
          Error.
        </Typography>
        <Button sx={buttonStyle} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={cardForPublicProfile}
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
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
