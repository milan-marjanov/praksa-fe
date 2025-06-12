import React, { useState } from 'react';
import { Container, Box, Avatar, Typography, Button } from '@mui/material';
import { UpdateProfileModal } from '../components/profile/UpdateProfileModal';

const MyProfilePage: React.FC = () => {
  const firstName = 'John';
  const lastName = 'Doe';
  const email = 'john.doe@example.com';
  const profilePictureUrl: string | null = null;

  const [openUpdate, setOpenUpdate] = useState(false);

  const handleUpdate = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: File;
  }) => {
    console.log('Payload za update:', data);
    setOpenUpdate(false);
  };

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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Avatar
            src={profilePictureUrl || undefined}
            alt={`${firstName} ${lastName}`}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h5">
            {firstName} {lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {email}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
          <Button variant="contained" size="medium" onClick={() => setOpenUpdate(true)}>
            Update Profile
          </Button>
          <Button variant="contained" size="medium">
            Change Password
          </Button>
        </Box>
      </Box>

      <UpdateProfileModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onUpdate={handleUpdate}
      />
    </Container>
  );
};

export default MyProfilePage;
