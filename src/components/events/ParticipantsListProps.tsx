import { Box, Typography, Avatar } from '@mui/material';
import { ParticipantProfileDto } from '../../types/User';
import { participantsStyle } from '../../styles/CommonStyles';

interface ParticipantsListProps {
  participants: ParticipantProfileDto[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  if (!participants || participants.length === 0) {
    return <Typography>There are no participants</Typography>;
  }

  return (
    <Box>
      <Typography sx={participantsStyle}>Participants:</Typography>

      {participants.map((p) => (
        <Box
          key={p.id}
          onClick={() => (window.location.href = `/user/${p.id}`)}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto 1fr',
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid #ddd',
            cursor: 'pointer',
          }}
        >
          <Avatar
            src={p.profilePictureUrl || undefined}
            alt={`${p.firstName} ${p.lastName}`}
            sx={{
              gridColumn: 2,
              width: 35,
              height: 35,
            }}
          >
            {p.firstName[0]}
            {p.lastName[0]}
          </Avatar>

          <Typography
            variant="body1"
            sx={{
              gridColumn: 3,
              ml: 1,
            }}
          >
            {p.firstName} {p.lastName}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
