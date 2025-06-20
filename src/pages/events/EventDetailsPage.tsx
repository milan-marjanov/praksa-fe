import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { getEventDetails } from '../../services/eventService';
import { EventDetailsDto } from '../../types/Event';
import { useEvents } from '../../hooks/useEvents';
import ParticipantsList from '../../components/events/ParticipantsListProps';
import { buttonStyle } from '../../styles/CommonStyles';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useEvents();
  const [event, setEvent] = useState<EventDetailsDto | null>(null);

  const descHeight = {
    xs: 'auto',
    md: 'clamp(200px, 30vh, 400px)',
    lg: 'clamp(220px, 40vh, 450px)',
  };
  const optHeight = {
    xs: 'auto',
    md: 'clamp(200px, 25vh, 500px)',
    lg: 'clamp(220px, 22vh, 550px)',
  };
  const gapPx = '32px';
  const participantsHeight = {
    xs: 'auto',
    md: `calc(${descHeight.md} + ${optHeight.md} + ${gapPx})`,
    lg: `calc(${descHeight.lg} + ${optHeight.lg} + ${gapPx})`,
  };

  useEffect(() => {
    if (!id) return;
    getEventDetails(+id)
      .then(data => setEvent(data))
      .catch(err => console.error('Error loading event:', err));
  }, [id]);

  if (!event) {
    return <Typography>Učitavanje</Typography>;
  }

  const numericUserId = Number(userId);
  const isCreator = event.creator?.id === numericUserId;

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '95%', md: '90%', lg: '85%', xl: '75%' },
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ flex: 1 }} />

        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center' }}>
          {event.title}
        </Typography>

        {isCreator
          ? (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                sx={buttonStyle}
                size="medium"
                onClick={() => navigate('/updateEvent', { state: { event } })}
              >
                Edit
              </Button>
            </Box>
          )
          : <Box sx={{ flex: 1 }} />
        }
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 } }}>
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              height: descHeight,
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontSize: { xs: 18, md: 20 },
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'left',
                fontSize: { xs: '0.5rem', md: '1.1rem' },
                lineHeight: 1.6,
              }}
            >
              {event.description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              height: optHeight,
              overflow: 'auto',
            }}
          >
            <Box
              sx={{
                flex: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                overflowY: 'auto',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Time
              </Typography>
              {event.timeOptions.map(opt => (
                <Box key={opt.id} sx={{ mb: 1, fontSize: { xs: '0.95rem', md: '1.15rem' } }}>
                  {/* <TimeOptionItem option={opt} /> */}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                flex: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                overflowY: 'auto',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Restaurant
              </Typography>
              {event.restaurantOptions.map(opt => (
                <Box key={opt.id} sx={{ mb: 1, fontSize: { xs: '0.95rem', md: '1.15rem' } }}>
                  {/* <RestaurantOptionItem option={opt} /> */}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1, ml: { xs: 0, md: 4 } }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              pt: 1,
              height: participantsHeight,
              overflowY: 'auto',
            }}
          >
            <ParticipantsList participants={event.participants} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
