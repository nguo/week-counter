# replit.md

## Overview

A week calculator application that calculates the number of weeks between two dates. The app features a React frontend with a modern UI component library (shadcn/ui) and an Express.js backend with PostgreSQL database for logging calculations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
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
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation
- **Build**: esbuild for production bundling

The backend uses a layered architecture:
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Data access layer with storage interface
- `server/db.ts` - Database connection configuration
- `shared/schema.ts` - Drizzle schema definitions shared with frontend

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Database schema and Zod validation schemas
- `routes.ts` - API route definitions with type-safe contracts

### Database Schema
Single table `calculation_logs` storing:
- `id` - Serial primary key
- `start_date` - Text field for the start date
- `weeks_result` - Integer for calculated weeks
- `created_at` - Timestamp with default

### Development vs Production
- Development: Vite dev server with HMR, Express serves API
- Production: Vite builds static assets to `dist/public`, Express serves both API and static files

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries with schema migrations in `./migrations`

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation integration
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

Note: There is also a `main.py` Flask application in the root that appears to be an alternative/legacy implementation and is not part of the primary TypeScript stack.