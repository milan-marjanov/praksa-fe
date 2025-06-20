import { useRef, useState } from 'react';
import { Button, Modal, Box, Typography, Stack, Divider } from '@mui/material';
import EventModal, { EventModalRef } from './EventModal';
import { CreateEventDto, CreateEventModalProps, UpdateEventDTO } from '../../types/Event';
import RestaurantOptionsModal from './RestaurantOptionsModal';
import TimeOptionsModal from './TimeOptionsModal';
import { EventFormProvider } from '../../contexts/EventContext';

export default function CreateEventModal({
  users,
  creator,
  event,
  open,
  onClose,
}: CreateEventModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const formRef = useRef<EventModalRef>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFormSubmit = async (data: CreateEventDto | UpdateEventDTO, isUpdate: boolean) => {
    if (event) {
      console.log('Event not null');
    }
    console.log('Submitted data:', data, 'Is update:', isUpdate);
    setSlideIndex(1);
  };

  const slideTitles = ['Event Info', 'Date & Time', 'Restaurant Options'];

  const slides = [
    <EventModal
      key="form"
      users={users}
      creator={creator}
      onSubmit={handleFormSubmit}
      ref={formRef}
    />,
    <TimeOptionsModal key="slide2" />,
    <RestaurantOptionsModal key="slide3" />,
  ];

  const handleClose = () => {
    setSlideIndex(0);
    onClose();
  };

  const next = () => {
    if (slideIndex === 0) {
      const result = formRef.current?.validate();
      if (result?.hasError) return;
    }

    if (slideIndex === 2) {
      //const errors = validateRestaurantOptions();
      //setErrorMap(errors);
      //if (Object.keys(errors).length > 0) return;
      setErrors(errors);
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

  return (
    <EventFormProvider>
      <div style={{ padding: 40 }}>
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
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Box sx={{ mb: 2 }}>
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

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4}>
              <Button onClick={back} disabled={slideIndex === 0}>
                Back
              </Button>

              <Stack direction="row" spacing={1}>
                {slides.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: index === slideIndex ? 'primary.main' : 'grey.400',
                    }}
                  />
                ))}
              </Stack>

              <Button onClick={next} disabled={slideIndex === slides.length - 1}>
                Next
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </EventFormProvider>
  );
}
