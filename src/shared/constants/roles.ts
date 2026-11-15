/** Role names, same values as the API (src/common/constants/roles.ts). */
export const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type RoleName = (typeof ROLE)[keyof typeof ROLE];
