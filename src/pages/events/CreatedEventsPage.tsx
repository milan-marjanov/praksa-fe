import { Container, Box, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConfirmDialog from '../../components/admin_panel/ConfirmDialog';
import { EventDTO } from '../../types/Event';
import { deleteEvent } from '../../services/eventService';
import { UseEvents } from '../../hooks/UseEvents';

export default function CreatedEventsPage() {
  const navigate = useNavigate();
  const { events, setEvents, loading } = UseEvents();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | null>(null);

  const boxContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 3,
    mb: 5,
  };

  const eventCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '250px',    
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    },
  };

  const cardContentStyle = {
    flex: '1 1 auto',      
    overflowY: 'auto',     
    padding: '16px 16px 0 16px',
      scrollbarWidth: 'thin', 

  };

  const cardActionsStyle = {
    justifyContent: 'center',
    gap: 1,
    pb: 2,
    mt: 'auto',           
  };

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
      <Button
        variant="contained"
        sx={{ fontWeight: 'bold', display: 'flex', mb: 3, ml: 1 }}
        onClick={() => navigate('/createEvent')}
      >
        Create Event
      </Button>
      {events.length === 0 ? (
        <Typography variant="body1" align="center">
          You haven’t created any events yet. Start by adding one!
        </Typography>
      ) : (
        <Box sx={boxContainerStyle}>
          {events.map((event) => (
            <Card key={event.id} sx={eventCardStyle}>
              <CardContent sx={cardContentStyle}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'black',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    letterSpacing: '0.05em',
                    textTransform: 'capitalize',
                    mb: 1,
                    mx: 1,
                    borderBottom: '2px solid black',
                    paddingBottom: '4px',
                  }}
                >
                  {event.title}
                </Typography>
<Typography
  variant="body2"
  color="text.secondary"
  sx={{
    textAlign: 'justify',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    mx: 1,
  }}
>
  {event.description.length > 180
    ? event.description.slice(0, 180) + '...'
    : event.description}
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