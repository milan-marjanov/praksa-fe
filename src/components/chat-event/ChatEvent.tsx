import React, { useEffect, useState, useRef } from "react";
import { Box, Button, TextField, Typography } from '@mui/material';
import {
  chatContainer,
  inputContainer,
  input1,
  sendButton,
} from '../../styles/CommonStyles';
import SendIcon from '@mui/icons-material/Send';
import { CreateMessageDto, MessageDto } from '../../types/chat';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChatByEventId } from '../../services/eventService';
import { JwtDecoded } from "../../types/User";
import { jwtDecode } from "jwt-decode";

interface ChatEventProps {
  eventId: number;
  title:string;
}

const ChatEvent: React.FC<ChatEventProps> = ({ eventId,title }) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");
  const stompClientRef = useRef<Client | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    const { id } = jwtDecode<JwtDecoded>(token);
    setUserId(id);
    getChatByEventId(eventId)
      .then((chatDto) => {
        if (chatDto && chatDto.messages) {
          setMessages(chatDto.messages);
        }
      })
      .catch((err) => {
        console.error("Error loading chat messages:", err);
      });
  }, [eventId]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        setConnected(true);
        stompClient.subscribe("/topic/chat", (message) => {
          if (message.body) {
            const msg: MessageDto = JSON.parse(message.body);
            setMessages((prev) => [...prev, msg]);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker error: " + frame.headers["message"]);
        console.error("Details: " + frame.body);
      },
      onWebSocketError: (evt) => {
        console.error("WebSocket error", evt);
      },
      reconnectDelay: 5000,
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      setConnected(false);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !stompClientRef.current || !connected || !userId) return;

    const msgObj: CreateMessageDto = {
      text: input.trim(),
      userId: userId,
      repliedToMessageId: null,
      chatId: eventId,
    };

    stompClientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(msgObj),
    });
    console.log("Sent message:", msgObj);
    setInput("");
  };

  return (
    <Box sx={chatContainer}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
        {title}
      </Typography>


      <Box sx={{
        height: 500,
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: 2,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',

        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <Typography color="text.secondary">No messages yet.</Typography>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                maxWidth: '43ch',
                marginBottom: '10px',

                alignSelf: msg.user.id === userId ? 'flex-end' : 'flex-start',
                padding: '8px 15px',
                borderRadius: '10px',
                backgroundColor: msg.user.id === userId ? '#6CA0DC' : '#6CA0DC',
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {msg.user.firstName} {msg.user.lastName}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter message..."
          sx={input1}
          multiline
          minRows={2}
        />
        <Button
          onClick={sendMessage}
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
