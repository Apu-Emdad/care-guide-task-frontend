import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import {
  GuestOnly,
  RequireAuth,
  RequireRole,
} from '@/features/auth/guards/guards';
import { InterestsPage } from '@/features/interests/pages/InterestsPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { AllNotesPage } from '@/features/notes/pages/AllNotesPage';
import { NotesPage } from '@/features/notes/pages/NotesPage';
import { PostsPage } from '@/features/posts/pages/PostsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { ROLE } from '@/shared/constants/roles';
import { HOME_ROUTE, ROUTES } from '@/shared/constants/routes';
import { NotFoundPage } from './NotFoundPage';

export const routes: RouteObject[] = [
  { path: ROUTES.root, element: <Navigate to={HOME_ROUTE} replace /> },
  {
    element: <GuestOnly />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.profile, element: <ProfilePage /> },
          { path: ROUTES.notes, element: <NotesPage /> },
          { path: ROUTES.posts, element: <PostsPage /> },
          {
            element: <RequireRole role={ROLE.ADMIN} />,
            children: [
              { path: ROUTES.allNotes, element: <AllNotesPage /> },
              { path: ROUTES.users, element: <UsersPage /> },
              { path: ROUTES.interests, element: <InterestsPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
