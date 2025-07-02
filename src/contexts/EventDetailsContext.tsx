import { createContext, useContext, useState, ReactNode } from 'react';
import { useEventDetails, UseEventDetailsResult } from '../hooks/useEventDetails';
import ConfirmOption from '../components/events/ConfirmOption';
import VoteList from '../components/events/details/VoteList';
import EventConfirmDialog from '../components/events/EventConfirmDialog';
import { ParticipantProfileDto } from '../types/User';

interface ConfirmModalState {
  open: boolean;
  title: string;
  content: ReactNode;
  action: () => void;
}

interface VoteListModalState {
  open: boolean;
  title: string;
  users: ParticipantProfileDto[];
}

interface CloseVotingModalState {
  open: boolean;
  loading: boolean;
}

export interface EventDetailsContextValue extends UseEventDetailsResult {
  confirmModal: ConfirmModalState;
  voteListModal: VoteListModalState;
  closeVotingModal: CloseVotingModalState;
  openConfirm: (title: string, content: ReactNode, action: () => void) => void;
  openVoteList: (title: string, users: ParticipantProfileDto[]) => void;
  openCloseVotingConfirm: () => void;
}

const EventDetailsContext = createContext<EventDetailsContextValue | undefined>(undefined);

export const EventDetailsProvider = ({
  eventId,
  children,
}: {
  eventId: number | null;
  children: ReactNode;
}) => {
  const {
    event,
    loading,
    error,
    selectedTime,
    selectedRestaurant,
    refresh,
    voteTime,
    voteRestaurant,
    closeVoting,
  } = useEventDetails(eventId);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
    title: '',
    content: null,
    action: () => {},
  });

  const [voteListModal, setVoteListModal] = useState<VoteListModalState>({
    open: false,
    title: '',
    users: [],
  });

  const [closeVotingModal, setCloseVotingModal] = useState<CloseVotingModalState>({
    open: false,
    loading: false,
  });

  const openConfirm = (title: string, content: ReactNode, action: () => void) => {
    setConfirmModal({ open: true, title, content, action });
  };

  const openVoteList = (title: string, users: ParticipantProfileDto[]) => {
    setVoteListModal({ open: true, title, users });
  };

  const openCloseVotingConfirm = () => {
    setCloseVotingModal((m) => ({ ...m, open: true }));
  };

  const contextValue: EventDetailsContextValue = {
    event,
    loading,
    error,
    selectedTime,
    selectedRestaurant,
    refresh,
    voteTime,
    voteRestaurant,
    closeVoting,
    confirmModal,
    voteListModal,
    closeVotingModal,
    openConfirm,
    openVoteList,
    openCloseVotingConfirm,
  };

  return (
    <EventDetailsContext.Provider value={contextValue}>
      {children}

      <VoteList
        open={voteListModal.open}
        title={voteListModal.title}
        users={voteListModal.users}
        onClose={() => setVoteListModal((m) => ({ ...m, open: false }))}
      />

      <ConfirmOption
        open={confirmModal.open}
        title={confirmModal.title}
        onCancel={() => setConfirmModal((m) => ({ ...m, open: false }))}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal((m) => ({ ...m, open: false }));
        }}
      >
        {confirmModal.content}
      </ConfirmOption>

      <EventConfirmDialog
        open={closeVotingModal.open}
        title="Confirm Close Voting"
        confirmLoading={closeVotingModal.loading}
        onCancel={() => setCloseVotingModal((m) => ({ ...m, open: false }))}
        onConfirm={async () => {
          setCloseVotingModal((m) => ({ ...m, loading: true }));
          await closeVoting();
          setCloseVotingModal({ open: false, loading: false });
        }}
      >
        Are you sure you want to close the voting?
      </EventConfirmDialog>
    </EventDetailsContext.Provider>
  );
};

export const useEventDetailsContext = (): EventDetailsContextValue => {
  const context = useContext(EventDetailsContext);
  if (!context) {
    throw new Error('useEventDetailsContext must be used within an EventDetailsProvider');
  }
  return context;
};
