import { Box, Typography, Avatar } from '@mui/material'
import { ParticipantProfileDto } from '../../../types/User'
import { eventDetailstHeaderStyle, eventTitleStyle, panelBox } from '../../../styles/CommonStyles'
import { useNavigate } from 'react-router-dom';

interface ParticipantsListProps {
  participants: ParticipantProfileDto[]
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ ...panelBox, p: 0, height: '100%', overflowY: 'auto' }}>
      <Box sx={eventDetailstHeaderStyle}>
        <Typography variant="h6" sx={eventTitleStyle}>
          Participants
        </Typography>
      </Box>
      <Box sx={{ my: 1 }}>
        {participants.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            There are no participants.
          </Typography>
        ) : (
          participants.map((participant) => (
            <Box
              key={participant.id}
              onClick={() => navigate(`/user/${participant.id}`)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                alignItems: 'center',
                columnGap: { xs: 3, sm: 2 },
                py: 1,
                pl: { xs: 2, sm: 3 }, 
                pr: 2,
                borderBottom: '1px solid #ddd',
                cursor: 'pointer',
              }}
            >
              <Avatar
                alt={`${participant.firstName} ${participant.lastName}`}
                src={participant.profilePictureUrl ?? ''}
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
                {participant.firstName} {participant.lastName}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
