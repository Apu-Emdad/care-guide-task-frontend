import type { InterestName } from '@/shared/constants/interests';
import type { RoleName } from '@/shared/constants/roles';

export interface Result<T = unknown> {
  status: number;
  message: string;
  data: T;
  error?: string;
  context?: string;
}

export interface AuthUser {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  role: RoleName;
  interests: InterestName[];
  createdAt: string;
}

export interface AuthPayload {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}
