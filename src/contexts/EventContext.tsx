import { createContext, useContext, useState, ReactNode } from 'react';
import { CreateEventDto } from '../types/Event';
import { defaultData } from '../utils/EventDefaults';

interface EventFormContextType {
  eventData: Partial<CreateEventDto>;
  setEventData: (data: Partial<CreateEventDto>) => void;
  resetEventData: () => void;
}

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
