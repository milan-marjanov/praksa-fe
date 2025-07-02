import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton } from '@mui/material';
import { ParticipantProfileDto } from '../../../types/User';
import { useNavigate } from 'react-router-dom';

interface VoteListProps {
  open: boolean;
  onClose: () => void;
  title: string;
  users: ParticipantProfileDto[];
}

export default function VoteList({ open, onClose, title, users }: VoteListProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <List>
          {users.map(u => (
            <ListItem key={u.id} disablePadding>
              <ListItemButton onClick={() => navigate(`/user/${u.id}`)}>  
                <ListItemAvatar>
                  <Avatar src={u.profilePictureUrl || undefined}>
                    {!u.profilePictureUrl && `${u.firstName[0]}${u.lastName[0]}`}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${u.firstName} ${u.lastName}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
