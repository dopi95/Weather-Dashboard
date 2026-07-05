# Weather Dashboard

A full-stack weather dashboard that shows real-time weather conditions and a 5-day forecast for any city in the world — or your current location via GPS.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Backend | Node.js 18+, Express 5 |
| Geocoding | Open-Meteo Geocoding API (no key required) |
| Weather data | Open-Meteo Forecast API (no key required) |
| Reverse geocoding | Nominatim / OpenStreetMap (no key required) |

## Architecture

```
Browser (Next.js)
  ↓  fetch /api/weather, /api/forecast, /api/location
Express Backend (server.js)
  ↓  native fetch (Node 18+)
Open-Meteo API / Nominatim
```

The backend acts as a proxy so the browser never calls third-party APIs directly.

## Project Structure

```
/
├── README.md
├── .gitignore
├── backend/          ← Express API server
│   ├── server.js
│   ├── routes/
│   ├── services/
│   └── middleware/
└── client/           ← Next.js frontend
    └── src/
        ├── app/
        ├── components/
        ├── hooks/
        ├── services/
        └── utils/
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev        # starts on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev        # starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API Endpoints

| Method | Path | Query params | Description |
|---|---|---|---|
| GET | `/api/weather` | `lat`, `lon` | Current weather conditions |
| GET | `/api/forecast` | `lat`, `lon` | 5-day daily forecast |
| GET | `/api/location` | `q` | Geocode a city name → lat/lon |
| GET | `/api/location/reverse` | `lat`, `lon` | Reverse geocode lat/lon → city |

## Frontend Features

- **Search** — type a city name and press Enter or click Search
- **Geolocation** — click the 📍 button to use your current location
- **Unit toggle** — switch between °C and °F (conversion done client-side, no re-fetch)
- **Recent searches** — last 5 successful searches saved in `localStorage`
- **Dynamic backgrounds** — gradient changes based on current weather condition and time of day
- **5-day forecast** — daily high/low and weather icon for the next 5 days

## Weather Theme Reference

| Condition | Background |
|---|---|
| Clear sky (day) | Yellow → Orange |
| Cloudy | Slate → Light blue |
| Fog | Gray → Dark gray |
| Rain / Drizzle | Blue → Slate |
| Snow | Light blue → White |
| Rain showers | Blue → Slate |
| Thunderstorm | Dark purple → Slate |
| Night (18:00–06:00) | Deep indigo → Slate dark |

## Error Handling

- **Invalid city** — shown when geocoding returns no results
- **Network error** — shown when the backend or an upstream API is unreachable
- **Backend 500** — shown with a user-friendly message and a retry hint
- **Empty search** — the search button is disabled until at least one character is typed

## Notes

- No API keys are required. Open-Meteo and Nominatim are free and open.
- Favorite cities feature is out of scope for this version.
- AQI, UV index, hourly forecast, and map view are out of scope.
