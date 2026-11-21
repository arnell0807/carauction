# Car Auction

A car auction web app where you can browse listings, place bids and list your own car.

**Live demo:** https://carauction-ten.vercel.app/

## Features

- Browse auctions with search and filters (make, transmission, reserve)
- Sort listings, e.g. ending soonest
- Live countdown on each auction
- Place bids, checked on the database side (minimum increment, auction must still be open)
- List a car for auction with a validated form
- Watchlist saved in the browser
- Falls back to demo listings if the database is unreachable

## Tech stack

React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, TanStack Query, React Router, React Hook Form and Supabase.

## Run locally

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The database schema and seed data are in `supabase/`.

```bash
npm run dev
```
