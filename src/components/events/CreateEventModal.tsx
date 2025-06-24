import { useRef, useState } from 'react';
import {
  Button,
  Modal,
  Box,
  Typography,
  Stack,
  Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EventModal from './EventModal';
import {
  CreateEventDto,
  CreateEventModalProps,
  EventModalRef,
  UpdateEventDTO,
  EventDTO,
} from '../../types/Event';
import RestaurantOptionsModal from './RestaurantOptionsModal';
import TimeOptionsModal from './TimeOptionsModal';
import { createEvent, updateEvent } from '../../services/eventService';
import { useEventForm } from '../../contexts/EventContext';
import { toast } from 'react-toastify';

export default function CreateEventModal({
  users,
  creator,
  event,
  open,
  onClose,
  onEventCreated,
  onEventUpdated,
}: CreateEventModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<EventModalRef>(null);
  const { eventData } = useEventForm();
  const isUpdate = !!event;

  const slideTitles = ['Event Info', 'Date & Time', 'Restaurant Options'];
  const slides = [
    <EventModal
      key="form"
      users={users}
      creator={creator}
      onSubmit={async () => setSlideIndex(1)}
      ref={formRef}
    />,
    <TimeOptionsModal key="slide2" ref={formRef} />,
    <RestaurantOptionsModal key="slide3" ref={formRef} />,
  ];

  const handleClose = () => {
    setSlideIndex(0);
    onClose();
  };

  const next = () => {
    if (slideIndex < slides.length - 1) {
      const result = formRef.current?.validate();
      if (result?.hasError) return;
      setSlideIndex(slideIndex + 1);
    }
  };

  const back = () => {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  };

  const handleCreateEvent = async (): Promise<void> => {
    const result = formRef.current?.validate();
    if (result?.hasError) return;

    setLoading(true); 
    try {
      const dataToSubmit: CreateEventDto = {
        ...(eventData as CreateEventDto),
        creatorId: creator.id,
      };
      const created: EventDTO = await createEvent(dataToSubmit);
      toast.success('Event created successfully');
      onEventCreated?.(created);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (): Promise<void> => {
    const result = formRef.current?.validate();
    if (result?.hasError) return;

    setLoading(true);
    try {
      const dataToSubmit: UpdateEventDTO = {
        ...(eventData as UpdateEventDTO),
      };
      const updated: EventDTO = await updateEvent(
        eventData.id as number,
        dataToSubmit
      );
      toast.success('Event updated successfully');
      onEventUpdated?.(updated);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: '#f5f5dc',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" align="center" fontWeight="bold">
            {isUpdate ? 'Edit Event' : 'Create New Event'}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            mt={1}
            ml={1}
          >
            Step {slideIndex + 1}: {slideTitles[slideIndex]}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
        <Box flex={1}>{slides[slideIndex]}</Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
        >
          <Button onClick={back} disabled={slideIndex === 0}>
            Back
          </Button>
          <Stack direction="row" spacing={1}>
            {slides.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: idx === slideIndex ? 'primary.main' : 'grey.400',
                }}
              />
            ))}
          </Stack>
          {slideIndex === slides.length - 1 ? (
            <LoadingButton
              variant="contained"
              onClick={isUpdate ? handleUpdateEvent : handleCreateEvent}
              loading={loading}
              disabled={loading}                           
            >
              {isUpdate ? 'Save Changes' : 'Create Event'}
            </LoadingButton>
          ) : (
            <Button onClick={next}>Next</Button>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}
