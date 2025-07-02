import {
  Box,
  Typography,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from '@mui/material';
import { useEventDetailsContext } from '../../../contexts/EventDetailsContext';
import { useEvents } from '../../../hooks/useEvents';
import {
  buttonStyle,
  eventTitleStyle,
  eventDetailstHeaderStyle2,
  headerBox2,
} from '../../../styles/CommonStyles';
import { useState } from 'react';
import ChatEvent from '../../../components/chat-event/ChatEvent';

export default function EventHeader() {
  const { event, selectedTime, selectedRestaurant, openCloseVotingConfirm } =
    useEventDetailsContext();
  const { userId } = useEvents();

  if (!event) return null;

  const isVotingClosed = new Date(event.votingDeadline) <= new Date();
  const needsTimeVote = event.timeOptionType !== 'FIXED';
  const needsRestVote = event.restaurantOptionType === 'VOTING';
  const hasVotedTime = !needsTimeVote || selectedTime !== null;
  const hasVotedRestaurant = !needsRestVote || selectedRestaurant !== null;
  const canCloseVoting = !isVotingClosed && hasVotedTime && hasVotedRestaurant;
  const hasAnyVoting = needsTimeVote || needsRestVote;

  const [showChat, setShowChat] = useState(false);

  return (
    <Box sx={headerBox2}>
      <Box sx={eventDetailstHeaderStyle2}>
        <Typography sx={{ ...eventTitleStyle, fontSize: '1.75rem' }}>{event.title}</Typography>
      </Box>

      {event.creatorId === userId && (
        <Box
          sx={{
            width: { xs: '100%', md: '30%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: { xs: 1, md: 1.5 },
            py: 1,
          }}
        >
          {hasAnyVoting && (
            <Tooltip
              title={!hasVotedTime || !hasVotedRestaurant ? 'Cast your vote before closing.' : ''}
            >
              <span>
                <Button
                  variant="contained"
                  size="small"
                  color="warning"
                  sx={buttonStyle}
                  onClick={openCloseVotingConfirm}
                  disabled={!canCloseVoting}
                >
                  Close Voting
                </Button>
              </span>
            </Tooltip>
          )}

          <Button
            variant="contained"
            size="small"
            sx={{ ...buttonStyle, ml: hasAnyVoting ? 2 : 0 }}
            onClick={() => setShowChat(true)}
          >
            Chat
          </Button>

          <Dialog open={showChat} onClose={() => setShowChat(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2 }}>
              <IconButton
                aria-label="close"
                onClick={() => setShowChat(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                ×
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              <ChatEvent eventId={event.id} title={event.title} />
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}
