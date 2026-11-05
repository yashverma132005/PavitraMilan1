# Pavitra Milan

Pavitra Milan is a matrimonial platform with a React web client and an Express API. The app includes account access, profile creation and browsing, interests, matches, reporting, and profile settings.

## Stack

- **Client:** React, Vite, React Router, Axios, Clerk
- **API:** Node.js, Express, Clerk middleware
- **Database:** PostgreSQL with Prisma
- **Image storage:** Cloudinary

## Project layout

```text
client/   React application
server/   Express API and Prisma schema
```

## Prerequisites

- Node.js and npm
- A PostgreSQL database
- Clerk keys for authentication
- Cloudinary credentials for image storage

## Configuration

Copy the example environment files and fill in your own values:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

Set the database URLs, Clerk keys, and Cloudinary credentials in `server/.env`. Set the Clerk publishable key and API origin in `client/.env`. Keep real `.env` files private; they are ignored by Git.

## Run locally

In one terminal, install and start the API:

```powershell
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

In another terminal, install and start the client:

```powershell
cd client
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000` by default. The API health endpoint is `http://localhost:5000/api/health`.

## Available commands

### Client (`client/`)

- `npm run dev` — start the Vite development server
- `npm run build` — build the production client
- `npm run lint` — run ESLint
- `npm run preview` — preview a production build

### API (`server/`)

- `npm run dev` — start the API with nodemon
- `npm start` — start the API
- `npm run db:generate` — generate the Prisma client
- `npm run db:push` — apply the Prisma schema to the configured database
- `npm run db:studio` — open Prisma Studio
- `npm run seed` — load the sample data

