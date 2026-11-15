import {
  IconHeart,
  IconNews,
  IconNotebook,
  IconNotes,
  IconUsers,
  type Icon,
} from '@tabler/icons-react';
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
 * A USER sees My notes and Posts. An ADMIN also sees All notes, Users and Interests.
 * Hiding a link only hides the UI: the API guards the route.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'My notes', url: ROUTES.notes, icon: IconNotes },
  { label: 'Posts', url: ROUTES.posts, icon: IconNews },
  {
    label: 'All notes',
    url: ROUTES.allNotes,
    icon: IconNotebook,
    roles: [ROLE.ADMIN],
  },
  {
    label: 'Users',
    url: ROUTES.users,
    icon: IconUsers,
    roles: [ROLE.ADMIN],
  },
  {
    label: 'Interests',
    url: ROUTES.interests,
    icon: IconHeart,
    roles: [ROLE.ADMIN],
  },
];
