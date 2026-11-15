import type { InterestName } from '@/shared/constants/interests';

export interface InterestUser {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
}

/** One interest from the grouped aggregation: its user count and one page of its users. */
export interface InterestGroup {
  interest: InterestName;
  count: number;
  users: InterestUser[];
}

/** Paging of the users inside every group. Same fields as the API's UsersByInterestQueryDto. */
export interface InterestsFiltersState {
  page: number;
  pageSize: number;
}
