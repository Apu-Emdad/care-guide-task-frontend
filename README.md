# Care Guide

[![CI](https://github.com/Apu-Emdad/care-guide-task-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Apu-Emdad/care-guide-task-frontend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Frontend of Care Guide, a secure notes app. It uses [care-guide-task-backend](https://github.com/Apu-Emdad/care-guide-task-backend) as the API.

## Features

- **Auth:** register, log in with user name or email, log out. The refresh cookie restores the session after a reload, and an expired token refreshes by itself.
- **Roles:** a `USER` sees My notes and Posts. An `ADMIN` also sees All notes, Users and Interests. Hiding links only hides the UI: the API checks the role on every request.
- **My notes:** private notes with search, paging, view, create, edit and delete.
- **Posts:** everyone's posts with search and paging. Only the author can edit or delete. Click an author to see only their posts (the `$lookup` aggregation).
- **Admin:** all notes (view only), users (add, edit, delete, filter by role and interest) and users grouped by interest (the `$group` aggregation).
- **Profile:** change name, user name, email and password.

## Tech stack

| Area         | Tools                                    |
| ------------ | ---------------------------------------- |
| Build        | Vite, TypeScript, Node.js 24             |
| UI           | React 19, Mantine, Tabler Icons          |
| Routing      | React Router                             |
| Server data  | TanStack Query, Axios                    |
| Client state | Redux Toolkit (auth session)             |
| Forms        | React Hook Form, Zod                     |
| Tooling      | Yarn 4, oxlint, Prettier, GitHub Actions |

## Installation

### 1. Requirements

- Node.js 24 (with [nvm](https://github.com/nvm-sh/nvm): `nvm install 24`)
- Corepack, which ships with Node and provides Yarn 4: `corepack enable`
- The [care-guide-task-backend](https://github.com/Apu-Emdad/care-guide-task-backend) API running on `http://localhost:5000`

### 2. Clone the repository

```bash
git clone https://github.com/Apu-Emdad/care-guide-task-frontend.git
cd care-guide-task-frontend
```

### 3. Install dependencies

```bash
nvm use
yarn install
```

### 4. Configure the environment

```bash
cp .env.example .env
```

### 5. Run the app

```bash
yarn start:dev
```

Open `http://localhost:5001`.

## Project structure

```
src/
  app/          providers, router, Redux store
  theme/        Mantine theme and global styles
  features/     one folder per page area
    auth/       login, register, guards, session state
    notes/      My notes and the admin All notes page
    posts/      posts and the author filter
    users/      admin users page
    interests/  admin users-by-interest page
    profile/    the user's own details and password
  shared/
    api/        Axios client with token refresh, Result types
    components/ shared UI and the app layout
    constants/  roles, routes, interests, sidebar links
    utils/      formatting helpers
```

## License

[MIT](LICENSE) © Emdadul Haque Apu
