# replit.md

## Overview

A week calculator application that calculates the number of weeks between two dates. The app features a React frontend with a modern UI component library (shadcn/ui) and a simple Express.js backend for serving static files. All calculation logic runs client-side with localStorage for persisting the start date.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React useState/useEffect with localStorage
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Shared utilities in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Purpose**: Static file serving only (no database)
- **Build**: esbuild for production bundling

The backend is minimal:
- `server/routes.ts` - Empty route handler (no API needed)
- `server/index.ts` - Express server setup
- `server/static.ts` - Static file serving for production

### Key Features
- Start date cached in localStorage for persistence across visits
- End date defaults to today (not cached)
- Supports both text entry (MM/DD/YYYY) and calendar picker
- Auto-calculates weeks on page load

### Development vs Production
- Development: Vite dev server with HMR, Express serves static files
- Production: Vite builds static assets to `dist/public`, Express serves static files

## External Dependencies

### Key NPM Packages
- `date-fns` - Date manipulation and week calculations
- `zod` - Runtime type validation
- Radix UI primitives - Accessible UI component foundations
- `wouter` - Lightweight React router

### Build & Development
- `vite` - Frontend build tool and dev server
- `esbuild` - Backend production bundling
- `tsx` - TypeScript execution for development

### Replit-specific
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Development banner

## Running the App

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm run build
npm start
```

No database or environment variables required.
