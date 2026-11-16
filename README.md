# Care Guide Frontend

- **Frontend:** https://care-guide-by-apu-emdad.netlify.app
- **Swagger docs:** https://16-178-61-240.sslip.io/api/docs

> [!TIP]
> **No need to copy tokens in Swagger.** After you register or log in, Swagger fills in the access token for you. When it expires, Swagger refreshes it and sends your request again.

## Features

- **Auth:** register, log in with user name or email, log out. The refresh cookie restores the session after a reload, and an expired token refreshes by itself.
- **Roles:** a `USER` sees My notes and Posts. An `ADMIN` also sees All notes, Users and Interests.
- **My notes:** private notes with search, paging, view, create, edit and delete.
- **Posts:** everyone's posts with search and paging. Only the author can edit or delete. Click an author to see only their posts (the `$lookup` aggregation).
- **Admin:** all notes (view only), users (add, edit, delete, filter by role and interest) and users grouped by interest (the `$group` aggregation).
- **Profile:** change name, user name, email and password.

## Tech stack

Node 24, React 19, TypeScript, Mantine, TanStack Query, Redux Toolkit, React Hook Form, Zod.

## Project structure

```
.github/
  workflows/
    ci.yml      lint, format check, typecheck and build on every push to main and every pull request
src/
  app/          providers, router, Redux store
  features/     one folder per page area
    auth/       login, register, guards, session state
    interests/  admin users-by-interest page
    notes/      My notes and the admin All notes page
    posts/      posts and the author filter
    profile/    the user's own details and password
    users/      admin users page
  shared/
    api/        Axios client with token refresh, Result types
    components/ shared UI and the app layout
    constants/  roles, routes, interests, sidebar links
    utils/      formatting helpers
  theme/        Mantine theme and global styles
```

## Installation

### 1. Requirements

- Node.js 24 (with [nvm](https://github.com/nvm-sh/nvm): `nvm install 24`)
- Corepack, which ships with Node and provides Yarn 4: `corepack enable`

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

## License

[MIT](LICENSE) © Emdadul Haque Apu
