import type { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
