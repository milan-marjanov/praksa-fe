import { Avatar, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import UserList from '../components/admin_panel/UserList';
import AddUserModal from '../components/admin_panel/AddUserModal';
import ConfirmDialog from '../components/admin_panel/ConfirmDialog';
import type { UserDTO } from '../types/User';
import type { CreateUserDTO } from '../types/User';
import { getAllUsers, createUser, deleteUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import buttonStyle from '../styles/buttonStyle';

export default function AdminHomePage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
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
            sx={buttonStyle}
            size="large"
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
          <UserList users={users} onDelete={(id) => setDeleteId(id)} />
        )}
      </Container>

      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <ConfirmDialog
        open={deleteId !== null}
        title="Confirm Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId!)}
      >
        Are you sure you want to delete this user?
      </ConfirmDialog>

      <Button
        variant="contained"
        size="large"
        sx={{
          ...buttonStyle,
          position: 'fixed',
          bottom: 50,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={() => navigate('/myprofile')}
      >
        My Profile
      </Button>
    </>
  );
}
