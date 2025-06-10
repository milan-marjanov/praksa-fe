import { TableRow, TableCell, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { User } from '../../types/User'

interface UserRowProps {
  user: User
  onDelete: (id: number) => void
}

export default function UserRow({ user, onDelete }: UserRowProps) {
  return (
    <TableRow>
      <TableCell>{user.firstName} {user.lastName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => onDelete(user.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
