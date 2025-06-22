import { createContext, useContext, useState, ReactNode } from 'react';
import { CreateEventDto } from '../types/Event';

interface EventFormContextType {
  eventData: Partial<CreateEventDto>;
  setEventData: (data: Partial<CreateEventDto>) => void;
  resetEventData: () => void;
}
const tomorrowNoon = new Date();
tomorrowNoon.setDate(tomorrowNoon.getDate() + 1);
tomorrowNoon.setHours(12, 0, 0, 0); // sets time to 12:00:00.000 PM

const defaultData: CreateEventDto = {
  id: 0,
  title: '',
  description: '',
  creatorId: 0,
  participantIds: [],
  votingDeadline: tomorrowNoon.toISOString().slice(0, 16),
  timeOptionType: 'FIXED',
  timeOptions: [],
  restaurantOptionType: 'FIXED',
  restaurantOptions: [],
};

const EventContext = createContext<EventFormContextType | undefined>(undefined);

export const EventFormProvider = ({ children }: { children: ReactNode }) => {
  const [eventData, setEventDataState] = useState<Partial<CreateEventDto>>(defaultData);

  const setEventData = (data: Partial<CreateEventDto>) => {
    setEventDataState((prev) => ({ ...prev, ...data }));
  };

  const resetEventData = () => {
    setEventDataState(defaultData);
  };

  return (
    <EventContext.Provider value={{ eventData, setEventData, resetEventData }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventForm = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventForm must be used within an EventFormProvider');
  }
  return context;
};
