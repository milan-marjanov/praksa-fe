import { Box, Typography } from '@mui/material';
import { panelBox2, eventDetailstHeaderStyle, eventTitleStyle } from '../../../styles/CommonStyles';
import { useEventDetailsContext } from '../../../contexts/EventDetailsContext';

export default function EventDescription() {
  const { event } = useEventDetailsContext();
  if (!event) return null;

  return (
    <Box sx={panelBox2}>
      <Box sx={eventDetailstHeaderStyle}>
        <Typography variant="h6" sx={eventTitleStyle}>
          Description
        </Typography>
      </Box>
      <Box sx={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>
        <Typography
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textAlign: 'justify',
            px: 2,
            py: 1.5,
          }}
        >
          {event.description}
        </Typography>
      </Box>
    </Box>
  );
}
