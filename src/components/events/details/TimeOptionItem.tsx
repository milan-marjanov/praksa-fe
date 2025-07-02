import { Box, Typography, Avatar } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import { TimeOptionDto, TimeOptionType } from '../../../types/Event'
import { ParticipantProfileDto } from '../../../types/User'
import { toggleButtonStyleTime, mapItemBox } from '../../../styles/CommonStyles'

interface Props {
  option: TimeOptionDto
  optionType: TimeOptionType
  selectedId: number | null
  isClosed: boolean
  onSelect: (opt: TimeOptionDto) => void
  onViewVotes: (title: string, users: ParticipantProfileDto[]) => void
}

export default function TimeOptionItem({
  option,
  optionType,
  selectedId,
  isClosed,
  onSelect,
  onViewVotes,
}: Props) {
  const { id, startTime, reservedCount, maxCapacity, votesCount, votedUsers } = option

  const isSelected = !isClosed && selectedId === id
  const capacityFull = optionType === 'CAPACITY_BASED' && reservedCount >= (maxCapacity ?? Infinity)
  const disabled = isClosed || (capacityFull && !isSelected)
  const showAsText = optionType === 'FIXED' || disabled
  const dateLabel = new Date(startTime).toLocaleString()
  const title =
    optionType === 'CAPACITY_BASED'
      ? `Reservations for ${dateLabel}`
      : `Votes for ${dateLabel}`

  const displayVoters = votedUsers.slice(0, 2)
  const remainingCount = votedUsers.length - displayVoters.length
  const showVotes = !(optionType === 'FIXED' && votedUsers.length === 0)

  return (
    <Box
      sx={{
        ...mapItemBox,
        display: 'flex',
        alignItems: 'center',
        py: 1,
        gap: 0.5,
        flexWrap: 'wrap',
      }}
    >
      {showAsText ? (
        <Typography fontWeight="bold" sx={{ minWidth: 130 }}>
          {dateLabel}
        </Typography>
      ) : (
        <ToggleButton
          value={id}
          selected={isSelected}
          disabled={disabled}
          onChange={() => onSelect(option)}
          sx={toggleButtonStyleTime}
        >
          {dateLabel}
        </ToggleButton>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
        {showVotes && (
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            {optionType === 'CAPACITY_BASED'
              ? `Votes: ${reservedCount}/${maxCapacity}`
              : `Votes: ${votesCount}`}
          </Typography>
        )}

        {votedUsers.length > 0 && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 1 }}
            onClick={() => onViewVotes(title, votedUsers)}
          >
            {displayVoters.map(u => (
              <Avatar
                key={u.id}
                src={u.profilePictureUrl ?? undefined}
                alt={`${u.firstName} ${u.lastName}`}
                sx={{ width: 32, height: 32, mr: -1, border: '2px solid white' }}
              />
            ))}
            {remainingCount > 0 && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                +{remainingCount}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
