import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import UserList from '../components/admin_panel/UserList';
import AddUserModal from '../components/admin_panel/AddUserModal';
import ConfirmDialog from '../components/admin_panel/ConfirmDialog';
import type { UserDTO, CreateUserDTO, MyProfileDTO } from '../types/User';
import { getAllUsers, createUser, deleteUser, getMyProfile } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { buttonStyle } from '../styles/CommonStyles';
import { toast } from 'react-toastify';

export default function AdminHomePage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = (await getMyProfile()) as MyProfileDTO;
        setAdminFirstName(profile.firstName);
        setAdminLastName(profile.lastName);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  const handleAdd = async (u: CreateUserDTO) => {
    try {
      const created = await createUser(u);
      setUsers((prev) => [...prev, created]);
      toast.success('User created successfully');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Email already in use.';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const initials =
    (adminFirstName.charAt(0) || '').toUpperCase() + (adminLastName.charAt(0) || '').toUpperCase();

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
        pb: { xs: 6, md: 8 },
      }}
    >
      <Typography variant={isSm ? 'h5' : 'h4'} align="center" sx={{ my: { xs: 3, md: 5 } }}>
        Admin Panel
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            {initials || 'A'}
          </Avatar>
          <Typography variant="subtitle1">
            {adminFirstName} {adminLastName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={buttonStyle}
          size={isSm ? 'medium' : 'large'}
          onClick={() => setAddOpen(true)}
        >
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <UserList users={users} onDelete={(id) => setDeleteId(id)} />
        </Box>
      )}

      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <ConfirmDialog
        open={deleteId !== null}
        title="Confirm Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId!)}
      >
        Are you sure you want to delete this user?
      </ConfirmDialog>

      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 32 },
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Button
          variant="contained"
          size={isSm ? 'medium' : 'large'}
          sx={buttonStyle}
          onClick={() => navigate('/myprofile')}
        >
          My Profile
        </Button>
      </Box>
    </Container>
  );
}
