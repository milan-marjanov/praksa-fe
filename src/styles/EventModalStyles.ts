import type { CSSProperties } from 'react';

export const modalBoxStyle = {
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
  pt: 4,
  pb: 4,
  pl: 4,
  pr: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const modalScrollbarStyle = {
  overflowY: 'auto',
  maxHeight: 'calc(90vh - 64px)',
  pr: 4,
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
};

export const slideIndicatorStyle = (active: boolean) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  bgcolor: active ? 'primary.main' : 'grey.400',
});

export const closeButtonStyle = {
  position: 'absolute',
  top: 8,
  right: 16,
  zIndex: 1,
};

export const eventModalContainerStyle = {
  display: 'flex',
  width: '100%',
  backgroundColor: '#f5f5dc',
  p: 1,
};

export const eventDescriptionStyle = {
  position: 'absolute',
  bottom: 8,
  right: 16,
  userSelect: 'none',
};

export const timeOptionsForm: CSSProperties = {
  maxWidth: '100%',
  margin: '0 auto',
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 0,
  borderRadius: 12,
  backgroundColor: '#f5f5dc',
};

export const labelGroup: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
  maxWidth: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 16,
};

export const labelAbove: CSSProperties = {
  fontSize: 14,
  color: '#555',
  marginBottom: 6,
  fontWeight: '600',
};
