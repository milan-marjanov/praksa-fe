import { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import UserList from '../components/admin_panel/UserList';
import AddUserModal from '../components/admin_panel/AddUserModal';
import ConfirmDialog from '../components/admin_panel/ConfirmDialog';
import type { UserDTO, CreateUserDTO, MyProfileDTO } from '../types/User';
import { getAllUsers, createUser, deleteUser, getMyProfile } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { buttonStyle } from '../styles/style';
import { toast } from 'react-toastify';

export default function AdminHomePage() {
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
        pb: { xs: 4, md: 6 },
      }}
    >
      <Typography variant="h4" align="center" sx={{ my: { xs: 3, md: 5 } }}>
        Admin Panel
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        mb={4}
        gap={{ xs: 2, md: 0 }}
      >
        <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            {initials || 'A'}
          </Avatar>
          <Typography variant="h6" sx={{ ml: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
            {adminFirstName} {adminLastName}
          </Typography>
        </Box>
        <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
          <Button
            variant="contained"
            sx={buttonStyle}
            size="large"
            onClick={() => setAddOpen(true)}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <UserList users={users} onDelete={(id) => setDeleteId(id)} />
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
          bottom: { xs: 20, md: 50 },
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Button
          variant="contained"
          size="large"
          sx={buttonStyle}
          onClick={() => navigate('/myprofile')}
        >
          My Profile
        </Button>
      </Box>
    </Container>
  );
}
