# Tasks: Event Ticket Analytics Dashboard

**Input**: Design documents from `/specs/001-frontend-dashboard/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: OPTIONAL - Included test tasks as per testing strategy in research.md (Vitest unit, React Testing Library component, Playwright E2E). Tests can be implemented if desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/` for pages
- **Components**: `components/` with subdirectories (ui, layout, events, analytics, seat-map, shared)
- **Library**: `lib/` with subdirectories (services/mock, types, utils)
- **Hooks**: `hooks/`
- **Tests**: `tests/` with subdirectories (unit, component, e2e)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and base configuration

- [ ] T001 Initialize Next.js 16 project with TypeScript and App Router in repository root
- [ ] T002 Install production dependencies (React 19, TanStack Query 5, Recharts 2, D3.js 7, date-fns 3, lucide-react) in package.json
- [ ] T003 [P] Install dev dependencies (Vitest, Testing Library, Playwright, types) in package.json
- [ ] T004 [P] Configure Tailwind CSS v4 in tailwind.config.ts and app/globals.css
- [ ] T005 [P] Configure TypeScript compiler options in tsconfig.json
- [ ] T006 [P] Configure ESLint with Next.js and accessibility rules in eslint.config.mjs
- [ ] T007 Initialize SHADCN UI with default configuration (npx shadcn@latest init)
- [ ] T008 [P] Install SHADCN components (button, card, input, label, badge, table, pagination, select, dialog, dropdown-menu, separator, tabs, switch, slider, popover, tooltip, skeleton, alert, scroll-area, command, breadcrumb) in components/ui/
- [ ] T009 [P] Create .env.local with NEXT_PUBLIC_API_URL, NEXT_PUBLIC_MOCK_DELAY_MS, feature flags
- [ ] T010 [P] Configure Vitest in vitest.config.ts
- [ ] T011 [P] Configure Playwright in playwright.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### TypeScript Interfaces (from data-model.md)

- [ ] T012 [P] Create Event and EventType interfaces in lib/types/event.ts
- [ ] T013 [P] Create Performance, PerformanceStatus, PriceRange, PerformanceMetadata interfaces in lib/types/performance.ts
- [ ] T014 [P] Create Section, PriceTier, SectionLocation, Row interfaces in lib/types/section.ts
- [ ] T015 [P] Create Seat, SeatStatus, Coordinates, SeatFeatures interfaces in lib/types/seat.ts
- [ ] T016 [P] Create PriceHistory, PriceChangeType, PriceAnalytics interfaces in lib/types/analytics.ts
- [ ] T017 [P] Create Venue, Address, VenueLayout, VenueType, SeatMapData, SeatMapSection interfaces in lib/types/venue.ts
- [ ] T018 [P] Create AvailabilityTrend, AvailabilityDataPoint, ComparisonData, PerformanceComparison, SectionComparison, ValueRating interfaces in lib/types/analytics.ts
- [ ] T019 [P] Create EventFilters, AvailabilityFilter, SortOption interfaces in lib/types/filters.ts
- [ ] T020 [P] Create ChartData, ChartDataset interfaces in lib/types/chart.ts
- [ ] T021 Create index.ts barrel export in lib/types/index.ts

### Utility Functions

- [ ] T022 [P] Implement date formatting utilities (formatDate, formatTime, formatDateRange, formatRelativeTime) in lib/utils/date-formatter.ts
- [ ] T023 [P] Implement price formatting utilities (formatPrice, formatPriceRange, formatPriceChange) in lib/utils/price-formatter.ts
- [ ] T024 [P] Implement input validators (validateEventFilters, validatePerformanceId) in lib/utils/validators.ts

### Mock API Client Infrastructure

- [ ] T025 Create MockApiClient class with simulateDelay method in lib/services/mock/api-client.ts
- [ ] T026 [P] Implement events mock data generator (generateMockEvents, generateMockEvent) in lib/services/mock/events.mock.ts
- [ ] T027 [P] Implement venues mock data generator (generateMockVenues, generateMockVenue) in lib/services/mock/venues.mock.ts
- [ ] T028 Implement performances mock data generator (generateMockPerformances, generateMockPerformance) in lib/services/mock/performances.mock.ts
- [ ] T029 [P] Implement sections mock data generator (generateMockSections) in lib/services/mock/sections.mock.ts
- [ ] T030 Implement seats mock data generator (generateMockSeats with coordinates) in lib/services/mock/seats.mock.ts
- [ ] T031 Implement analytics mock data generator (generatePriceHistory, generateAvailabilityTrend) in lib/services/mock/analytics.mock.ts
- [ ] T032 Complete MockApiClient with all endpoint methods (getEvents, getEvent, getPerformance, getSeatMap, getPriceHistory, getAvailability, comparePerformances, getVenue) in lib/services/mock/api-client.ts

