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

/** Everything the list page filters by. Same fields as the API's UsersQueryDto. */
export interface UsersFiltersState {
  search: string;
  role: string;
  page: number;
  pageSize: number;
}
