import { TableRow, TableCell, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { UserDTO } from '../../types/User';

interface UserRowProps {
  user: UserDTO;
  onDelete: (id: number) => void;
}

export default function UserRow({ user, onDelete }: UserRowProps) {
  return (
    <TableRow>
      <TableCell>
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => onDelete(user.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
