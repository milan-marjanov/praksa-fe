import { Box, Typography } from '@mui/material'
import { useEventDetailsContext } from '../../../contexts/EventDetailsContext'
import RestaurantOptionItem from './RestaurantOptionItem'
import {
  panelBox,
  mapItemBox,
  eventDetailstHeaderStyle,
  eventTitleStyle,
} from '../../../styles/CommonStyles'
import { ParticipantProfileDto } from '../../../types/User'
import { RestaurantOptionDto } from '../../../types/Event'

export default function RestaurantVotingPanel() {
  const {
    event,
    selectedRestaurant,
    voteRestaurant,
    openConfirm,
    openVoteList,
  } = useEventDetailsContext()

  if (!event) return null

  const isRestFixed =
    event.restaurantOptionType === 'FIXED' && event.restaurantOptions.length === 1
  const isVotingClosed = new Date(event.votingDeadline) <= new Date()

  const topRestaurantOption = event.restaurantOptions.reduce<RestaurantOptionDto>(
    (a, b) => (b.votesCount > a.votesCount ? b : a),
    event.restaurantOptions[0]
  )

  const handleRestaurantSelect = (opt: RestaurantOptionDto) =>
    openConfirm(
      selectedRestaurant === opt.id ? 'Cancel vote?' : 'Confirm vote',
      `Are you sure you want to ${
        selectedRestaurant === opt.id ? 'cancel your vote for' : 'vote for'
      } "${opt.name}"?`,
      () => voteRestaurant(opt)
    )

  const showVotes = (title: string, users: ParticipantProfileDto[]) =>
    openVoteList(title, users)

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
          Restaurant
        </Typography>
      </Box>
      <Box sx={{ m: 2 }}>
        {isRestFixed ? (
          <Typography>{event.restaurantOptions[0].name}</Typography>
        ) : isVotingClosed ? (
          <RestaurantOptionItem
            option={topRestaurantOption}
            optionType={event.restaurantOptionType}
            selectedId={null}
            isClosed={true}
            onSelect={() => {}}
            onViewVotes={showVotes}
          />
        ) : (
          event.restaurantOptions.map(opt => (
            <Box key={opt.id} sx={mapItemBox}>
              <RestaurantOptionItem
                option={opt}
                optionType={event.restaurantOptionType}
                selectedId={selectedRestaurant}
                isClosed={false}
                onSelect={handleRestaurantSelect}
                onViewVotes={showVotes}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
