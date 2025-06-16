import { Container, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { buttonStyle } from '../styles/CommonStyles';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Stack spacing={2}>
        <Button variant="contained" sx={buttonStyle} onClick={() => navigate('/myprofile')}>
          My Profile
        </Button>
      </Stack>
    </Container>
  );
}
