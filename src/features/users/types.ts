import type { InterestName } from '@/shared/constants/interests';
import type { RoleName } from '@/shared/constants/roles';

export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  role: RoleName;
  interests: InterestName[];
  createdAt: string;
}

export interface UsersList {
  total: number;
  users: User[];
}

export interface UsersFiltersState {
  search: string;
  role: string;
  interest: string;
  page: number;
  pageSize: number;
}
