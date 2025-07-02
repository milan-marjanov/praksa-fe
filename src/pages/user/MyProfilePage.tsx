import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import useProfile from '../../hooks/useProfile';
import type {
  MyProfileDTO,
  PasswordChangeRequestDTO,
  UpdateProfileRequestDTO,
} from '../../types/User';
import { UpdateProfileModal } from '../../components/profile/UpdateProfileModal';
import { ChangePasswordModal } from '../../components/profile/ChangePasswordModal';
import { ChangePfpModal } from '../../components/profile/ChangePfpModal';
import { buttonStyle } from '../../styles/CommonStyles';
import {
  uploadProfilePicture,
  getProfileImage,
  updateProfile,
  changePassword,
  removeProfilePicture,
} from '../../services/userService';
import { toast } from 'react-toastify';

const defaultAvatar = 'https://example.com/default-profile.png';

type ModalType = 'update' | 'pwd' | 'pfp' | null;

const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem('jwtToken');
  return token ? JSON.parse(atob(token.split('.')[1])).id : null;
};

const MyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useProfile();
  const userId = getUserIdFromToken();

  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string | null;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    profilePictureUrl: null,
  });

  const [openModal, setOpenModal] = useState<ModalType>(null);

  useEffect(() => {
    if (data) {
      const { firstName, lastName, email } = data as MyProfileDTO;
      setProfile((p) => ({ ...p, firstName, lastName, email }));
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    let active = true;

    if (userId === null) {
      setProfile((p) => ({ ...p, profilePictureUrl: defaultAvatar }));
      return;
    }

    (async () => {
      try {
        const imageUrl = await getProfileImage(userId);
        if (active) {
          setProfile((p) => ({ ...p, profilePictureUrl: imageUrl || defaultAvatar }));
        } else {
          setProfile((p) => ({ ...p, profilePictureUrl: defaultAvatar }));
        }
      } catch {
        if (active) {
          setProfile((p) => ({ ...p, profilePictureUrl: defaultAvatar }));
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [data, userId]);

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
          Error loading profile.
        </Typography>
        <Button sx={buttonStyle} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );
  }

  const handleUpdate = async (form: UpdateProfileRequestDTO & { profilePicture?: File }) => {
    const oldEmail = profile.email;
    try {
      const updated: MyProfileDTO = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });
      setProfile((p) => ({
        ...p,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
      }));

      if (form.profilePicture && userId !== null) {
        await uploadProfilePicture({ profilePicture: form.profilePicture });
        const newUrl = await getProfileImage(userId);
        setProfile((p) => ({ ...p, profilePictureUrl: newUrl || p.profilePictureUrl }));
      }

      if (updated.email !== oldEmail) {
        localStorage.removeItem('jwtToken');
        navigate('/login', { replace: true });
        return;
      }
      setOpenModal(null);
    } catch (err) {
      console.error('Error updating profile', err);
      toast.error('Failed to update profile');
      setOpenModal(null);
    }
  };

  const handleChangePassword = async (dto: PasswordChangeRequestDTO) => {
    try {
      await changePassword(dto);
      localStorage.removeItem('jwtToken');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error changing password', err);
      toast.error('Failed to change password');
    }
  };

  const handleUploadPfp = async (file: File) => {
    if (userId === null) return;
    try {
      await uploadProfilePicture({ profilePicture: file });
      const newUrl = await getProfileImage(userId);
      setProfile((p) => ({ ...p, profilePictureUrl: newUrl || p.profilePictureUrl }));
    } catch (err) {
      console.error('Error uploading picture', err);
      toast.error('Failed to upload picture');
    } finally {
      setOpenModal(null);
    }
  };

  return (
    <Container
      disableGutters
      sx={{
        width: { xs: '70%', sm: 550 },
        mx: 'auto',
        my: 10,
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <IconButton onClick={() => setOpenModal('pfp')} sx={{ p: 0 }}>
          <Avatar
            src={profile.profilePictureUrl || defaultAvatar}
            sx={{ width: 120, height: 120 }}
          />
        </IconButton>
        <Typography variant="h5">
          {profile.firstName} {profile.lastName}
        </Typography>
        <Typography color="textSecondary">{profile.email}</Typography>
      </Box>

      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        <Button variant="contained" sx={buttonStyle} onClick={() => setOpenModal('update')}>
          Update Profile
        </Button>
        <Button variant="contained" sx={buttonStyle} onClick={() => setOpenModal('pwd')}>
          Change Password
        </Button>
      </Box>

      <UpdateProfileModal
        open={openModal === 'update'}
        onClose={() => setOpenModal(null)}
        onUpdate={handleUpdate}
        initialValues={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          avatarUrl: profile.profilePictureUrl || undefined,
        }}
      />

      <ChangePasswordModal
        open={openModal === 'pwd'}
        onClose={() => setOpenModal(null)}
        onChangePassword={handleChangePassword}
      />

      <ChangePfpModal
        open={openModal === 'pfp'}
        initialPreview={profile.profilePictureUrl || undefined}
        onClose={() => setOpenModal(null)}
        onUpload={handleUploadPfp}
        onRemove={async () => {
          await removeProfilePicture();
          setProfile((p) => ({ ...p, profilePictureUrl: null }));
        }}
      />
    </Container>
  );
};

export default MyProfilePage;
