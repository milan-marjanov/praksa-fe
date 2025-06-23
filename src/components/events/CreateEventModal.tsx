import { useRef, useState } from 'react';
import { Button, Modal, Box, Typography, Stack, Divider, IconButton } from '@mui/material';
import EventModal from './EventModal';
import {
  CreateEventDto,
  CreateEventModalProps,
  EventModalRef,
  UpdateEventDTO,
} from '../../types/Event';
import TimeOptionsModal from './TimeOptionsModal';
import { createEvent, updateEvent } from '../../services/eventService';
import { useEventForm } from '../../contexts/EventContext';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import EventConfirmDialog from './EventConfirmDialog';
import RestaurantOptionsModal from './RestaurantOptionsModal';

export const modalBoxStyle = {
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
  pt: 4,
  pb: 4,
  pl: 4,
  pr: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const modalScrollbarStyle = {
  overflowY: 'auto',
  maxHeight: 'calc(90vh - 64px)',
  pr: 4,
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
};

export const slideIndicatorStyle = (active: boolean) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  bgcolor: active ? 'primary.main' : 'grey.400',
});

export default function CreateEventModal({
  users,
  creator,
  event,
  open,
  onClose,
}: CreateEventModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const formRef = useRef<EventModalRef>(null);
  const { eventData } = useEventForm();
  const isUpdate = !!event;
  const slideTitles = ['Event Info', 'Date & Time', 'Restaurant Options'];
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => () => {});

  const slides = [
    <EventModal key="form" users={users} creator={creator} ref={formRef} />,
    <TimeOptionsModal key="slide2" ref={formRef} isUpdate={isUpdate} />,
    <RestaurantOptionsModal key="slide3" ref={formRef} isUpdate={isUpdate} />,
  ];

  const handleOpenDialog = () => {
    if (isUpdate) {
      setDialogTitle('Discard Changes');
      setDialogContent(
        'Are you sure you want to discard your changes to this event? All unsaved edits will be lost.',
      );
      setDialogAction(() => handleClose);
    } else {
      setDialogTitle('Cancel Event Creation');
      setDialogContent(
        'Are you sure you want to cancel creating this event? All entered data will be lost.',
      );
      setDialogAction(() => handleClose);
    }
    setOpenDialog(true);
  };

  const next = () => {
    if (slideIndex === 0 || slideIndex === 1) {
      const result = formRef.current?.validate();
      if (result?.hasError) return;
    }

    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const back = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSlideIndex(0);
    onClose?.();
  };

  const HandleSaveEvent = async () => {
    if (slideIndex === 2) {
      const result = formRef.current?.validate();
      if (result?.hasError) return;
    }

    try {
      if (eventData.timeOptionType !== 'CAPACITY_BASED') {
        eventData.timeOptions = eventData.timeOptions?.map((opt) => ({
          ...opt,
          maxCapacity: undefined,
        }));
      }

      if (eventData.timeOptionType === 'FIXED' && eventData.restaurantOptionType === 'FIXED') {
        eventData.votingDeadline = undefined;
      }

      const dataToSubmit = {
        ...eventData,
        ...(isUpdate ? {} : { creatorId: creator.id }),
      };

      if (isUpdate) {
        await updateEvent(eventData.id as number, dataToSubmit as UpdateEventDTO);
        toast.success('Event updated successfully');
      } else {
        await createEvent(dataToSubmit as CreateEventDto);
        toast.success('Event created successfully');
      }

      handleClose();
    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} event:`, error);
    }
  };

  const confirmSaveEvent = () => {
    setDialogTitle(isUpdate ? 'Confirm Update' : 'Confirm Creation');
    setDialogContent(
      isUpdate
        ? 'Do you want to save the changes you made to this event?'
        : 'Are you sure you want to create this event with the entered details?',
    );
    setDialogAction(() => HandleSaveEvent);
    setOpenDialog(true);
  };

  return (
    <div style={{ padding: 40 }}>
      <Modal sx={modalBoxStyle} open={open} onClose={handleClose}>
        <Box sx={modalBoxStyle}>
          <Box sx={modalScrollbarStyle}>
            <Box sx={{ mb: 2 }}>
              <IconButton
                onClick={handleOpenDialog} // ✅ Correct
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 16,
                  zIndex: 1,
                }}
              >
                <CloseIcon />
              </IconButton>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Create New Event
                </Typography>
              </Box>

              <Typography variant="subtitle1" color="text.secondary" marginLeft={1} marginTop={1}>
                Step {slideIndex + 1}: {slideTitles[slideIndex]}
              </Typography>

              <Divider sx={{ my: 2 }} />
            </Box>

            <Box>{slides[slideIndex]}</Box>

            <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center" mt={4}>
              <Button onClick={back} disabled={slideIndex === 0}>
                Back
              </Button>

              <Stack direction="row" spacing={1}>
                {slides.map((_, index) => (
                  <Box key={index} sx={slideIndicatorStyle(index === slideIndex)} />
                ))}
              </Stack>

              {slideIndex === slides.length - 1 ? (
                <Button variant="contained" onClick={confirmSaveEvent}>
                  {isUpdate ? 'Save Changes' : 'Create Event'}
                </Button>
              ) : (
                <Button onClick={next}>Next</Button>
              )}
            </Stack>
          </Box>
        </Box>
      </Modal>
      <EventConfirmDialog
        open={openDialog}
        title={dialogTitle}
        onCancel={() => setOpenDialog(false)}
        onConfirm={() => {
          setOpenDialog(false);
          dialogAction(); // ✅ Call the dynamically assigned action
        }}
      >
        {dialogContent}
      </EventConfirmDialog>
    </div>
  );
}
