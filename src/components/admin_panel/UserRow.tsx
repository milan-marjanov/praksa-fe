import { TableRow, TableCell, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import type { UserDTO } from '../../types/User';
import { buttonStyle } from '../../styles/CommonStyles';

export interface UserRowProps {
  user: UserDTO;
  onDelete: () => void;
}

export default function UserRow({ user, onDelete }: UserRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Link to={`/user/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {user.firstName} {user.lastName}
        </Link>
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {user.email}
      </TableCell>
      <TableCell align="center">
        <Box display="inline-flex" gap={1}>
          <Button sx={buttonStyle} onClick={onDelete}>
            Delete
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}
