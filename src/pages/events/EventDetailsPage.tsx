import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import {
  EventDetailsDto,
  TimeOptionDto,
  RestaurantOptionDto,
} from '../../types/Event'
import ParticipantsList from '../../components/events/ParticipantsListProps'
import TimeOptionItem from '../../components/events/TimeOptionItem'
import RestaurantOptionItem from '../../components/events/RestaurantOptionItem'
import VoteList from '../../components/events/VoteList'
import ConfirmOption from '../../components/events/ConfirmOption'
import {
  pageContainer,
  headerBox,
  headerTitle,
  panelBox,
  mapItemBox,
} from '../../styles/CommonStyles'
import { ParticipantProfileDto } from '../../types/User'

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [event, setEvent] = useState<EventDetailsDto | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null)

  const [voteListOpen, setVoteListOpen] = useState(false)
  const [modalUsers, setModalUsers] = useState<ParticipantProfileDto[]>([])
  const [modalTitle, setModalTitle] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmContent, setConfirmContent] = useState<React.ReactNode>(null)
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {})

  const openConfirm = (
    title: string,
    content: React.ReactNode,
    action: () => void
  ) => {
    setConfirmTitle(title)
    setConfirmContent(content)
    setOnConfirmAction(() => () => {
      action()
      setConfirmOpen(false)
    })
    setConfirmOpen(true)
  }

  const handleTimeSelect = (opt: TimeOptionDto) =>
    openConfirm(
      selectedTime === opt.id ? 'Cancel reservation?' : 'Confirm reservation',
      `Are you sure you want to ${
        selectedTime === opt.id ? 'cancel' : 'reserve'
      } ${new Date(opt.startTime).toLocaleString()}?`,
      () => setSelectedTime(selectedTime === opt.id ? null : opt.id)
    )

  const handleRestaurantSelect = (opt: RestaurantOptionDto) =>
    openConfirm(
      selectedRestaurant === opt.id ? 'Cancel vote?' : 'Confirm vote',
      `Are you sure you want to ${
        selectedRestaurant === opt.id ? 'cancel your vote for' : 'vote for'
      } "${opt.name}"?`,
      () => setSelectedRestaurant(selectedRestaurant === opt.id ? null : opt.id)
    )

  useEffect(() => {
    const stub: EventDetailsDto = {
      creator: {
        id: 42,
        firstName: 'Ana',
        lastName: 'Marković',
        profilePicture: null,
      },
      id: 1,
      title: 'Lupus in fabula',
      description: 'Lupus in fabula is a Latin phrase meaning the wolf in the story. Its a proverb used to describe the situation when someone or something appears unexpectedly, as if summoned by the very act of talking about it. Its similar to the English idiom speak of the devil. ',
      participants: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        firstName: `User${i + 1}`,
        lastName: 'Test',
        email: `user${i + 1}@example.com`,
        profilePictureUrl: null,
      })),
      timeOptions: [
        {
          id: 10,
          startTime: '2025-07-01T09:00:00.000Z',
          endTime: '2025-07-01T10:00:00.000Z',
          createdAt: '2025-06-15T00:00:00.000Z',
          maxCapacity: 5,
          votesCount: 3,
          reservedCount: 2,
          votedUsers: [
            { id: 1, firstName: 'Vukasin', lastName: 'Patkovic', email: 'vp@example.com', profilePictureUrl: null },
            { id: 2, firstName: 'User', lastName: 'Test', email: 'vpa@example.com', profilePictureUrl: null },
            { id: 3, firstName: 'U', lastName: 'T', email: 'ut@example.com', profilePictureUrl: null },
          ],
        },
      ],
      restaurantOptions: [
        {
          id: 100,
          name: 'Cuprija',
          menuImageUrl: null,
          restaurantUrl: '',
          votesCount: 1,
          votedUsers: [],
        },
      ],
      timeOptionType: 'FIXED',
      restaurantOptionType: 'FIXED',
      currentVote: null,
    }

    setEvent(stub)
    setSelectedTime(null)
    setSelectedRestaurant(null)
  }, [id])

  if (!event) return <Typography>Loading...</Typography>

  const isTimeFixed =
    event.timeOptionType === 'FIXED' && event.timeOptions.length === 1
  const isRestFixed =
    event.restaurantOptionType === 'FIXED' && event.restaurantOptions.length === 1

  return (
    <Box sx={pageContainer}>
      <Box sx={headerBox}>
        <Box sx={{ textAlign: 'center' }} />
        <Typography variant="h4" sx={headerTitle}>
          {event.title}
        </Typography>
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        <Box flex={2} display="flex" flexDirection="column" gap={3}>
          <Box
            sx={{
              ...panelBox,
              textAlign: 'left',
              height: { md: '40vh' },
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="bold"
              mb={1}
            >
              Description
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {event.description}
            </Typography>
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <Box
              sx={panelBox}
              flex={event.restaurantOptionType === 'NONE' ? 2 : 1}
            >
              <Typography variant="h6" mb={2}>
                Time
              </Typography>

              {isTimeFixed ? (
                <Box
                  sx={{ ...mapItemBox, display: 'flex', justifyContent: 'center' }}
                >
                  <Typography>
                    {new Date(event.timeOptions[0].startTime).toLocaleString()}
                  </Typography>
                </Box>
              ) : event.restaurantOptionType === 'NONE' ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                  }}
                >
                  {event.timeOptions.map((opt) => (
                    <Box key={opt.id} sx={mapItemBox}>
                      <TimeOptionItem
                        optionType={event.timeOptionType}
                        option={opt}
                        isSelected={selectedTime === opt.id}
                        disabled={
                          opt.reservedCount >= (opt.maxCapacity ?? Infinity)
                        }
                        onSelect={() => handleTimeSelect(opt)}
                        onViewVotes={(title, users) => {
                          setModalTitle(title)
                          setModalUsers(users)
                          setVoteListOpen(true)
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                event.timeOptions.map((opt) => (
                  <Box key={opt.id} sx={mapItemBox}>
                    <TimeOptionItem
                      optionType={event.timeOptionType}
                      option={opt}
                      isSelected={selectedTime === opt.id}
                      disabled={
                        opt.reservedCount >= (opt.maxCapacity ?? Infinity)
                      }
                      onSelect={() => handleTimeSelect(opt)}
                      onViewVotes={(title, users) => {
                        setModalTitle(title)
                        setModalUsers(users)
                        setVoteListOpen(true)
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>

            {event.restaurantOptionType !== 'NONE' && (
              <Box sx={panelBox} flex={1}>
                <Typography variant="h6" mb={2}>
                  Restaurant
                </Typography>
                {isRestFixed ? (
                  <Box
                    sx={{
                      ...mapItemBox,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <RestaurantOptionItem
                      option={event.restaurantOptions[0]}
                      optionType={event.restaurantOptionType}
                      isSelected={
                        selectedRestaurant === event.restaurantOptions[0].id
                      }
                      onSelect={() =>
                        handleRestaurantSelect(event.restaurantOptions[0])
                      }
                    />
                  </Box>
                ) : (
                  event.restaurantOptions.map((opt) => (
                    <Box key={opt.id} sx={mapItemBox}>
                      <RestaurantOptionItem
                        option={opt}
                        optionType={event.restaurantOptionType}
                        isSelected={selectedRestaurant === opt.id}
                        onSelect={() => handleRestaurantSelect(opt)}
                      />
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            ...panelBox,
            flex: 0.8,
            height: { md: 'calc(40vh + 35vh + 25px)' },
            overflowY: 'auto',
          }}
        >
          <ParticipantsList participants={event.participants} />
        </Box>
      </Box>

      <VoteList
        open={voteListOpen}
        onClose={() => setVoteListOpen(false)}
        title={modalTitle}
        users={modalUsers}
      />
      <ConfirmOption
        open={confirmOpen}
        title={confirmTitle}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirmAction}
      >
        {confirmContent}
      </ConfirmOption>
    </Box>
  )
}
