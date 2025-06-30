interface UserMessageDto {
  id: number;
  firstName: string;
  lastName: string;
}

interface MessageDto {
  id: number;
  text: string;
  sentAt: string; 
  user: UserMessageDto;
  repliedToMessage?: MessageDto | null;
}

interface ChatDto {
  id: number;
  eventId: number;
  messages: MessageDto[];
}
