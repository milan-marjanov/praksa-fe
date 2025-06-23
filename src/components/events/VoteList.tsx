import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { ParticipantProfileDto } from '../../types/User';

interface VoteListProps {
  open: boolean;
  onClose: () => void;
  title: string;
  users: ParticipantProfileDto[];
}

export default function VoteList({ open, onClose, title, users }: VoteListProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <List>
          {users.map(u => (
            <ListItem key={u.id}>
              <ListItemAvatar>
                <Avatar src={u.profilePictureUrl || undefined} />
              </ListItemAvatar>
              <ListItemText primary={`${u.firstName} ${u.lastName}`} secondary={u.email} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
