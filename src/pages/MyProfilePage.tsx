import React, { useState } from 'react';
import { Container, Box, Avatar, Typography, Button, IconButton } from '@mui/material';
import { UpdateProfileModal } from '../components/profile/UpdateProfileModal';
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal';
import { ChangePfpModal } from '../components/profile/ChangePfpModal';
import { PasswordChangeRequestDTO, ChangeProfilePictureDTO } from '../types/User';
import { changePassword, uploadProfilePicture } from '../services/userService';
import { getCurrentUserId } from '../services/authService';
import buttonStyle from '../styles/buttonStyle';

const MyProfilePage: React.FC = () => {
  const [firstName] = useState('Stefan');
  const [lastName] = useState('Nemanja');
  const [email] = useState('stefan.nemanja@example.com');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openChangePwd, setOpenChangePwd] = useState(false);
  const [openChangePfp, setOpenChangePfp] = useState(false);

  const id = getCurrentUserId();

  const handleUpdate = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: File;
  }) => {
    console.log('Payload za update:', data);
    setOpenUpdate(false);
  };

  const handleChangePassword = async (dto: PasswordChangeRequestDTO) => {
    await changePassword(id, dto);
    setOpenChangePwd(false);
  };

  const handleUploadPfp = async (file: File) => {
    const dto: ChangeProfilePictureDTO = { profilePicture: file };
    const url = await uploadProfilePicture(id, dto);
    setProfilePictureUrl(url);
    setOpenChangePfp(false);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: '90vw',
        maxWidth: 600,
        mx: 'auto',
        my: 10,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-evenly"
        minHeight="60vh"
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <IconButton onClick={() => setOpenChangePfp(true)} sx={{ p: 0 }}>
            <Avatar
              src={profilePictureUrl || undefined}
              alt={`${firstName} ${lastName}`}
              sx={{ width: 120, height: 120, marginBottom: 4 }}
            />
          </IconButton>

          <Typography variant="h5" textAlign="center">
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            {email}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" sx={buttonStyle} onClick={() => setOpenUpdate(true)}>
            Update Profile
          </Button>
          <Button variant="contained" sx={buttonStyle} onClick={() => setOpenChangePwd(true)}>
            Change Password
          </Button>
        </Box>
      </Box>

      <UpdateProfileModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onUpdate={handleUpdate}
      />
      <ChangePasswordModal
        open={openChangePwd}
        onClose={() => setOpenChangePwd(false)}
        onChangePassword={handleChangePassword}
      />
      <ChangePfpModal
        open={openChangePfp}
        onClose={() => setOpenChangePfp(false)}
        onUpload={handleUploadPfp}
      />
    </Container>
  );
};

export default MyProfilePage;
