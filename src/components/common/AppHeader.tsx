import { AppBar, Toolbar, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface AppHeaderProps {
  title: ReactNode;
  rightContent?: ReactNode;
}

export default function AppHeader({ title, rightContent }: AppHeaderProps) {
  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background:
          'linear-gradient(90deg, rgba(127,188,9,1) 0%, rgb(47, 141, 19) 100%)',
      }}
    >
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {rightContent}
      </Toolbar>
    </AppBar>
  );
}
