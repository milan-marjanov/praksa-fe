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
import CreateEventModal from '../../components/events/CreateEventModal';
import { EventDTO } from '../../types/Event';
import { deleteEvent } from '../../services/eventService';
import { useEvents } from '../../hooks/useEvents';
import { useSetupEventForm } from '../../hooks/useSetupEventForm';
import { useEventForm } from '../../contexts/EventContext';
import {
  boxContainerStyle,
  buttonStyle,
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
    setParticipantEvents,
    userId,
  } = useEvents();

  const [filter, setFilter] = useState<'all' | 'created' | 'invited'>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { creator, filteredUsers, loadingUsers } = useSetupEventForm();
  const { setEventData, resetEventData } = useEventForm();
  const [selectedEvent, setSelectedEvent] = useState<EventDTO>();

  const handleEditClick = (evt: EventDTO) => {
    setSelectedEvent(evt);
    setEventData({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      creatorId: evt.creator.id,
      participantIds: evt.participants.map((p) => p.id),
      votingDeadline: evt.votingDeadline,
      timeOptionType: evt.timeOptionType,
      timeOptions: evt.timeOptions,
      restaurantOptionType: evt.restaurantOptionType,
      restaurantOptions: evt.restaurantOptions,
    });
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedEventId != null) {
        await deleteEvent(selectedEventId);
        setCreatedEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
        setParticipantEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setOpenDialog(false);
      setSelectedEventId(null);
      setSelectedEventTitle(null);
    }
  };

  const handleCardClick = (eventId: number) => navigate(`/eventDetails/${eventId}`);

  const handleCreateClick = () => {
    resetEventData();
    setSelectedEvent(undefined);
    setModalOpen(true);
  };

  const truncateText = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  if (loading || !creator || loadingUsers) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading events…</Typography>
      </Container>
    );
  }

  let eventsToShow =
    filter === 'created'
      ? createdEvents
      : filter === 'invited'
        ? participantEvents.filter((e) => !createdEvents.some((c) => c.id === e.id))
        : allEvents;

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          sx={{ ...buttonStyle, fontWeight: 'bold', display: 'flex', mb: 3, ml: 1 }}
          onClick={handleCreateClick}
        >
          Create Event
        </Button>

        <CreateEventModal
          users={filteredUsers}
          creator={creator}
          event={selectedEvent}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onEventCreated={(newEvt: EventDTO) => {
            setCreatedEvents((prev) => [...prev, newEvt]);
            setParticipantEvents((prev) => [...prev, newEvt]);
          }}
          onEventUpdated={(upd: EventDTO) => {
            setCreatedEvents((prev) => prev.map((e) => (e.id === upd.id ? upd : e)));
            setParticipantEvents((prev) => prev.map((e) => (e.id === upd.id ? upd : e)));
          }}
        />

        <FormControl variant="outlined" size="small">
          <InputLabel id="event-filter-label">Filter</InputLabel>
          <Select
            labelId="event-filter-label"
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="invited">Invited</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {eventsToShow.length === 0 ? (
        <Typography align="center">
          {filter === 'created'
            ? 'You haven’t created any events yet.'
            : filter === 'invited'
              ? 'You’re not invited to any events yet.'
              : 'No events to display.'}
        </Typography>
      ) : (
        <Box sx={boxContainerStyle}>
          {eventsToShow.map((evt) => (
            <Card
              key={evt.id}
              sx={{ ...eventCardStyle, cursor: 'pointer' }}
              onClick={() => handleCardClick(evt.id)}
            >
              <CardContent sx={cardContentStyle}>
                <Typography variant="h6" sx={{ ...eventTitleStyle, wordBreak: 'break-word' }}>
                  {evt.title}
                </Typography>
                <Typography variant="body2" sx={eventDescriptionStyle}>
                  {truncateText(evt.description, 180)}
                </Typography>
              </CardContent>
              {evt.creator.id === userId && (
                <CardActions sx={cardActionsStyle}>
                  <Button
                    variant="outlined"
                    disabled={!!(evt.votingDeadline && new Date(evt.votingDeadline) < new Date())}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(evt);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEventId(evt.id);
                      setSelectedEventTitle(evt.title);
                      setOpenDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={openDialog}
        title="Confirm Deletion"
        onCancel={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
      >
        Are you sure you want to delete “<strong>{selectedEventTitle}</strong>”?
      </ConfirmDialog>
    </Container>
  );
}
