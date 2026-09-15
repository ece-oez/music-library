# 🎵 Tracks n Plates

> A personal digital record shelf for collecting, discovering, and enjoying our CDs and vinyl records.

Tracks n Plates is a private music collection library built for two people who want to keep track of their physical music collection while still enjoying a modern digital music experience.

The application combines album metadata, physical collection items, personal ratings, YouTube playback and a vintage-inspired music library experience.

---

## ✨ Features

### 📚 Music Collection

- Browse your complete CD and vinyl collection
- Search albums and artists
- Filter by media type
- Filter favorites
- Responsive collection grid
- Separate album information from physical collection items
- Support multiple physical copies of the same album

### 💿 Physical Collection

Each physical copy can have its own information:

- Vinyl / CD
- Owner
- Condition
- Personal notes
- Favorite status
- Personal rating

This allows the same album to exist multiple times in the collection.

### 🎵 Album & Track Management

- Album details
- Tracklists
- Individual track ratings
- Album score calculation
- Expandable track information
- Album editing
- Collection item editing

### ▶️ YouTube Integration

- Embedded YouTube playback
- Automatic next-track playback
- Stable player between tracks
- YouTube playlist import
- Import albums and tracks directly from YouTube playlists

### 👤 Personal Experience

- User authentication
- Personal ratings
- Personal favorites
- Individual collection ownership

---

## 🖼️ Screenshots

### Login

<img width="2560" height="1440" alt="image" src="" />

### Collection

<img width="2560" height="1440" alt="image" src="" />

### Album Details

<img width="1920" height="1200" alt="image" src="" />

> More screenshots will be added as the application evolves.

---

## 🚀 Live Demo

The latest version of Tracks n Plates is available as a live demo:

**[🎵 Open Tracks n Plates](https://tracks-n-plates.netlify.app/)**

### Demo accounts

You can try the application without creating an account.

| Username | Password |
|----------|----------|
| `you` | `tracks` |
| `mara` | `plates` |

> The demo currently uses development/mock data. Do not use real or sensitive information.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query

### Development & Testing

- ESLint
- Prettier
- Vitest
- React Testing Library

### Planned

The application is being prepared for a backend-based architecture with:

- Node.js
- TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL
- Docker / Docker Compose

---

## 🏗️ Architecture

The application is designed around a separation between the music domain and the data layer.

A central concept is the separation between an **Album** and a **CollectionItem**.

```text
Album
│
├── Artist
├── Tracks
├── Artwork
└── Metadata
      │
      ▼
CollectionItem
├── Media Type
├── Owner
├── Condition
├── Rating
├── Favorite
└── Personal Notes
