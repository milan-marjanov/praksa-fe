import { useRef, useState } from 'react';
import { Button, Modal, Box, Typography, Stack, Divider, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EventModal from '../../events/create/EventModal';
import {
  CreateEventDto,
  CreateEventModalProps,
  EventModalRef,
  UpdateEventDTO,
  EventDTO,
} from '../../../types/Event';
import TimeOptionsModal from '../../events/create/TimeOptionsModal';
import { createEvent, updateEvent } from '../../../services/eventService';
import { useEventForm } from '../../../contexts/EventContext';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import EventConfirmDialog from '../../events/create/EventConfirmDialog';
import RestaurantOptionsModal from '../../events/create/RestaurantOptionsModal';
import {
  closeButtonStyle,
  modalBoxStyle,
  modalScrollbarStyle,
  slideIndicatorStyle,
} from '../../../styles/EventModalStyles';
import EventDataReview from './EventDataReview';
import { buttonStyle } from '../../../styles/CommonStyles';

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

  const slideTitles = ['Event Info', 'Date & Time', 'Restaurant Options', 'Review & Confirm'];
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => () => {});
  const [validationError, setValidationError] = useState(false);
  const handleValidationChange = (hasError: boolean) => setValidationError(hasError);

  const slides = [
    <EventModal key="form" users={users} creator={creator} ref={formRef} />,
    <TimeOptionsModal key="slide2" ref={formRef} />,
    <RestaurantOptionsModal key="slide3" ref={formRef} />,
    <EventDataReview key="slide4" onValidationChange={handleValidationChange} />,
  ];

  const handleOpenDialog = () => {
    setDialogTitle(isUpdate ? 'Discard Changes' : 'Cancel Event Creation');
    setDialogContent(
      isUpdate
        ? 'Are you sure you want to discard your changes to this event? All unsaved edits will be lost.'
        : 'Are you sure you want to cancel creating this event? All entered data will be lost.',
    );
    setDialogAction(() => handleClose);
    setOpenDialog(true);
  };

  const next = () => {
    const result = formRef.current?.validate();
    if (result?.hasError) return;
    if (slideIndex < slides.length - 1) setSlideIndex(slideIndex + 1);
  };

  const back = () => {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSlideIndex(0);
    onClose?.();
  };

  const buildSubmitData = (): Partial<CreateEventDto> => {
    if (eventData.timeOptionType !== 'CAPACITY_BASED') {
      eventData.timeOptions = eventData.timeOptions?.map((opt) => ({
        ...opt,
        maxCapacity: undefined,
      }));
    }

    if (eventData.timeOptionType === 'FIXED' && eventData.restaurantOptionType !== 'VOTING') {
      eventData.votingDeadline = undefined;
    }
    return { ...eventData, ...(isUpdate ? {} : { creatorId: creator.id }) };
  };

  const handleSaveEvent = async () => {
    setLoading(true);
    try {
      const dataToSubmit = buildSubmitData();

      if (isUpdate) {
        const updated: EventDTO = await updateEvent(
          eventData.id as number,
          dataToSubmit as UpdateEventDTO,
        );
        toast.success('Event updated successfully');
        onEventUpdated?.(updated);
      } else {
        const created: EventDTO = await createEvent(dataToSubmit as CreateEventDto);
        toast.success('Event created successfully');
        onEventCreated?.(created);
      }
      handleClose();
    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} event:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ padding: 40 }}>
      <Modal
        open={open}
        onClose={(_e, reason) =>
          reason === 'backdropClick' || reason === 'escapeKeyDown' ? null : handleClose()
        }
      >
        <Box sx={modalBoxStyle}>
          <Box sx={modalScrollbarStyle}>
            <Box sx={{ mb: 2 }}>
              <IconButton onClick={handleOpenDialog} sx={closeButtonStyle}>
                <CloseIcon />
              </IconButton>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {isUpdate ? 'Update Event' : 'Create New Event'}
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="text.secondary" ml={1} mt={1}>
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
                {slides.map((_, idx) => (
                  <Box key={idx} sx={slideIndicatorStyle(idx === slideIndex)} />
                ))}
              </Stack>

              {slideIndex === slides.length - 1 ? (
                <LoadingButton
                  variant="contained"
                  onClick={handleSaveEvent}
                  disabled={validationError || loading}
                  loading={loading}
                  sx={buttonStyle}
                >
                  {isUpdate ? 'Save Changes' : 'Create Event'}
                </LoadingButton>
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
          dialogAction();
        }}
      >
        {dialogContent}
      </EventConfirmDialog>
    </Box>
  );
}
