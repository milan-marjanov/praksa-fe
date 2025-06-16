import React, { useEffect, useState } from 'react'
import { Container, Box, Avatar, Typography, Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { UpdateProfileModal } from '../components/profile/UpdateProfileModal'
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal'
import { ChangePfpModal } from '../components/profile/ChangePfpModal'
import { buttonStyle } from '../styles/style'
import {
  getMyProfile,
  getProfileImage,
  updateProfileWithPicture,
  changePassword,
  uploadProfilePicture,
  removeProfilePicture
} from '../services/userService'
import { PasswordChangeRequestDTO, UpdateProfileRequestDTO } from '../types/User'

const MyProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openChangePwd, setOpenChangePwd] = useState(false)
  const [openChangePfp, setOpenChangePfp] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const profile = await getMyProfile()
        setFirstName(profile.firstName)
        setLastName(profile.lastName)
        setEmail(profile.email)
      } catch (e) {
        console.error('Error loading profile data', e)
      }
      const defaultUrl = 'https://example.com/default-profile.png'
      const imageUrl = await getProfileImage()
      setProfilePictureUrl(imageUrl || defaultUrl)
    })()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    navigate('/login', { replace: true })
  }

  const handleUpdate = async (data: UpdateProfileRequestDTO & { profilePicture?: File }) => {
    try {
      const updated = await updateProfileWithPicture(data)
      setFirstName(updated.firstName)
      setLastName(updated.lastName)
      setEmail(updated.email)
      if (data.profilePicture) {
        const newUrl = await getProfileImage()
        setProfilePictureUrl(newUrl || profilePictureUrl)
      }
    } catch (error) {
      console.error('Error updating profile', error)
    } finally {
      setOpenUpdate(false)
    }
  }

  const handleChangePassword = async (dto: PasswordChangeRequestDTO) => {
    try {
      await changePassword(dto)
    } catch (error) {
      console.error('Error changing password', error)
    } finally {
      setOpenChangePwd(false)
    }
  }

  const handleUploadPfp = async (file: File) => {
    try {
      await uploadProfilePicture({ profilePicture: file })
      const newUrl = await getProfileImage()
      setProfilePictureUrl(newUrl || profilePictureUrl)
    } catch (error) {
      console.error('Error uploading picture', error)
    } finally {
      setOpenChangePfp(false)
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ my: 10, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}
    >
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" sx={buttonStyle} onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <IconButton onClick={() => setOpenChangePfp(true)} sx={{ p: 0 }}>
          <Avatar src={profilePictureUrl || undefined} sx={{ width: 120, height: 120 }} />
        </IconButton>
        <Typography variant="h5">
          {firstName} {lastName}
        </Typography>
        <Typography color="textSecondary">{email}</Typography>
      </Box>
      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        <Button variant="contained" sx={buttonStyle} onClick={() => setOpenUpdate(true)}>
          Update Profile
        </Button>
        <Button variant="contained" sx={buttonStyle} onClick={() => setOpenChangePwd(true)}>
          Change Password
        </Button>
      </Box>
      <UpdateProfileModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onUpdate={handleUpdate}
        initialValues={{ firstName, lastName, email, avatarUrl: profilePictureUrl || undefined }}
      />
      <ChangePasswordModal
        open={openChangePwd}
        onClose={() => setOpenChangePwd(false)}
        onChangePassword={handleChangePassword}
      />
      <ChangePfpModal
        open={openChangePfp}
        initialPreview={profilePictureUrl || undefined}
        onClose={() => setOpenChangePfp(false)}
        onUpload={handleUploadPfp}
        onRemove={async () => {
          await removeProfilePicture()
          setProfilePictureUrl(null) 
        }}
      />
    </Container>
  )
}

export default MyProfilePage
