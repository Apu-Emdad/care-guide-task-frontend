import { IconUsers, type Icon } from '@tabler/icons-react';
import { ROLE, type RoleName } from './roles';
import { ROUTES } from './routes';

/** A parent may have no url; a leaf must have one. */
export interface NavItem {
  label: string;
  url?: string;
  /** Top-level items need one, since the collapsed sidebar shows only icons. */
  icon?: Icon;
  /** Roles that see the link. Left out means everyone. */
  roles?: RoleName[];
  children?: NavItem[];
}

/**
 * Sidebar links
 *
 * Nested to any depth through `children`.
 * Hiding a link only hides the UI: the API guards the route.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Users',
    url: ROUTES.users,
    icon: IconUsers,
    roles: [ROLE.ADMIN],
  },
];
