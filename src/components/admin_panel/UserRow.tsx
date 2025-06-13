import { TableRow, TableCell, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import type { UserDTO } from '../../types/User';
import buttonStyle from '../../styles/buttonStyle';

export interface UserRowProps {
  user: UserDTO;
  onDelete: () => void;
}

export default function UserRow({ user, onDelete }: UserRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Link
          to={`/user/${user.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {user.firstName} {user.lastName}
        </Link>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell align="right">
        <Button sx={buttonStyle} onClick={onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
}
