import { Box, Typography } from '@mui/material';
import { ParticipantProfileDto } from '../../types/User';
import { participantStyle } from '../../styles/CommonStyles';
import { useNavigate } from 'react-router-dom';

interface ParticipantsListProps {
  participants: ParticipantProfileDto[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {

  const navigate = useNavigate();

  if (!participants || participants.length === 0) {
    return <Typography>There are no participants</Typography>;
  }

  return (
    <Box>
      <Typography sx={participantStyle}>Participants:</Typography>
      {participants.map((p, index) => (
        <Box
          key={index}
          sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1, cursor: 'pointer' }}
          onClick={() => navigate(`/user/${p.id}`)}
        >
          <Typography>
            {p.firstName} {p.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {p.email}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}