import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import type { UserDTO } from '../../types/User';
import UserRow from './UserRow';

export interface UserListProps {
  users: UserDTO[];
  onDelete: (id: number) => void;
}

export default function UserList({ users, onDelete }: UserListProps) {
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
        {users.map((user) => (
          <UserRow key={user.id} user={user} onDelete={() => onDelete(user.id)} />
        ))}
      </TableBody>
    </Table>
  );
}
