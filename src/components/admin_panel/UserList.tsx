import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import type { UserDTO } from '../../types/User';
import UserRow from './UserRow';
import { buttonStyle } from '../../styles/CommonStyles';

export interface UserListProps {
  users: UserDTO[];
  onDelete: (id: number) => void;
}

export default function UserList({ users, onDelete }: UserListProps) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  if (isSm) {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        {users.map((user) => (
          <Paper
            key={user.id}
            elevation={1}
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography variant="body1" noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" noWrap sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
                {user.email}
              </Typography>
            </Box>

            <Button
              sx={{ ...buttonStyle, py: 0.5, px: 1, minWidth: 'auto' }}
              size="small"
              onClick={() => onDelete(user.id)}
            >
              Delete
            </Button>
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer
      component={Box}
      sx={{
        width: '100%',
        overflowX: 'auto',
        boxShadow: 1,
        borderRadius: 1,
      }}
    >
      <Table
        size="medium"
        sx={{
          width: '100%',
          tableLayout: 'fixed',
          minWidth: 0,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '40%' }}>Name</TableCell>
            <TableCell sx={{ width: '40%' }}>Email</TableCell>
            <TableCell sx={{ width: '20%', textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onDelete={() => onDelete(user.id)} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
