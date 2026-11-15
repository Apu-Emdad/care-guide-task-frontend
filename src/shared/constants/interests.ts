/** Interest names, same values as the API (src/common/constants/interests.ts). */
export const INTEREST = {
  MUSIC: 'MUSIC',
  TRAVEL: 'TRAVEL',
  SPORTS: 'SPORTS',
  READING: 'READING',
  MOVIES: 'MOVIES',
} as const;

export type InterestName = (typeof INTEREST)[keyof typeof INTEREST];
