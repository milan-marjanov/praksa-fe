import { Box, Typography, Avatar, IconButton, ToggleButton } from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import LanguageIcon from '@mui/icons-material/Language'
import { RestaurantOptionDto, RestaurantOptionType } from '../../../types/Event'
import { ParticipantProfileDto } from '../../../types/User'
import { toggleButtonStyleRestaurant, nameContainer, mapItemBox } from '../../../styles/CommonStyles'

interface Props {
  option: RestaurantOptionDto
  optionType: RestaurantOptionType
  selectedId: number | null
  isClosed: boolean
  onSelect: (opt: RestaurantOptionDto) => void
  onViewVotes: (title: string, users: ParticipantProfileDto[]) => void
  showVotes?: boolean
}

export default function RestaurantOptionItem({
  option,
  selectedId,
  isClosed,
  onSelect,
  onViewVotes,
  showVotes = true,
}: Props) {
  const { id, name, votesCount, votedUsers, menuImageUrl, restaurantUrl } = option

  const isSelected = !isClosed && selectedId === id
  const displayVoters = votedUsers.slice(0, 2)
  const remainingCount = votedUsers.length - displayVoters.length
  const title = `Votes for ${name}`

  return (
    <Box sx={{ ...mapItemBox, display: 'flex', alignItems: 'center', py: 1 }}>
      {isClosed ? (
        <Box sx={nameContainer}>
          <Typography>{name}</Typography>
        </Box>
      ) : (
        <ToggleButton
          value={id}
          selected={isSelected}
          onChange={() => onSelect(option)}
          sx={{ ...toggleButtonStyleRestaurant, ...nameContainer }}
        >
          {name}
        </ToggleButton>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
        {menuImageUrl && (
          <IconButton
            size="small"
            component="a"
            href={menuImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View Menu"
          >
            <RestaurantMenuIcon fontSize="small" />
          </IconButton>
        )}
        {restaurantUrl && (
          <IconButton
            size="small"
            component="a"
            href={restaurantUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Website"
          >
            <LanguageIcon fontSize="small" />
          </IconButton>
        )}

        {showVotes && (
          <>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              Votes: {votesCount}
            </Typography>

            {votedUsers.length > 0 && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 0.5 }}
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
                {remainingCount > 0 && <Typography variant="body2">+{remainingCount}</Typography>}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}