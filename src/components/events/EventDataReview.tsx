import { forwardRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from '@mui/material';
import { EventModalRef } from '../../types/Event';
import { useEventForm } from '../../contexts/EventContext';
import EventConfirmDialog from './EventConfirmDialog';
import { formatDateTime, isValidFutureDate } from '../../utils/DateTimeUtils';
import DateTimeForm from './DateTimeForm';
import { labelAbove, tableCellStyle } from '../../styles/EventModalStyles';

interface EventDataReviewProps {
  onValidationChange?: (hasError: boolean) => void;
}

const EventDataReview = forwardRef<EventModalRef, EventDataReviewProps>(
  ({ onValidationChange }) => {
    const { eventData, setEventData } = useEventForm();
    const [openDialog, setOpenDialog] = useState(false);
    const votingDeadline = eventData.votingDeadline;
    onValidationChange?.(false);

    useEffect(() => {
      const now = new Date();

      let hasError = false;
      if(eventData.timeOptionType === 'FIXED'|| eventData.restaurantOptionType !== 'VOTING'){
        if (!votingDeadline) {
          hasError = true;
        } else if (!isValidFutureDate(votingDeadline, now)) {
          hasError = true;
        }
      }

    }, [votingDeadline, onValidationChange]);

    const handleCancelClose = () => {
      setOpenDialog(false);
    };

    const handleConfirmClose = () => {
      setOpenDialog(false);
    };

    const handleVotingDeadlineChange = (newDeadline: string) => {
      setEventData({
        ...eventData,
        votingDeadline: newDeadline,
      });
    };

    return (
      <Box display="flex" flexDirection="column" gap={2} ml={1} mt={2}>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5dc' }}>
          <Typography variant="h6">Event Info</Typography>
          <Divider sx={{ my: 1 }} />

          <List sx={{ ml: -1, mt: -1 }}>
            <ListItem>
              <ListItemText
                primary="Event Title"
                secondaryTypographyProps={{ sx: { mt: 0.5 } }}
                secondary={eventData.title || 'Not set'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Description"
                secondaryTypographyProps={{ sx: { mt: 0.5 } }}
                secondary={eventData.description || 'Not set'}
              />
            </ListItem>
          </List>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5dc' }}>
          <Typography variant="h6">Date & Time Options</Typography>
          <Divider sx={{ my: 2 }} />
          {eventData.timeOptions?.length ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">#</TableCell>
                    <TableCell align="center">Start Time</TableCell>
                    <TableCell align="center">End Time</TableCell>
                    <TableCell align="center">Max Capacity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventData.timeOptions.map((option, index) => (
                    <TableRow key={option.id}>
                      <TableCell sx={tableCellStyle}>{index + 1}</TableCell>
                      <TableCell sx={tableCellStyle}>{formatDateTime(option.startTime)}</TableCell>
                      <TableCell sx={tableCellStyle}>{formatDateTime(option.endTime)}</TableCell>
                      <TableCell sx={tableCellStyle}>
                        {eventData.timeOptionType !== 'CAPACITY_BASED'
                          ? ''
                          : option.maxCapacity || 'N/A'}
                      </TableCell>{' '}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No time options added.</Typography>
          )}
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5dc' }}>
          <Typography variant="h6">Restaurant Options</Typography>
          <Divider sx={{ my: 2 }} />
          {eventData.restaurantOptions?.length ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">#</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Menu Image</TableCell>
                    <TableCell align="center">Restaurant URL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventData.restaurantOptions.map((restaurant, index) => (
                    <TableRow key={restaurant.id}>
                      <TableCell sx={tableCellStyle}>{index + 1}</TableCell>
                      <TableCell sx={tableCellStyle}>{restaurant.name}</TableCell>
                      <TableCell sx={tableCellStyle}>{restaurant.menuImageUrl || 'N/A'}</TableCell>
                      <TableCell sx={tableCellStyle}>{restaurant.restaurantUrl || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography fontSize={14} color="text.secondary" marginLeft={1}>
              No restaurant options added.
            </Typography>
          )}
        </Paper>
        {(eventData.timeOptionType === 'VOTING' ||
          eventData.timeOptionType === 'CAPACITY_BASED' ||
          eventData.restaurantOptionType === 'VOTING') && (
          <>
            <Typography style={{ ...labelAbove, marginLeft: 8, marginBottom: -8, marginTop: 10 }}>
              Voting Deadline
            </Typography>

            <DateTimeForm
              label=""
              required
              value={votingDeadline}
              initialValue={votingDeadline}
              onValidChange={(e) => handleVotingDeadlineChange(e)}
            />
          </>
        )}

        <EventConfirmDialog
          open={openDialog}
          title="Confirm Close Voting"
          onCancel={handleCancelClose}
          onConfirm={handleConfirmClose}
        >
          Are you sure you want to close the voting?
        </EventConfirmDialog>
      </Box>
    );
  },
);

export default EventDataReview;
