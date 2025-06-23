import api from '../axios/axiosClient';
import { VoteDto } from '../types/Vote';

export async function submitVote(vote: VoteDto) {
  const response = await api.post<VoteDto>('/api/events/voting', vote);
  return response.data;
}
