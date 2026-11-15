import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type {
  CreateUserValues,
  UpdateUserValues,
} from '../schemas/user.schema';
import type { User, UsersFiltersState, UsersList } from '../types';

export const usersApi = {
  getUsers: async (params: UsersFiltersState) =>
    (await axios.get<Result<UsersList>>('/users', { params })).data.data,

  createUser: async (values: CreateUserValues) =>
    (await axios.post<Result<User>>('/users', values)).data,

  updateUser: async ({
    id,
    values,
  }: {
    id: string;
    values: UpdateUserValues;
  }) => (await axios.patch<Result<User>>(`/users/${id}`, values)).data,

  /** Also deletes the user's notes, posts and sessions. */
  deleteUser: async (id: string) =>
    (await axios.delete<Result>(`/users/${id}`)).data,
};
