import { useState } from 'react';
import { Button, Modal, Box, Typography, Stack, Divider } from '@mui/material';
import EventModal from './EventModal';
import { CreateEventDto, UpdateEventDTO } from '../../types/Event';
import { UserDTO } from '../../types/User';

type CreateEventModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateEventModal({ open, onClose }: CreateEventModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  const users: UserDTO[] = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      profilePictureUrl: '',
    },
    { id: 2, firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', profilePictureUrl: '' },
    {
      id: 3,
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      profilePictureUrl: '',
    },
  ];

  const creator = users[0];

  const handleFormSubmit = async (data: CreateEventDto | UpdateEventDTO, isUpdate: boolean) => {
    console.log('Submitted data:', data, 'Is update:', isUpdate);
    setSlideIndex(1);
  };

  const slideTitles = ['Event Info', 'Date & Time', 'Confirmation'];

  const slides = [
    <EventModal key="form" users={users} creator={creator} onSubmit={handleFormSubmit} />,
    <Typography key="slide2">Step 2: Date & Time (Coming Soon)</Typography>,
    <Typography key="slide3">Step 3: Confirmation (Coming Soon)</Typography>,
  ];

  const handleClose = () => {
    setSlideIndex(0);
    onClose(); // Use the passed in onClose
  };
  const next = () => {
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
  );
}
