import api from '../axios/axiosClient';
import { CreateVoteDto, VoteDto } from '../types/Vote';

export async function submitVote(vote: CreateVoteDto){
  const response = await api.post<VoteDto>('/api/events/voting', vote);
  return response.data;
}