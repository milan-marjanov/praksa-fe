import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { RestaurantOptionDto, RestaurantOptionType } from '../../types/Event';
import RestaurantInfoDialog from './RestaurantInfoDialog';

interface Props {
  option: RestaurantOptionDto;
  optionType: RestaurantOptionType;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export default function RestaurantOptionItem({ option, optionType, isSelected, onSelect }: Props) {
  const [votesOpen, setVotesOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const voters = option.votedUsers;
  const displayVoters = voters.slice(0, 2);
  const remainingCount = voters.length - displayVoters.length;

  const isVoting = optionType === 'VOTING';

  const isFixed = optionType === 'FIXED';


  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
        {isVoting && <Checkbox checked={isSelected} onChange={() => onSelect(option.id)} />}

        <Box
          onClick={() => setInfoOpen(true)}
          sx={{
            ml: isVoting ? 1 : 0,
            minWidth: 150,
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Typography variant="body1" sx={{ userSelect: 'none' }}>
            {option.name}
          </Typography>
          <IconButton size="small" sx={{ ml: 0.5 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
          Votes: {option.votesCount}
        </Typography>

        {voters.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => setVotesOpen(true)}
          >
            {displayVoters.map((u) => (
              <Avatar
                key={u.id}
                src={u.profilePictureUrl || undefined}
                alt={`${u.firstName} ${u.lastName}`}
                sx={{ width: 32, height: 32, mr: -1, border: '2px solid white' }}
              />
            ))}
            {remainingCount > 0 && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                +{remainingCount}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Dialog open={votesOpen} onClose={() => setVotesOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Votes for {option.name}</DialogTitle>
        <DialogContent dividers>
          <List>
            {voters.map((u) => (
              <ListItem key={u.id}>
                <ListItemAvatar>
                  <Avatar
                    src={u.profilePictureUrl || undefined}
                    alt={`${u.firstName} ${u.lastName}`}
                  />
                </ListItemAvatar>
                <ListItemText primary={`${u.firstName} ${u.lastName}`} secondary={u.email} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <RestaurantInfoDialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        restaurant={option}
      />
    </>
  );
}
