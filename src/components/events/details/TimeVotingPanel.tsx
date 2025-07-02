import { Box, Typography } from '@mui/material';
import { useEventDetailsContext } from '../../../contexts/EventDetailsContext';
import TimeOptionItem from './TimeOptionItem';
import {
  panelBox,
  mapItemBox,
  eventDetailstHeaderStyle,
  eventTitleStyle,
} from '../../../styles/CommonStyles';
import { ParticipantProfileDto } from '../../../types/User';
import { TimeOptionDto } from '../../../types/Event';

export default function TimeVotingPanel() {
  const { event, selectedTime, voteTime, openConfirm, openVoteList } =
    useEventDetailsContext();

  if (!event) return null;

  const isTimeFixed =
    event.timeOptionType === 'FIXED' && event.timeOptions.length === 1;
  const isVotingClosed = new Date(event.votingDeadline) <= new Date();
  const maxVotes = Math.max(...event.timeOptions.map(o => o.votesCount));
  const tiedOptions = event.timeOptions.filter(o => o.votesCount === maxVotes);
  const creatorVote = tiedOptions.find(o =>
    o.votedUsers.some(u => u.id === event.creatorId)
  );
  const topTimeOption = creatorVote || tiedOptions[0];

  const handleTimeSelect = (opt: TimeOptionDto) =>
    openConfirm(
      selectedTime === opt.id ? 'Cancel reservation?' : 'Confirm reservation',
      `Are you sure you want to ${
        selectedTime === opt.id ? 'cancel' : 'reserve'
      } ${new Date(opt.startTime).toLocaleString()}?`,
      () => voteTime(opt),
    );

  const showVotes = (title: string, users: ParticipantProfileDto[]) =>
    openVoteList(title, users);

  return (
    <Box
      sx={{
        ...panelBox,
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={eventDetailstHeaderStyle}>
        <Typography variant="h6" sx={eventTitleStyle}>
          Time
        </Typography>
      </Box>
      <Box sx={{ m: 2 }}>
        {isTimeFixed ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography>
              {new Date(event.timeOptions[0].startTime).toLocaleString()}
            </Typography>
          </Box>
        ) : isVotingClosed && event.timeOptionType === 'VOTING' ? (
          <Box sx={mapItemBox}>
            <TimeOptionItem
              option={topTimeOption}
              optionType={event.timeOptionType}
              selectedId={null}
              isClosed={true}
              onSelect={() => {}}
              onViewVotes={showVotes}
            />
          </Box>
        ) : (
          event.timeOptions.map(opt => (
            <Box key={opt.id} sx={mapItemBox}>
              <TimeOptionItem
                option={opt}
                optionType={event.timeOptionType}
                selectedId={selectedTime}
                isClosed={isVotingClosed}
                onSelect={handleTimeSelect}
                onViewVotes={showVotes}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
