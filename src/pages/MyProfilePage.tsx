import { Container, Stack, Avatar, Typography } from '@mui/material';

export default function MyProfilePage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Stack spacing={2} alignItems="center">
        <Avatar sx={{ width: 120, height: 120 }} />
        <Typography variant="h5">Ime Prezime</Typography>
        <Typography variant="body2">email@example.com</Typography>
        {/* dugmad i modal-i stižu kasnije */}
      </Stack>
    </Container>
  );
}
