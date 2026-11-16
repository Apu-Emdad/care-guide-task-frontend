export const INTEREST = {
  MUSIC: 'MUSIC',
  TRAVEL: 'TRAVEL',
  SPORTS: 'SPORTS',
  READING: 'READING',
  MOVIES: 'MOVIES',
} as const;

export type InterestName = (typeof INTEREST)[keyof typeof INTEREST];