### TanStack Query Setup

- [ ] T033 Create QueryClientProvider wrapper with staleTime configuration in app/providers.tsx
- [ ] T034 Implement useDebounce hook in hooks/use-debounce.ts

### Layout Components

- [ ] T035 Create root layout with providers, fonts, and global styles in app/layout.tsx
- [ ] T036 [P] Implement Navbar component with navigation links in components/layout/navbar.tsx
- [ ] T037 [P] Implement Footer component in components/layout/footer.tsx
- [ ] T038 [P] Implement Breadcrumb navigation component in components/layout/breadcrumb.tsx

### Shared Components

- [ ] T039 [P] Implement LoadingSkeleton component (card, list, chart, seat-map variants) in components/shared/loading-skeleton.tsx
- [ ] T040 [P] Implement ErrorBoundary component with error state UI in components/shared/error-boundary.tsx
- [ ] T041 [P] Implement EmptyState component for no results in components/shared/empty-state.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Event & Performance Discovery (Priority: P1) 🎯 MVP

**Goal**: Users can discover and explore available events and performances to find tickets

**Independent Test**: Navigate to events page, search for events, filter results, view event details, access performance information

### Data Fetching Hooks for US1

- [ ] T042 [P] [US1] Implement useEvents hook with TanStack Query in hooks/use-events.ts
- [ ] T043 [P] [US1] Implement usePerformances hook with TanStack Query in hooks/use-performances.ts

### Event Components

- [ ] T044 [P] [US1] Implement EventCard component (thumbnail, name, venue, date range, status badge) in components/events/event-card.tsx
- [ ] T045 [P] [US1] Implement AvailabilityBadge component (on_sale, selling_fast, sold_out) in components/performances/availability-badge.tsx
- [ ] T046 [US1] Implement EventGrid component with responsive layout in components/events/event-grid.tsx
- [ ] T047 [US1] Implement EventSearch component with debounced input in components/events/event-search.tsx
- [ ] T048 [US1] Implement EventFilters sidebar component (date range, venue, event type) in components/events/event-filters.tsx

### Performance Components

- [ ] T049 [P] [US1] Implement PerformanceCard component (date, time, availability, price range) in components/performances/performance-card.tsx
- [ ] T050 [US1] Implement PerformanceList component with sorting in components/performances/performance-list.tsx

### Pages for US1

- [ ] T051 [US1] Implement homepage with hero section and featured events in app/page.tsx
- [ ] T052 [US1] Implement events listing page with search, filters, and grid in app/events/page.tsx
- [ ] T053 [US1] Implement event detail page with metadata and performances list in app/events/[eventId]/page.tsx
- [ ] T054 [US1] Implement performance detail page with sections table and availability summary in app/events/[eventId]/performances/[performanceId]/page.tsx

### Error and Loading States for US1

- [ ] T055 [US1] Add loading skeletons to events listing page in app/events/page.tsx
- [ ] T056 [US1] Add error handling with retry for event/performance pages

**Checkpoint**: User Story 1 complete - users can browse events, search, filter, and view performance details

---

## Phase 4: User Story 2 - Analytics & Data Visualization (Priority: P2)

**Goal**: Users can analyze pricing trends and availability patterns for informed purchasing decisions

**Independent Test**: Navigate to analytics views, select time ranges, compare sections, view availability heatmaps, export comparison data

### Data Fetching Hooks for US2

- [ ] T057 [P] [US2] Implement useAnalytics hook for price history and availability in hooks/use-analytics.ts

### Analytics Components

- [ ] T058 [P] [US2] Implement TrendIndicator component (up/down arrows with percentages) in components/analytics/trend-indicator.tsx
- [ ] T059 [US2] Implement PriceHistoryChart component with Recharts (line chart, time range selector, section filter, tooltips) in components/analytics/price-history-chart.tsx
- [ ] T060 [US2] Implement AvailabilityHeatmap component with color-coded visualization in components/analytics/availability-heatmap.tsx
- [ ] T061 [US2] Implement SellingVelocityCard component (seats/hour metrics, projected sellout) in components/analytics/selling-velocity-card.tsx
- [ ] T062 [US2] Implement ComparisonTable component for side-by-side performance comparison in components/analytics/comparison-table.tsx

### CSV Export Utility

