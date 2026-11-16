import type { InterestName } from '@/shared/constants/interests';

export interface InterestUser {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
}

export interface InterestGroup {
  interest: InterestName;
  count: number;
  users: InterestUser[];
}

export interface InterestsQuery {
  interest?: InterestName;
  page: number;
  pageSize: number;
}
