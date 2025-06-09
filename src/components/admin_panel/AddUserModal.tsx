import { Modal, Box, Typography, TextField, Button } from '@mui/material'
import { useState } from 'react'
import type { CreateUserDTO } from '../../types/CreateUserDTO'

const style = {
  position: 'absolute' as const,
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 1,
  boxShadow: 24,
}

export interface AddUserModalProps {
  open: boolean
  onClose(): void
  onAdd(user: CreateUserDTO): Promise<unknown>
}

export default function AddUserModal({ open, onClose, onAdd }: AddUserModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    setError(null)
    try {
      await onAdd({ firstName, lastName, email })
      setFirstName(''); setLastName(''); setEmail('')
      onClose()
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Email already in use')
      } else {
        setError('Something went wrong')
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Add New User
        </Typography>

        <TextField
          label="First Name"
          fullWidth
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          fullWidth
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Add User
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
