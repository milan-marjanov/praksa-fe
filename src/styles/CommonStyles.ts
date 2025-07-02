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
  '&:hover': { backgroundColor: 'secondary.main' },
  fontWeight: 'bold',
};

export const buttonStyle: SxProps<Theme> = {
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  padding: '8px 20px',
  borderRadius: 1,
};

export const AddUserModalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 1,
  boxShadow: 24,
};

export const userListMobilePaper = {
  p: 1,
  display: 'flex',
  alignItems: 'center',
};

export const userListMobileInfoBox = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
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
  textAlign: 'center',
  letterSpacing: '0.05em',
  wordBreak: 'break-word',
  textTransform: 'capitalize',
  mx: 1,
};

export const eventDescriptionStyle = {
  textAlign: 'justify',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  mx: 1,
};

export const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2,
  boxShadow: 24,
}

export const eventContainerStyle = {
  padding: '40px 16px',
  boxSizing: 'border-box',
  minHeight: '100vh',
};

export const eventBoxStyle = {
  maxWidth: '100%',
  width: '100%',
};

export const eventHeaderStyle = {
  paddingBottom: '20px',
  marginBottom: '20px',
  textAlign: 'center',
};

export const eventTitleCenterStyle = {
  fontWeight: 'bold',
  fontSize: '45px',
};

export const eventBodyStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '24px',
};

export const leftBoxStyle = {
  flex: 1,
  maxWidth: '700px',
  height: '400px',
  padding: '6px',
  marginLeft: '200px',
};

export const rightBoxStyle = {
  marginRight: '200px',
  width: '300px',
  height: '500px',
  borderRadius: '8px',
  backgroundColor: 'white',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '3px',
};

export const sectionLabelStyle = {
  fontWeight: 600,
  marginBottom: '8px',
  fontSize: '30px',
};

export const descriptionBoxStyle = {
  border: '1px solid #ddd',
  borderRadius: '6px',
  padding: '12px',
  backgroundColor: '#fff',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
};

export const participantsStyle = {
  fontWeight: 'bold',
  mb: 2,
  border: 0.5,
  padding: 1,
  margin: 1,
  borderRadius: '8px',
  fontSize: '20px',
};

export const pageContainer: SxProps<Theme> = {
  maxWidth: 1200,
  mx: 'auto',
  px: 2,
  py: 2,
};

export const headerBox: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mb: 3,
};

export const headerBox2: SxProps<Theme> = {
  ...headerBox,
  flexDirection: { xs: 'column', md: 'row' },
  gap: 2,
  width: '100%',
}

export const headerTitle: SxProps<Theme> = {
  flex: 2,
  textAlign: 'center',
};

export const backButtonBox: SxProps<Theme> = {
  flex: 1,
  textAlign: 'right',
};

export const panelBox: SxProps<Theme> = {
  p: 2,
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
};

export const panelBox2: SxProps<Theme> = {
  p: 0,
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  height: { xs: 200, md: '40vh' },
  maxHeight: 400,
  display: 'flex',
  flexDirection: 'column',
};

export const mapItemBox: SxProps<Theme> = {
  mb: 2,
};

export const toggleButtonStyleTime: SxProps<Theme> = {
  minWidth: 210,
  maxWidth: 210,
  justifyContent: 'flex-start',
  textTransform: 'none',
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
  wordBreak: "break-all",
  borderRadius: 2,
  border: '1px solid',
  borderColor: '#ccc',
  backgroundColor: '#e0efb1',
  color: 'inherit',
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    backgroundColor: 'primary.main',
    color: '#fff',
    borderColor: 'primary.main',
  },
};

export const toggleButtonStyleRestaurant: SxProps<Theme> = {
  minWidth: 150,
  maxWidth: 150,
  justifyContent: 'flex-start',
  textTransform: 'none',
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
  wordBreak: "break-all",
  borderRadius: 2,
  border: '1px solid',
  borderColor: '#ccc',
  backgroundColor: '#e0efb1',
  color: 'inherit',
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    backgroundColor: 'primary.main',
    color: '#fff',
    borderColor: 'primary.main',
  },
};

export const nameContainer = {
  maxWidth: 170,
  whiteSpace: 'normal' as const,
  wordBreak: 'break-word' as const,
  textAlign: 'center' as const,
  mr: 5,
};

export const eventDetailstHeaderStyle = {
  backgroundColor: 'primary.main',
  width: '100%',
  padding: '8px 12px',
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  minHeight: '50px',
  boxSizing: 'border-box',
};

export const eventDetailstHeaderStyle2 = {
  ...eventDetailstHeaderStyle,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  width: { xs: '100%', md: '73%' },
  textAlign: { xs: 'center', md: 'left' },
  p: 2,
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  mt: 1.5,
}



