export const ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  notes: '/notes',
  posts: '/posts',
  allNotes: '/all-notes',
  users: '/users',
  interests: '/interests',
} as const;

/** Where the app opens after login, and where `/` goes. */
export const HOME_ROUTE = ROUTES.notes;
