import React from 'react';
import { Container, Box, Avatar, Typography, Button } from '@mui/material';

const MyProfilePage: React.FC = () => {
  
  const firstName = 'John';
  const lastName = 'Doe';
  const email = 'john.doe@example.com';
  const profilePictureUrl: string | null = null;

  return (
    <Container
      maxWidth="sm"
      sx={{
        my: 10,
        p: 13,
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

        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={3}>
          <Button variant="contained" size="medium">
            Update Profile
          </Button>
          <Button variant="contained" size="medium">
            Change Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default MyProfilePage;
