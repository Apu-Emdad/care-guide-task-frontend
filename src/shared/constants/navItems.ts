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

export interface NavItem {
  label: string;
  url?: string;
  icon?: Icon;
  roles?: RoleName[];
  children?: NavItem[];
}

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
