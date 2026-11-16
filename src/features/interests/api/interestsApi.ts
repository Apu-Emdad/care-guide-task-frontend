import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type { InterestGroup, InterestsQuery } from '../types';

export const interestsApi = {
  getUsersByInterest: async (params: InterestsQuery) =>
    (await axios.get<Result<InterestGroup[]>>('/users/interests', { params }))
      .data.data,
};
