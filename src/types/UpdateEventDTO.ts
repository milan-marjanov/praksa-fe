import { User } from './User';

export interface UpdateEventDTO {
  users: User[];
  creatorId: number | null;
  initialData: {
    name: string;
    description: string;
    participants: number[];
  };
}
