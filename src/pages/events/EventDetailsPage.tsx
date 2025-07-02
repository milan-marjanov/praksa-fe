import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { EventDetailsProvider, useEventDetailsContext } from '../../contexts/EventDetailsContext';
import ParticipantsList from '../../components/events/details/ParticipantsListProps';
import EventHeader from '../../components/events/details/EventHeader';
import EventDescription from '../../components/events/details/EventDescription';
import TimeVotingPanel from '../../components/events/details/TimeVotingPanel';
import RestaurantVotingPanel from '../../components/events/details/RestaurantVotingPanel';
import { pageContainer } from '../../styles/CommonStyles';

function EventDetailsContent() {
  const { event, loading, error } = useEventDetailsContext();

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!event) return <Typography>No event data</Typography>;

  const hasRestaurant = event.restaurantOptionType !== 'NONE';

  return (
    <Box sx={pageContainer}>
      <EventHeader />

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        <Box flex={2} display="flex" flexDirection="column" gap={3}>
          <EventDescription />
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={3}
            alignItems="stretch"
          >
            <Box
              flex={hasRestaurant ? 1 : 2}
              display="flex"
              flexDirection="column"
              sx={{ height: '100%' }}
            >
              <TimeVotingPanel />
            </Box>

            {hasRestaurant && (
              <Box flex={1} display="flex" flexDirection="column" sx={{ height: '100%' }}>
                <RestaurantVotingPanel />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            flex: 0.8,
            height: { md: 'calc(40vh + 35vh + 25px)' },
            overflowY: 'auto',
          }}
        >
          <ParticipantsList participants={event.participants} />
        </Box>
      </Box>
    </Box>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = id ? Number(id) : null;

  return (
    <EventDetailsProvider eventId={eventId}>
      <EventDetailsContent />
    </EventDetailsProvider>
  );
}
