import { Container, Box, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConfirmDialog from '../../components/admin_panel/ConfirmDialog';
import { EventDTO } from '../../types/Event';
import { deleteEvent } from '../../services/eventService';
import { boxContainerStyle, eventCardStyle } from '../../styles/CommonStyles';
import { UseEvents } from '../../hooks/UseEvents';

export default function AllEventsCreatedPage() {
  const navigate = useNavigate();
  const { events, setEvents, loading } = UseEvents();
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
              <Button variant="outlined" onClick={() => handleEditClick(event)}>
                Edit
              </Button>

              <Button
                variant="outlined"
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
