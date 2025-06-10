import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import type { User } from '../../types/User'
import UserRow from './UserRow'

export interface UserListProps {
  users: User[]
  onDelete: (id: number) => void
}

export default function UserList({ users, onDelete }: UserListProps) {
  if (!Array.isArray(users)) return null

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(user => (
          <UserRow key={user.id} user={user} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  )
}
