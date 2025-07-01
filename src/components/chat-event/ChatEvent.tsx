import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import {
  chatContainer,
  messagesContainer,
  messageBubble,
  inputContainer,
  input,
  sendButton,
} from '../../styles/CommonStyles';
import SendIcon from '@mui/icons-material/Send';


interface ChatEventProps {
  eventId: number;
}

const initialMessages: MessageDto[] = [
  {
    id: 1,
    text: 'Zdravo svima!',
    sentAt: '2025-06-30T10:00:00Z',
    user: { id: 1, firstName: 'Marko', lastName: 'Marković' },
  },
  {
    id: 2,
    text: 'Da li ima još neko za događaj?',
    sentAt: '2025-06-30T10:05:00Z',
    user: { id: 2, firstName: 'Jelena', lastName: 'Jovanović' },
  },
  {
    id: 3,
    text: 'Ja sam tu!',
    sentAt: '2025-06-30T10:07:00Z',
    user: { id: 3, firstName: 'Nikola', lastName: 'Nikolić' },
  },
  {
    id: 4,
    text: 'Odlična organizacija prošli put.',
    sentAt: '2025-06-30T10:10:00Z',
    user: { id: 4, firstName: 'Ana', lastName: 'Anić' },
  },
  {
    id: 5,
    text: 'Da, slažem se sa Anom.',
    sentAt: '2025-06-30T10:12:00Z',
    user: { id: 1, firstName: 'Marko', lastName: 'Marković' },
  },
  {
    id: 6,
    text: 'Kada je sledeći sastanak?',
    sentAt: '2025-06-30T10:15:00Z',
    user: { id: 5, firstName: 'Petar', lastName: 'Petrović' },
  },
  {
    id: 7,
    text: 'Mislim da je sledeće nedelje.',
    sentAt: '2025-06-30T10:17:00Z',
    user: { id: 3, firstName: 'Nikola', lastName: 'Nikolić' },
  },
  {
    id: 8,
    text: 'Super, hvala na info.',
    sentAt: '2025-06-30T10:20:00Z',
    user: { id: 2, firstName: 'Jelena', lastName: 'Jovanović' },
  },
  {
    id: 9,
    text: 'Vidimo se tamo!',
    sentAt: '2025-06-30T10:25:00Z',
    user: { id: 4, firstName: 'Ana', lastName: 'Anić' },
  },
  {
    id: 10,
    text: 'Pozdrav svima!',
    sentAt: '2025-06-30T10:30:00Z',
    user: { id: 5, firstName: 'Petar', lastName: 'Petrović' },
  },
];
const ChatEvent: React.FC<ChatEventProps> = ({ eventId }) => {
  const [messages, setMessages] = useState<MessageDto[]>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const newMsg: MessageDto = {
      id: messages.length + 1,
      text: newMessage,
      sentAt: new Date().toISOString(),
      user: { id: 999, firstName: 'Ti', lastName: 'Korisnik' },
      repliedToMessage: null,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <Box sx={chatContainer}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
        ChatEvent {eventId}
      </Typography>


      <Box sx={messagesContainer}>
        {messages.length === 0 ? (
          <Typography color="text.secondary">No messages yet.</Typography>
        ) : (
          messages.map((msg) => (
            <Box key={msg.id} sx={messageBubble}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {msg.user.firstName} {msg.user.lastName}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.2 }}>
                {msg.text}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <Box sx={inputContainer}>
        <TextField
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter message..."
          sx={input}
        />
        <Button
          onClick={handleSend}
          sx={sendButton}
          variant="contained"
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );

};

export default ChatEvent;