- [ ] T063 [US2] Implement CSV export utility (convertToCSV, downloadCSV) in lib/utils/csv-export.ts

### Pages for US2

- [ ] T064 [US2] Implement analytics dashboard page with charts and metrics in app/events/[eventId]/performances/[performanceId]/analytics/page.tsx
- [ ] T065 [US2] Implement compare page with multi-performance selection and export in app/compare/page.tsx

### Interactive Chart Features

- [ ] T066 [US2] Add time range selector (24h, 7d, 30d, all) to PriceHistoryChart in components/analytics/price-history-chart.tsx
- [ ] T067 [US2] Add multi-section comparison toggle to PriceHistoryChart in components/analytics/price-history-chart.tsx
- [ ] T068 [US2] Add interactive tooltips with price/timestamp/section details to charts

**Checkpoint**: User Story 2 complete - users can analyze price history, view availability trends, compare performances, and export data

---

## Phase 5: User Story 3 - Interactive Seat Map (Priority: P3)

**Goal**: Users can visualize venue layout and see seat-level details for purchase decisions

**Independent Test**: Navigate to seat map, interact with visualization (zoom, pan, hover), view seat details and legend

### Data Fetching Hook for US3

- [ ] T069 [US3] Implement useSeatMap hook for seat data and layout in hooks/use-seat-map.ts

### Seat Map Components (D3.js)

- [ ] T070 [US3] Implement SeatMapSVG component with D3.js rendering (2000+ seats, color-coded by price tier) in components/seat-map/seat-map-svg.tsx
- [ ] T071 [US3] Implement SeatTooltip component (seat number, section, row, price, availability) in components/seat-map/seat-tooltip.tsx
- [ ] T072 [US3] Implement SeatLegend component (price tier colors, availability indicators) in components/seat-map/seat-legend.tsx
- [ ] T073 [US3] Implement ZoomControls component (+/- buttons, fit-to-view, reset) in components/seat-map/zoom-controls.tsx
- [ ] T074 [US3] Implement SectionHighlight component for hover/focus effects in components/seat-map/section-highlight.tsx

### Seat Map Interactions

- [ ] T075 [US3] Add zoom behavior to SeatMapSVG using D3 zoom in components/seat-map/seat-map-svg.tsx
- [ ] T076 [US3] Add pan/drag behavior to SeatMapSVG in components/seat-map/seat-map-svg.tsx
- [ ] T077 [US3] Add hover tooltip trigger for individual seats in components/seat-map/seat-map-svg.tsx
- [ ] T078 [US3] Add touch gesture support for mobile zoom/pan in components/seat-map/seat-map-svg.tsx

### Seat Map Page

- [ ] T079 [US3] Implement seat map page with full visualization and controls in app/events/[eventId]/performances/[performanceId]/seat-map/page.tsx
- [ ] T080 [US3] Add responsive scaling for mobile viewports in seat map page

**Checkpoint**: User Story 3 complete - users can view interactive seat map, zoom/pan, hover for details, and understand pricing via legend

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Accessibility (WCAG 2.1 AA)

- [ ] T081 [P] Add keyboard navigation to all interactive elements (EventGrid, charts, seat map)
- [ ] T082 [P] Add ARIA labels to icon buttons, charts, and complex widgets
- [ ] T083 [P] Verify color contrast ratio ≥ 4.5:1 for all text
- [ ] T084 [P] Add focus indicators to all focusable elements
- [ ] T085 Add skip links for keyboard users in app/layout.tsx

### Performance Optimization

- [ ] T086 [P] Implement React.lazy for heavy components (PriceHistoryChart, SeatMapSVG)
- [ ] T087 [P] Add useMemo for expensive calculations in analytics components
- [ ] T088 [P] Optimize seat map rendering with virtualization or chunking for 2000+ seats
- [ ] T089 Configure @next/bundle-analyzer and verify <500KB gzipped bundle

### Error Handling & Edge Cases

- [ ] T090 Handle no events match search/filter (empty state with clear filters button)
- [ ] T091 Handle insufficient analytics data (<2 data points message)
- [ ] T092 Handle seat map load failure (error state with retry and section-level fallback)
- [ ] T093 Handle sold out performances (clear sold out status, historical data only)

### Responsive Design Validation

- [ ] T094 Verify responsive layouts from 320px to 2560px viewports
- [ ] T095 Mobile navigation hamburger menu in components/layout/navbar.tsx
- [ ] T096 Responsive chart legend positions and touch interactions

---

## Phase 7: Testing (OPTIONAL)

**Purpose**: Comprehensive testing per research.md strategy

