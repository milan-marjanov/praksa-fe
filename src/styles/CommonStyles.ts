import { SxProps, Theme } from '@mui/material';

export const avatarStyle = {
  m: 1,
  bgcolor: '#4B570E',
};

export const containerStyle = {
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
};

export const boxContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  justifyContent: 'center',
  mb: 2,
};

export const eventCardStyle = {
  width: 330,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 220,
};

export const formButtonStyle = {
  mt: 3,
  mb: 2,
  width: 300,
  mx: 'auto',
  backgroundColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'secondary.main',
  },
  fontWeight: 'bold',
};

export const buttonStyle: SxProps<Theme> = {
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  padding: '8px 20px',
  borderRadius: 1,
};
