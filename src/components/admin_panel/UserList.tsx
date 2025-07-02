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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { UserDTO } from '../../types/User';
import UserRow from './UserRow';
import { buttonStyle } from '../../styles/CommonStyles';
import DeleteIcon from '@mui/icons-material/Delete';

export interface UserListProps {
  users: UserDTO[];
  onDelete: (id: number) => void;
}

export default function UserList({ users, onDelete }: UserListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
        No users found.
      </Typography>
    );
  }

  if (isMobile) {
    return (
      <Box>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton onClick={() => navigate(`/user/${user.id}`)}>
                <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={user.email} />
              </ListItemButton>
              <Button
                sx={{ ...buttonStyle, py: 0.5, px: 2, minWidth: 'auto' }}
                size="small"
                onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
              >
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
        </List>
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
        border: 1,
        borderColor: 'divider',
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
