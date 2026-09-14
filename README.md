# Tracks n Plates

Private music collection library for CDs and vinyl records. The first stage uses mock repositories so the UI and domain model are ready for a future backend without coupling the features to a data provider.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173/`.

## YouTube playlist import

The import uses the YouTube Data API v3. Configure it locally before using the import button:

1. In Google Cloud Console, create or select a project.
2. Enable **YouTube Data API v3**.
3. Create an API key and restrict it to the YouTube Data API.
4. Copy `.env.example` to `.env.local` and set the key:

```bash
cp .env.example .env.local
```

Then replace `your-youtube-data-api-key` in `.env.local` and restart Vite with `npm run dev`. Never commit `.env.local` or expose an unrestricted API key. Because this is currently a frontend-only prototype, the key is technically visible in browser requests; a backend proxy should be used before production.

## Checks

```bash
npm run build
npm run lint
npm test
```

The current application includes a responsive collection view with search and media/favorite filters, plus album detail pages showing tracks and separate physical copies.
