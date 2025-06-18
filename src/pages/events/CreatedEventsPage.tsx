import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/admin_panel/ConfirmDialog';
import { EventDTO } from '../../types/Event';
import { deleteEvent } from '../../services/eventService';
import { useEvents } from '../../hooks/useEvents';
import {
  boxContainerStyle,
  cardActionsStyle,
  cardContentStyle,
  eventCardStyle,
  eventDescriptionStyle,
  eventTitleStyle,
} from '../../styles/CommonStyles';

export default function EventsPage() {
  const navigate = useNavigate();
  const {
    createdEvents,
    participantEvents,
    allEvents,
    loading,
    setCreatedEvents,
    userId,
  } = useEvents();

  const [filter, setFilter] = useState<'all' | 'created' | 'invited'>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | null>(null);

  const handleEditClick = (event: EventDTO) => {
    navigate('/updateEvent', { state: { event } });
  };

  const handleDeleteClick = (id: number, title: string) => {
    setSelectedEventId(id);
    setSelectedEventTitle(title);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEventId !== null) {
      try {
        await deleteEvent(selectedEventId);
        setCreatedEvents(prev => prev.filter(e => e.id !== selectedEventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
    setOpenDialog(false);
    setSelectedEventId(null);
    setSelectedEventTitle(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedEventId(null);
    setSelectedEventTitle(null);
  };

  const handleCardClick = (eventId: number) => {
  navigate(`/eventDetails/${eventId}`);
};


  const truncateText = (text: string, maxLength: number): string =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  let eventsToShow: EventDTO[];
  switch (filter) {
    case 'created':
      eventsToShow = createdEvents;
      break;
    case 'invited':
      eventsToShow = participantEvents.filter(
        e => !createdEvents.some(c => c.id === e.id)
      );
      break;
    default:
      eventsToShow = allEvents;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          sx={{ fontWeight: 'bold' }}
          onClick={() => navigate('/createEvent')}
        >
          Create Event
        </Button>

        <FormControl variant="outlined" size="small">
          <InputLabel id="event-filter-label">Filter</InputLabel>
          <Select
            labelId="event-filter-label"
            value={filter}
            label="Filter"
            onChange={e => setFilter(e.target.value as 'all' | 'created' | 'invited')}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="invited">Invited</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {eventsToShow.length === 0 ? (
        <Typography variant="body1" align="center">
          {filter === 'created'
            ? "You haven’t created any events yet."
            : filter === 'invited'
            ? "You’re not invited to any events yet."
            : "No events to display."}
        </Typography>
      ) : (
        <Box sx={boxContainerStyle}>
          {eventsToShow.map((event: EventDTO) => (
            <Card
              key={event.id}
              sx={eventCardStyle}
              onClick={() => handleCardClick(event.id)}
              style={{ cursor: 'pointer' }}
            >
              <CardContent sx={cardContentStyle}>
                <Typography variant="h6" gutterBottom sx={eventTitleStyle}>
                  {event.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={eventDescriptionStyle}
                >
                  {truncateText(event.description, 180)}
                </Typography>
              </CardContent>
              <CardActions sx={cardActionsStyle}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={e => {
                    e.stopPropagation();
                    handleEditClick(event);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="medium"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteClick(event.id, event.title);
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={openDialog}
        title="Confirm Deletion"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      >
        Are you sure you want to delete the event{' '}
        <strong>{selectedEventTitle}</strong>?
      </ConfirmDialog>
    </Container>
  );
}
