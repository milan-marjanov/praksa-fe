import { Container, Box, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
import CreateEventModal from '../../components/events/CreateEventModal';
import { useSetupEventForm } from '../../hooks/useSetupEventForm';
import { useEventForm } from '../../contexts/EventContext';

export default function CreatedEventsPage() {
  const navigate = useNavigate();
  const { events, setEvents, loading } = useEvents();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { creator, filteredUsers, loadingUsers } = useSetupEventForm();
  const { resetEventData } = useEventForm();

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

  const handleCreateClick = () => {
    resetEventData();
    setModalOpen(true);
  };

  const truncateText = (text: string, maxLength: number): string =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  if (loading || !creator || loadingUsers) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        variant="contained"
        sx={{ fontWeight: 'bold', display: 'flex', mb: 3, ml: 1 }}
        onClick={handleCreateClick}
      >
        Create Event
      </Button>
      <CreateEventModal
        users={filteredUsers}
        creator={creator}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {events.length === 0 ? (
        <Typography variant="body1" align="center">
          You haven’t created any events yet. Start by adding one!
        </Typography>
      ) : (
        <Box sx={boxContainerStyle}>
          {events.map((event) => (
            <Card key={event.id} sx={eventCardStyle}>
              <CardContent sx={cardContentStyle}>
                <Typography variant="h6" gutterBottom sx={eventTitleStyle}>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={eventDescriptionStyle}>
                  {truncateText(event.description, 180)}
                </Typography>
              </CardContent>
              <CardActions sx={cardActionsStyle}>
                <Button variant="outlined" size="medium" onClick={() => handleEditClick(event)}>
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="medium"
                  onClick={() => handleDeleteClick(event.id, event.title)}
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
        Are you sure you want to delete the event <strong>{selectedEventTitle}</strong>?
      </ConfirmDialog>
    </Container>
  );
}
