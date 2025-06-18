import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventDetails } from '../../services/eventService';
import { EventDetailsDto } from '../../types/Event';
import { Typography, Box } from '@mui/material';
import ParticipantsList from '../../components/events/ParticipantsListProps';
import {
  eventContainerStyle,
  eventBoxStyle,
  eventHeaderStyle,
  eventTitleCenterStyle,
  eventBodyStyle,
  leftBoxStyle,
  rightBoxStyle,
  sectionLabelStyle,
  descriptionBoxStyle,
} from '../../styles/CommonStyles';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsDto | null>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await getEventDetails(parseInt(id));
          setEvent(data);
          console.log(data)
        } catch (error) {
          console.error('Error loading event:', error);
        }
      })();
    }
  }, [id]);

  if (!event) return <Typography className="loading-text">Učitavanje detalja...</Typography>;

 return (
   <Box sx={eventContainerStyle}>
  <Box sx={eventBoxStyle}>
    <Box sx={eventHeaderStyle}>
      <Typography sx={eventTitleCenterStyle}>{event.title}</Typography>
    </Box>

    <Box sx={eventBodyStyle}>
      <Box sx={leftBoxStyle}>
        <Typography sx={sectionLabelStyle}>Description</Typography>
        <Box sx={descriptionBoxStyle}>
          <Typography>{event.description}</Typography>
        </Box>
      </Box>

      <Box sx={rightBoxStyle}>
        <ParticipantsList participants={event.participants} />
      </Box>
    </Box>
  </Box>
</Box>
  );
}
