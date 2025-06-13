import { Avatar, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import UserList from '../components/admin_panel/UserList';
import AddUserModal from '../components/admin_panel/AddUserModal';
import ConfirmDialog from '../components/admin_panel/ConfirmDialog';
import type { User } from '../types/UserDTO';
import type { CreateUserDTO } from '../types/CreateUserDTO';
import { getAllUsers, createUser, deleteUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';

export default function AdminHomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleAdd = async (u: CreateUserDTO) => {
    try {
      const created = await createUser(u);
      setUsers((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteUser(deleteId);
        setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ ml: 2, mt: 5 }}>
        Admin Panel
      </Typography>

      <Container sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>A</Avatar>
            <Typography variant="h6" sx={{ ml: 2, fontSize: '1.4rem' }}>
              Petar Subotić
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => setAddOpen(true)}
            sx={{ fontSize: '1rem' }}
          >
            Add User
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <UserList users={users} onDelete={(id) => setDeleteId(id)} />
        )}
      </Container>

      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <ConfirmDialog
        open={deleteId !== null}
        title="Confirm Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this user?
      </ConfirmDialog>

      <Button
        variant="contained"
        size="large"
        color="secondary"
        sx={{
          position: 'fixed',
          bottom: 50,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          fontSize: '1rem',
        }}
        onClick={() => navigate('/myprofile')}
      >
        My Profile
      </Button>
    </>
  );
}
