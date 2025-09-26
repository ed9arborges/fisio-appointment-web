# Fisio Appointment Web

Modern React frontend for the Fisio Appointment platform. It provides a calendar-driven interface for creating, listing, and managing physiotherapy appointments.

## Features

- Day picker with period-based appointment visualization
- Real-time slot availability synced with the API
- Appointment creation form with validation feedback
- Delete interactions with optimistic UI updates
- Responsive layout tailored for desktop and tablet usage

## Prerequisites

- Node.js 18 or newer
- The backend API running locally on `http://localhost:3333`

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and point it at your API (Render URL in production):

   ```env
   VITE_API_BASE_URL=http://localhost:3333
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Vite will expose the app on `http://localhost:5173` by default.

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview the production build locally**

   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` – start Vite in development mode
- `npm run build` – type-check, then build the app for production
- `npm run preview` – serve the production build locally
- `npm run lint` – run ESLint with the project configuration

## API Configuration

Set `VITE_API_BASE_URL` to the Render (or other host) URL in `.env` before building. The value is baked into the bundle at build time.

## Project Structure

```
web/
├── src/
│   ├── api/                  # API client wrappers
│   ├── components/           # Reusable UI building blocks
│   │   ├── basic/            # Buttons, inputs, typography
│   │   ├── Calendar/         # Calendar widgets
│   │   └── layouts/          # Page layout composites
│   ├── pages/                # Page-level components
│   ├── assets/               # Images and SVGs
│   ├── App.tsx               # App routes
│   └── main.tsx              # React bootstrap
├── public/                   # Static assets served by Vite
├── vite.config.ts            # Vite configuration with alias & plugins
└── package.json
```

## Styling & Tooling

- Tailwind CSS v4 with the Vite plugin powers utility-first styling.
- Components leverage Class Variance Authority for consistent variants.
- SVG assets are imported with `vite-plugin-svgr` for inline usage.

## Development Tips

- Keep the API server running so slot availability and appointment data load correctly.
- Use the page at `/appointments` to view, filter, and delete appointments for specific days.
- Run `npm run lint` before committing to catch common issues.
- Consider adjusting Tailwind configuration in `tailwind.config.ts` or `vite.config.ts` when introducing new design tokens.
