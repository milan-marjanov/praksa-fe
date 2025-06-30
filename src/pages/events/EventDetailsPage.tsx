import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, IconButton, Button } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { getEventDetails, updateEvent } from '../../services/eventService'
import { submitVote } from '../../services/voteService'
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
import RestaurantInfoDialog from '../../components/events/RestaurantInfoDialog'
import {
  pageContainer,
  headerBox,
  headerTitle,
  panelBox,
  mapItemBox,
  buttonStyle,
} from '../../styles/CommonStyles'
import { mapDetailsToUpdateDto } from '../../utils/EventMappers'
import { getCurrentDatetimeLocal } from '../../utils/DateTimeUtils'
import { ParticipantProfileDto } from '../../types/User'
import { CreateVoteDto } from '../../types/Vote'
import EventConfirmDialog from '../../components/events/EventConfirmDialog'
import { toast } from 'react-toastify'
import { useEvents } from '../../hooks/useEvents'
import ChatEvent from '../../components/chat-event/ChatEvent'
import { Dialog, DialogContent ,DialogTitle} from '@mui/material'


export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [event, setEvent] = useState<EventDetailsDto | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { userId } = useEvents()

  const [voteListOpen, setVoteListOpen] = useState(false)
  const [modalUsers, setModalUsers] = useState<ParticipantProfileDto[]>([])
  const [modalTitle, setModalTitle] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmContent, setConfirmContent] = useState<React.ReactNode>(null)
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => { })

  const [restaurantInfoOpen, setRestaurantInfoOpen] = useState(false)
  const [restaurantForInfo, setRestaurantForInfo] = useState<RestaurantOptionDto | null>(null)

  const [openDialog, setOpenDialog] = useState(false)

  const [closingVoting, setClosingVoting] = useState(false);

  const [showChat, setShowChat] = useState(false)



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
      `Are you sure you want to ${selectedTime === opt.id ? 'cancel' : 'reserve'
      } ${new Date(opt.startTime).toLocaleString()}?`,
      async () => {
        const dto: CreateVoteDto = {
          eventId: event!.id,
          timeOptionId: selectedTime === opt.id ? null : opt.id,
          restaurantOptionId: selectedRestaurant,
        }
        await submitVote(dto)
        const updated = await getEventDetails(event!.id)
        if (updated) {
          setEvent(updated)
          setSelectedTime(updated.currentVote?.timeOptionId ?? null)
          setSelectedRestaurant(updated.currentVote?.restaurantOptionId ?? null)
        }
      }
    )

  const handleRestaurantSelect = (opt: RestaurantOptionDto) =>
    openConfirm(
      selectedRestaurant === opt.id ? 'Cancel vote?' : 'Confirm vote',
      `Are you sure you want to ${selectedRestaurant === opt.id ? 'cancel your vote for' : 'vote for'
      } "${opt.name}"?`,
      async () => {
        const dto: CreateVoteDto = {
          eventId: event!.id,
          timeOptionId: selectedTime,
          restaurantOptionId: selectedRestaurant === opt.id ? null : opt.id,
        }
        await submitVote(dto)
        const updated = await getEventDetails(event!.id)
        if (updated) {
          setEvent(updated)
          setSelectedTime(updated.currentVote?.timeOptionId ?? null)
          setSelectedRestaurant(updated.currentVote?.restaurantOptionId ?? null)
        }
      }
    )

  const handleViewRestaurantInfo = (opt: RestaurantOptionDto) => {
    setRestaurantForInfo(opt)
    setRestaurantInfoOpen(true)
  }

  const handleCancelClose = () => {
    setOpenDialog(false)
  }

  const handleConfirmCloseVoting = async () => {
    if (!event) return
    setClosingVoting(true)
    try {
      const now = getCurrentDatetimeLocal()
      const dto = mapDetailsToUpdateDto(event, now)
      await updateEvent(event.id, dto)
      setEvent(prev =>
        prev ? { ...prev, votingDeadline: now } : prev
      )
      toast.success('Successfully closed voting!')
    } catch (err) {
      console.error(err)
    } finally {
      setClosingVoting(false)
      setOpenDialog(false)
    }
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
      ; (async () => {
        try {
          const data = await getEventDetails(Number(id))
          if (data) {
            setEvent(data)
            setSelectedTime(data.currentVote?.timeOptionId ?? null)
            setSelectedRestaurant(data.currentVote?.restaurantOptionId ?? null)
          } else {
            setError('Event not found')
          }
        } catch (e) {
          console.error(e)
          setError('Failed to load event')
        } finally {
          setLoading(false)
        }
      })()
  }, [id])

  if (loading) return <Typography>Loading...</Typography>
  if (error) return <Typography color="error">{error}</Typography>
  if (!event) return <Typography>No event data</Typography>

  const isTimeFixed = event.timeOptionType === 'FIXED' && event.timeOptions.length === 1
  const isRestFixed = event.restaurantOptionType === 'FIXED' && event.restaurantOptions.length === 1
  const isVotingClosed = new Date(event.votingDeadline) <= new Date(getCurrentDatetimeLocal())

  let topTimeOption: TimeOptionDto | null = null
  if (event.timeOptionType !== 'CAPACITY_BASED') {
    const maxVotes = Math.max(...event.timeOptions.map(o => o.reservedCount))
    const ties = event.timeOptions.filter(o => o.reservedCount === maxVotes)
    topTimeOption = ties[0]
  }

  let topRestaurantOption: RestaurantOptionDto | null = null
  if (event.restaurantOptions.length > 0) {
    const maxVotes = Math.max(...event.restaurantOptions.map(o => o.votesCount))
    const ties = event.restaurantOptions.filter(o => o.votesCount === maxVotes)
    topRestaurantOption = ties[0]
  }

  return (
    <Box sx={pageContainer}>
      <Box sx={headerBox}>
        <Typography variant="h4" sx={headerTitle}>
          {event.title}
        </Typography>
  
          <Box
            sx={{
              ...headerBox,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
                  {event.creatorId === userId && (
            <Button
              variant="contained"
              size="small"
              sx={{ ...buttonStyle, mt: 2 }}
              onClick={() => setOpenDialog(true)}
              disabled={isVotingClosed}
            >
              Close Voting
            </Button>
             )} 
            <Button
              variant="contained"
              size="small"
              sx={{ ...buttonStyle, mt: 2 }}
              onClick={() => setShowChat(true)}
            >
              Chat
            </Button>

            <Dialog
              open={showChat}
              onClose={() => setShowChat(false)}
              fullWidth
              maxWidth="sm"
              
            >
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

              <DialogContent sx={{ padding: 0 }}>
                <ChatEvent eventId={event!.id} />
              </DialogContent>
            </Dialog>



          </Box>
        
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        <Box flex={2} display="flex" flexDirection="column" gap={3}>
          <Box
            sx={{
              ...panelBox,
              textAlign: 'left',
              height: { xs: 200, md: '40vh' },
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            <Typography variant="subtitle1" align="center" fontWeight="bold" mb={1}>
              Description
            </Typography>
            <Typography
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'left' }}
            >
              {event.description}
            </Typography>
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <Box sx={panelBox} flex={event.restaurantOptionType === 'NONE' ? 2 : 1}>
              <Typography variant="h6" mb={2}>Time</Typography>

              {isTimeFixed ? (
                <Box sx={{ ...mapItemBox, display: 'flex', justifyContent: 'center' }}>
                  <Typography>
                    {new Date(event.timeOptions[0].startTime).toLocaleString()}
                  </Typography>
                </Box>
              ) : isVotingClosed ? (
                event.timeOptionType === 'CAPACITY_BASED' ? (
                  event.restaurantOptionType === 'NONE' ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' },
                        gap: 2,
                      }}
                    >
                      {event.timeOptions.map(opt => (
                        <Box key={opt.id} sx={mapItemBox}>
                          <TimeOptionItem
                            option={opt}
                            optionType={event.timeOptionType}
                            isSelected={false}
                            disabled={true}
                            onSelect={() => { }}
                            onViewVotes={() => { }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {event.timeOptions.map(opt => (
                        <Box key={opt.id} sx={mapItemBox}>
                          <TimeOptionItem
                            option={opt}
                            optionType={event.timeOptionType}
                            isSelected={false}
                            disabled={true}
                            onSelect={() => { }}
                            onViewVotes={() => { }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )
                ) : (
                  topTimeOption && (
                    <Box sx={{ ...mapItemBox, display: 'flex', justifyContent: 'center' }}>
                      <Typography fontWeight="bold">
                        {new Date(topTimeOption.startTime).toLocaleString()}
                      </Typography>
                    </Box>
                  )
                )
              ) : event.restaurantOptionType === 'NONE' ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' },
                    gap: 2,
                  }}
                >
                  {event.timeOptions.map(opt => (
                    <Box key={opt.id} sx={mapItemBox}>
                      <TimeOptionItem
                        option={opt}
                        optionType={event.timeOptionType}
                        isSelected={selectedTime === opt.id}
                        disabled={
                          event.timeOptionType === 'CAPACITY_BASED' &&
                          opt.reservedCount >= (opt.maxCapacity ?? Infinity)
                        }
                        onSelect={() => handleTimeSelect(opt)}
                        onViewVotes={(t, u) => {
                          setModalTitle(t)
                          setModalUsers(u)
                          setVoteListOpen(true)
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {event.timeOptions.map(opt => (
                    <Box key={opt.id} sx={mapItemBox}>
                      <TimeOptionItem
                        option={opt}
                        optionType={event.timeOptionType}
                        isSelected={selectedTime === opt.id}
                        disabled={
                          event.timeOptionType === 'CAPACITY_BASED' &&
                          opt.reservedCount >= (opt.maxCapacity ?? Infinity)
                        }
                        onSelect={() => handleTimeSelect(opt)}
                        onViewVotes={(t, u) => {
                          setModalTitle(t)
                          setModalUsers(u)
                          setVoteListOpen(true)
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {event.restaurantOptionType !== 'NONE' && (
              <Box sx={panelBox} flex={1}>
                <Typography variant="h6" mb={2}>Restaurant</Typography>

                {isRestFixed ? (
                  <Box
                    sx={{
                      ...mapItemBox,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography>{event.restaurantOptions[0].name}</Typography>
                    <IconButton
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => handleViewRestaurantInfo(event.restaurantOptions[0])}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : isVotingClosed ? (
                  topRestaurantOption && (
                    <Box
                      sx={{
                        ...mapItemBox,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography fontWeight="bold">
                        {topRestaurantOption.name}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => handleViewRestaurantInfo(topRestaurantOption!)}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )
                ) : (
                  event.restaurantOptions.map(opt => (
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

      <EventConfirmDialog
        open={openDialog}
        title="Confirm Close Voting"
        onCancel={handleCancelClose}
        onConfirm={handleConfirmCloseVoting}
        confirmLoading={closingVoting}
      >
        Are you sure you want to close the voting?
      </EventConfirmDialog>

      {restaurantForInfo && (
        <RestaurantInfoDialog
          open={restaurantInfoOpen}
          onClose={() => {
            setRestaurantInfoOpen(false)
            setRestaurantForInfo(null)
          }}
          restaurant={restaurantForInfo}
        />
      )}
    </Box>
  )
}