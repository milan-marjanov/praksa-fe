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

export const eventCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '250px',
  borderRadius: 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  },
};

export const boxContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 3,
  mb: 5,
};
export const cardContentStyle = {
  flex: '1 1 auto',
  overflowY: 'auto',
  padding: '16px 16px 0 16px',
  scrollbarWidth: 'thin',
};

export const cardActionsStyle = {
  justifyContent: 'center',
  gap: 1,
  pb: 2,
  mt: 'auto',
};

export const eventTitleStyle = {
  color: 'black',
  fontWeight: 700,
  fontSize: '1.25rem',
  letterSpacing: '0.05em',
  textTransform: 'capitalize',
  mb: 1,
  mx: 1,
  borderBottom: '2px solid black',
  paddingBottom: '4px',
};

export const eventDescriptionStyle = {
  textAlign: 'justify',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  mx: 1,
};