### Unit Tests (Vitest)

- [ ] T097 [P] Unit tests for date-formatter utilities in tests/unit/utils/date-formatter.test.ts
- [ ] T098 [P] Unit tests for price-formatter utilities in tests/unit/utils/price-formatter.test.ts
- [ ] T099 [P] Unit tests for csv-export utilities in tests/unit/utils/csv-export.test.ts
- [ ] T100 [P] Unit tests for validators in tests/unit/utils/validators.test.ts
- [ ] T101 [P] Unit tests for mock data generators in tests/unit/services/mock.test.ts

### Component Tests (React Testing Library)

- [ ] T102 [P] Component tests for EventCard in tests/component/events/event-card.test.tsx
- [ ] T103 [P] Component tests for EventGrid with search/filter in tests/component/events/event-grid.test.tsx
- [ ] T104 [P] Component tests for PriceHistoryChart interactions in tests/component/analytics/price-history-chart.test.tsx
- [ ] T105 [P] Component tests for SeatMapSVG interactions in tests/component/seat-map/seat-map-svg.test.tsx

### E2E Tests (Playwright)

- [ ] T106 E2E test for event discovery flow (browse → search → filter → view) in tests/e2e/event-discovery.spec.ts
- [ ] T107 E2E test for analytics flow (view charts → change time range → compare) in tests/e2e/analytics.spec.ts
- [ ] T108 E2E test for seat map flow (view map → zoom → hover → pan) in tests/e2e/seat-map.spec.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion (can run parallel with US1)
- **User Story 3 (Phase 5)**: Depends on Foundational completion (can run parallel with US1/US2)
- **Polish (Phase 6)**: Depends on all user stories being complete
- **Testing (Phase 7)**: Can start after corresponding user stories are complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 - Performance detail page from US1 provides navigation context
- **User Story 3 (P3)**: Can start after Phase 2 - Performance detail page from US1 provides navigation context

### Within Each User Story

- Hooks before components that use them
- Smaller/simpler components before complex composite components
- Pages after components they use
- Error/loading states after happy path

### Parallel Opportunities

Within Phase 1:
- T003-T006 (dev deps, tailwind, tsconfig, eslint) can run in parallel
- T008-T011 (shadcn components, env, vitest, playwright) can run in parallel

Within Phase 2:
- T012-T020 (all type interfaces) can run in parallel
- T022-T024 (all utilities) can run in parallel
- T026-T027, T029-T030 (mock generators that don't depend on each other)
- T036-T038 (layout components) can run in parallel
- T039-T041 (shared components) can run in parallel

Within Each User Story:
- Components marked [P] for different files can run in parallel
- Hooks for a story can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all type interfaces together:
Task: "Create Event and EventType interfaces in lib/types/event.ts"
Task: "Create Performance interfaces in lib/types/performance.ts"
Task: "Create Section interfaces in lib/types/section.ts"
Task: "Create Seat interfaces in lib/types/seat.ts"
Task: "Create PriceHistory interfaces in lib/types/analytics.ts"
Task: "Create Venue interfaces in lib/types/venue.ts"

# Launch all utilities together:
Task: "Implement date formatting utilities in lib/utils/date-formatter.ts"
Task: "Implement price formatting utilities in lib/utils/price-formatter.ts"
Task: "Implement input validators in lib/utils/validators.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test event discovery flow independently
5. Deploy/demo if ready (users can browse events and view performance details)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **Deploy MVP (Event Discovery)**
3. Add User Story 2 → Test independently → Deploy (Analytics added)
4. Add User Story 3 → Test independently → Deploy (Seat Map added)
5. Add Polish + Testing → Final validation → Production-ready

### Task Count Summary

| Phase | Task Count | Parallel Tasks |
|-------|------------|----------------|
| Phase 1: Setup | 11 | 8 |
| Phase 2: Foundational | 30 | 24 |
| Phase 3: User Story 1 (P1) | 15 | 6 |
| Phase 4: User Story 2 (P2) | 12 | 2 |
| Phase 5: User Story 3 (P3) | 12 | 0 |
| Phase 6: Polish | 16 | 10 |
| Phase 7: Testing (Optional) | 12 | 10 |
| **Total** | **108** | **60** |

### MVP Scope

- **MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1)**
- Total MVP Tasks: 56
- Delivers: Event browsing, search, filters, event details, performance details

---

## Notes

- [P] tasks = different files, no dependencies on each other
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths assume repository root as working directory
- SHADCN components installed via CLI, not manually coded
- Mock data must maintain referential integrity per data-model.md
