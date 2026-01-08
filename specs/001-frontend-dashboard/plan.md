# Implementation Plan: Event Ticket Analytics Dashboard

**Branch**: `001-frontend-dashboard` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-dashboard/spec.md`

## Summary

Build a Next.js frontend application for visualizing event ticket data with analytics capabilities. The application will use mock data services to simulate backend API integration, focusing on clean UI/UX, data visualization, and responsive design. Core features include event/performance discovery, price history analytics with interactive charts, availability tracking, and an interactive SVG seat map.

**Technical Approach**: Next.js App Router with TypeScript, SHADCN UI components, Recharts for data visualization, and D3.js for seat map rendering. Mock data layer simulates API responses with realistic patterns and latency.

## Technical Context

**Language/Version**: TypeScript 5.x, JavaScript ES2022  
**Primary Dependencies**: Next.js 16.1.1, React 19.2.3, SHADCN UI, Tailwind CSS v4, Recharts 2.x, D3.js 7.x, TanStack Query 5.x  
**Storage**: Browser sessionStorage for client-side state, no database (mock data only)  
**Testing**: Vitest (unit), React Testing Library (component), Playwright (E2E)  
**Target Platform**: Modern web browsers (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+)  
**Project Type**: Web application (frontend-only, single project)  
**Performance Goals**: Lighthouse 90+ (desktop), 80+ (mobile), <500ms chart rendering, <1s seat map rendering  
**Constraints**: <500KB gzipped bundle, <200ms API simulation latency, WCAG 2.1 AA compliance  
**Scale/Scope**: ~50 components, 15-20 pages/routes, support 320px-2560px viewports

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS - No constitution file exists for this project; default web application best practices apply.

Since no constitution file is defined, this implementation follows standard Next.js and React best practices:
- Component-based architecture with reusable UI components
- Type safety with TypeScript
- Mock data services abstracted for future backend integration
- Standard testing approach (unit, component, E2E)
- No business logic in frontend (principle adhered to per requirements)

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-dashboard/
├── plan.md              # This file
├── research.md          # Technical decisions and library selections
├── data-model.md        # TypeScript interfaces for domain entities
├── quickstart.md        # Development setup and testing guide
├── contracts/           # Mock API response schemas
└── tasks.md             # Detailed implementation task breakdown
```

### Source Code (repository root)

```text
experia-scraper-fe/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with navigation
│   ├── page.tsx                   # Homepage (events list)
│   ├── globals.css                # Global styles & Tailwind config
│   ├── events/
│   │   ├── page.tsx               # Events listing page
│   │   └── [eventId]/
│   │       ├── page.tsx           # Event detail page
│   │       └── performances/
│   │           └── [performanceId]/
│   │               ├── page.tsx   # Performance detail
│   │               ├── analytics/
│   │               │   └── page.tsx # Analytics dashboard
│   │               └── seat-map/
│   │                   └── page.tsx # Interactive seat map
│   └── compare/
│       └── page.tsx               # Performance comparison
├── components/
│   ├── ui/                        # SHADCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── tooltip.tsx
│   │   └── [other SHADCN components]
│   ├── layout/
│   │   ├── navbar.tsx             # Main navigation
│   │   ├── footer.tsx             # Footer component
│   │   └── breadcrumb.tsx         # Breadcrumb navigation
│   ├── events/
│   │   ├── event-card.tsx         # Event display card
│   │   ├── event-grid.tsx         # Events grid layout
│   │   ├── event-search.tsx       # Search input component
│   │   └── event-filters.tsx      # Filter sidebar
│   ├── performances/
│   │   ├── performance-card.tsx   # Performance card
│   │   ├── performance-list.tsx   # Performance listing
│   │   └── availability-badge.tsx # Availability indicator
│   ├── analytics/
│   │   ├── price-history-chart.tsx      # Price trends chart
│   │   ├── availability-heatmap.tsx     # Availability heatmap
│   │   ├── comparison-table.tsx         # Performance comparison
│   │   ├── selling-velocity-card.tsx    # Velocity metrics
│   │   └── trend-indicator.tsx          # Up/down trend arrows
│   ├── seat-map/
│   │   ├── seat-map-svg.tsx       # Main SVG seat visualization
│   │   ├── seat-tooltip.tsx       # Seat detail tooltip
│   │   ├── seat-legend.tsx        # Color legend
│   │   ├── zoom-controls.tsx      # Zoom/pan controls
│   │   └── section-highlight.tsx  # Section highlighting
│   └── shared/
│       ├── loading-skeleton.tsx   # Loading states
│       ├── error-boundary.tsx     # Error handling
│       └── empty-state.tsx        # Empty state messages
├── lib/
│   ├── services/
│   │   └── mock/
│   │       ├── events.mock.ts           # Event mock data generator
│   │       ├── performances.mock.ts     # Performance mock data
│   │       ├── seats.mock.ts            # Seat/section mock data
│   │       ├── analytics.mock.ts        # Analytics mock data
│   │       ├── venues.mock.ts           # Venue mock data
│   │       └── api-client.ts            # Mock API client with delays
│   ├── types/
│   │   ├── event.ts               # Event TypeScript interfaces
│   │   ├── performance.ts         # Performance interfaces
│   │   ├── seat.ts                # Seat/section interfaces
│   │   ├── analytics.ts           # Analytics data interfaces
│   │   └── venue.ts               # Venue interfaces
│   └── utils/
│       ├── date-formatter.ts      # Date formatting utilities
│       ├── price-formatter.ts     # Price formatting
│       ├── csv-export.ts          # CSV export utility
│       └── validators.ts          # Input validation
├── hooks/
│   ├── use-events.ts              # Events data fetching hook
│   ├── use-performances.ts        # Performances data fetching
│   ├── use-analytics.ts           # Analytics data fetching
│   ├── use-seat-map.ts            # Seat map data fetching
│   └── use-debounce.ts            # Debounce hook for search
├── public/
│   ├── seat-maps/                 # SVG venue layouts (optional)
│   └── images/                    # Event thumbnails, icons
├── tests/
│   ├── unit/                      # Vitest unit tests
│   │   ├── utils/
│   │   └── services/
│   ├── component/                 # React Testing Library tests
│   │   ├── events/
│   │   ├── analytics/
│   │   └── seat-map/
│   └── e2e/                       # Playwright E2E tests
│       ├── event-discovery.spec.ts
│       ├── analytics.spec.ts
│       └── seat-map.spec.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

**Structure Decision**: Frontend-only web application using Next.js App Router. This is a single project structure focused on the presentation layer. All business logic and data processing will be handled by the backend (currently simulated via mock services). The `/app` directory uses Next.js file-based routing conventions, while `/components`, `/lib`, and `/hooks` follow React best practices for code organization.

## Complexity Tracking

**Status**: ✅ NO VIOLATIONS

This implementation adheres to simplicity principles:
- No unnecessary abstractions or patterns
- Standard Next.js/React architecture
- SHADCN UI used as-is (no custom component library)
- Mock services clearly separated for easy backend integration
- Direct data flow (no complex state management library needed)
