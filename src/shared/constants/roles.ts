export const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type RoleName = (typeof ROLE)[keyof typeof ROLE];
