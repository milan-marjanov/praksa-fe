import {
  AppBar, Avatar, Box, Button, CircularProgress, Container,
  IconButton, Table, TableHead, TableRow, TableCell,
  TableBody, Toolbar, Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import AddUserModal from '../components/admin_panel/AddUserModal'
import ConfirmDialog from '../components/admin_panel/ConfirmDialog'
import type { User } from '../types/User'
import type { CreateUserDTO } from '../types/CreateUserDTO'
import { getAllUsers, createUser, deleteUser } from '../services/userService'

export default function AdminHomePage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (u: CreateUserDTO) => {
    await createUser(u)
    await load()
  }

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteUser(deleteId)
      setDeleteId(null)
      await load()
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
              A
            </Avatar>
            <Typography variant="h6" sx={{ ml: 2 }}>
              Petar Subotić
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.firstName} {u.lastName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => setDeleteId(u.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Container>

      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Confirm Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this user?
      </ConfirmDialog>
    </>
  )
}
