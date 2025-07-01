export interface UserMessageDto {
  id: number;
  firstName: string;
  lastName: string;
}

export interface MessageDto {
  id: number;
  text: string;
  sentAt: string;
  user: UserMessageDto;
  repliedToMessage?: MessageDto | null;
}

export interface ChatDto {
  id: number;
  eventId: number;
  messages: MessageDto[];
}

export interface CreateMessageDto {
  text: string;
  userId: number;
  repliedToMessageId?: number | null;
  chatId: number;
}
