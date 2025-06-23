import { Box, Typography, Avatar } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { TimeOptionDto, TimeOptionType } from '../../types/Event';

interface Props {
  option: TimeOptionDto;
  optionType: TimeOptionType;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (id: number) => void;
  onViewVotes: (title: string, users: TimeOptionDto['votedUsers']) => void;
}

export default function TimeOptionItem({
  option,
  optionType,
  isSelected,
  disabled,
  onSelect,
  onViewVotes,
}: Props) {
  const voters = option.votedUsers;
  const displayVoters = voters.slice(0, 2);
  const remainingCount = voters.length - displayVoters.length;

  const title =
    optionType === 'CAPACITY_BASED'
      ? `Reservations for ${new Date(option.startTime).toLocaleString()}`
      : `Votes for ${new Date(option.startTime).toLocaleString()}`;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
      <ToggleButton
        value={option.id}
        selected={isSelected}
        disabled={disabled}
        onChange={() => !disabled && onSelect(option.id)}
        sx={{
          minWidth: 210,
          justifyContent: 'flex-start',
          textTransform: 'none',
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
        }}
      >
        {new Date(option.startTime).toLocaleString()}
      </ToggleButton>

      <Typography variant="body2" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
        {optionType === 'CAPACITY_BASED'
          ? `${option.reservedCount}/${option.maxCapacity}`
          : `Votes: ${option.votesCount}`}
      </Typography>

      {voters.length > 0 && (
        <Box
          sx={{ display: 'flex', alignItems: 'center', ml: 1, cursor: 'pointer' }}
          onClick={() => onViewVotes(title, voters)}
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
            <Typography variant="body2" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
              +{remainingCount}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
