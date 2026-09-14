# Needle & Groove

Private music collection library for CDs and vinyl records. The first stage uses mock repositories so the UI and domain model are ready for a future backend without coupling the features to a data provider.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173/`.

## Checks

```bash
npm run build
npm run lint
npm test
```

The current application includes a responsive collection view with search and media/favorite filters, plus album detail pages showing tracks and separate physical copies.
