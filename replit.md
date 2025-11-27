# CareConnect - Healthcare Booking Platform

## Overview

CareConnect is a healthcare booking platform that connects patients with verified physiotherapists, doctors, and home care nurses. The platform enables patients to search for healthcare providers, book appointments (online or home visits), make secure payments, and leave reviews. Providers can manage their profiles, services, availability, and appointments through a dedicated dashboard.

The application follows a modern full-stack architecture with React on the frontend, Express on the backend, and PostgreSQL (via Neon serverless) for data persistence. It emphasizes a trustworthy, clean aesthetic inspired by platforms like Fresha, Calendly, and Zocdoc.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation

**Design System:**
- Typography: Inter (primary), DM Sans (accents)
- Component library using Radix UI for accessibility
- Custom theme system supporting light/dark modes via CSS variables
- Responsive layouts with mobile-first approach
- Tailwind configuration with custom spacing scale (2, 4, 6, 8, 12, 16, 20)

**Key Pages:**
- Home: Hero section with search, service categories, testimonials, stats
- Providers: Searchable/filterable provider listing
- Provider Profile: Detailed provider info, reviews, booking interface
- Patient Dashboard: Appointment management, booking history
- Provider Dashboard: Appointment management, availability settings
- Authentication: Login, register, provider setup

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas (shared between client/server)

**Authentication Flow:**
- JWT-based authentication with access tokens (15-minute expiry)
- Refresh tokens for extended sessions (7-day expiry)
- Cookie-based token storage for web clients
- Role-based access control (patient, provider, admin)
- Middleware for protected routes (`authenticateToken`, `optionalAuth`)

**API Structure:**
- RESTful endpoints organized by resource
- JSON request/response format
- Centralized error handling
- Request logging middleware

**Data Access Layer:**
- Storage interface (`IStorage`) abstracts database operations
- Separate functions for users, providers, services, appointments, reviews, payments
- Complex queries return enriched types (e.g., `ProviderWithUser`, `AppointmentWithDetails`)

### Database Architecture

**Platform**: Neon Serverless PostgreSQL with WebSocket connections

**Schema Design:**

**Core Tables:**
- `users`: User accounts (email, password, role, profile info)
- `providers`: Provider profiles (type, specialization, fees, ratings, location)
- `services`: Services offered by providers
- `time_slots`: Provider availability windows
- `appointments`: Booking records with status tracking
- `reviews`: Patient reviews for providers
- `payments`: Payment transaction records
- `refresh_tokens`: Session management

**Key Relationships:**
- One-to-one: User → Provider
- One-to-many: Provider → Services, Provider → TimeSlots, Provider → Appointments
- Many-to-one: Appointments → Provider, Appointments → Patient

**Enums:**
- User roles: patient, provider, admin
- Provider types: physiotherapist, doctor, nurse
- Appointment statuses: pending, confirmed, completed, cancelled, rescheduled
- Visit types: online, home, clinic
- Payment statuses: pending, completed, refunded, failed

**Data Integrity:**
- Foreign key constraints with cascading deletes
- Unique constraints on email addresses
- Default values for timestamps and status fields
- UUID primary keys via `gen_random_uuid()`

### External Dependencies

**Database:**
- Neon Serverless PostgreSQL
- Connection pooling via `@neondatabase/serverless`
- WebSocket-based connections for serverless environments

**UI Component Library:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui configuration for styled component variants
- Custom theming via CSS variables and Tailwind

**Development Tools:**
- Vite for frontend bundling and HMR
- esbuild for server-side bundling in production
- Drizzle Kit for database migrations
- TypeScript for type safety across the stack

**Build Process:**
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles Express app to `dist/index.cjs`
- Selected dependencies bundled to reduce cold start times
- Shared types and schemas between client/server via `shared/` directory

**Path Aliases:**
- `@/*`: Client source files
- `@shared/*`: Shared types and schemas
- `@assets/*`: Static assets

**Environment Requirements:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: JWT signing key (defaults to development key)
- `NODE_ENV`: Environment mode (development/production)