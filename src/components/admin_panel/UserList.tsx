import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import type { User } from '../../types/User'

const initialUsers: User[] = [
  { id: 1, firstName: 'Ana', lastName: 'Ivić',    email: 'ana@example.com' },
  { id: 2, firstName: 'Marko', lastName: 'Markić', email: 'marko@example.com' },
]

export default function UsersList() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [toDeleteId, setToDeleteId] = useState<number | null>(null)

  const confirmDelete = () => {
    setUsers(us => us.filter(u => u.id !== toDeleteId))
    setToDeleteId(null)
  }

  return (
    <>
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
                <IconButton onClick={() => setToDeleteId(u.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={toDeleteId !== null}
        title="Confirm Delete"
        onCancel={() => setToDeleteId(null)}
        onConfirm={confirmDelete}
      >
        Are you sure you want to delete this user?
      </ConfirmDialog>
    </>
  )
}
