import { Box, Typography, Avatar } from '@mui/material';
import { ParticipantProfileDto } from '../../types/User';
import { participantsStyle } from '../../styles/CommonStyles';

interface ParticipantsListProps {
  participants: ParticipantProfileDto[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Typography sx={participantsStyle}>Participants:</Typography>

      {participants.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          There are no participants.
        </Typography>
      ) : (
        participants.map((p) => (
          <Box
            key={p.id}
            onClick={() => (window.location.href = `/user/${p.id}`)}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'auto 1fr', sm: '80px 1fr' },
              alignItems: 'center',
              py: 1,
              pl: { xs: 3, sm: 4 },
              pr: 2,
              borderBottom: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            <Avatar
              alt={`${p.firstName} ${p.lastName}`}
              src={p.profilePictureUrl ?? ''}
              sx={{
                width: 40,
                height: 40,
                objectFit: 'cover',
              }}
            />

            <Typography
              variant="body1"
              sx={{
                textAlign: 'left',
                wordBreak: 'break-word',
              }}
            >
              {p.firstName} {p.lastName}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
