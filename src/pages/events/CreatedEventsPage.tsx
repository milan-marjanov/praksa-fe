import { Container, Box, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../components/admin_panel/ConfirmDialog';
import { EventDTO } from '../../types/Event';
import { fetchAllEvents, deleteEvent } from '../../services/eventService';
import { boxContainerStyle, eventCardStyle } from '../../styles/CommonStyles';

export default function AllEventsCreatedPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchAllEvents();
        setEvents(data ?? []);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleDeleteClick = (id: number, title: string) => {
    setSelectedEventId(id);
    setSelectedEventTitle(title);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEventId !== null) {
      try {
        await deleteEvent(selectedEventId);
        setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
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

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        My Created Events
      </Typography>

      <Box sx={boxContainerStyle}>
        {events.map((event) => (
          <Card key={event.id} sx={eventCardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>
                {event.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ mt: 'auto', justifyContent: 'flex-start' }}>
              <Button size="medium" onClick={() => navigate(`/updateEvent`, { state: { event } })}>
                Edit
              </Button>

              <Button
                size="medium"
                color="error"
                onClick={() => handleDeleteClick(event.id, event.title)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <ConfirmDialog
        open={openDialog}
        title="Confirm Deletion"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      >
        Are you sure you want to delete the event <strong>{selectedEventTitle}</strong>?
      </ConfirmDialog>
    </Container>
  );
}
