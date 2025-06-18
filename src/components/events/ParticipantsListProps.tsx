import { Box, Typography } from '@mui/material';
import { UserProfileDto } from '../../types/Event'; 
import {
participStyle
} from '../../styles/CommonStyles';
interface ParticipantsListProps {
  participants: UserProfileDto[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  if (!participants || participants.length === 0) {
    return <Typography>There are no participants</Typography>;
  }

  return (
    <Box>
      <Typography sx={participStyle}>Participants:</Typography>
      {participants.map((p, index) => (
        <Box key={index} sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1 }} onClick={() => window.location.href = `/user/${p.id}`}>
          <Typography >{p.firstName} {p.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">{p.email}</Typography>
        </Box>
      ))}
    </Box>
  );
}
