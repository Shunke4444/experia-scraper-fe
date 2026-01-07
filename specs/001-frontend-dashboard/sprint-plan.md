# 4-Week Sprint Plan: Event Ticket Analytics Dashboard Frontend

**Feature**: 001-frontend-dashboard  
**Sprint Duration**: 4 weeks (28 days)  
**Date Created**: 2026-01-07  
**Status**: Planning Phase  
**Team Velocity**: 4 weeks  
**Scope**: P1 (Event Discovery) + P2 (Analytics & Visualization)  

---

## Executive Summary

This sprint delivers a functional **Event Ticket Analytics Dashboard** enabling users to browse events, filter performances, and analyze pricing/availability trends through interactive charts. The application uses mock data to simulate API responses and supports both dark and light modes with responsive design across all viewports.

**Out of Scope**: Interactive seat map visualization (deferred to future sprint)

**Key Deliverables**:
- ✅ Event discovery and filtering interface
- ✅ Performance analytics with price history charts
- ✅ Availability trend visualization
- ✅ Performance comparison table with CSV export
- ✅ Dark/light mode theme toggle
- ✅ E2E test coverage for critical user flows
- ✅ SHADCN UI components (installed as-needed)
- ✅ Responsive design (320px - 2560px viewports)

---

## Sprint Overview

### Weekly Breakdown

| Week | Focus | Key Deliverable |
|------|-------|-----------------|
| **Week 1** | Foundation & Setup | Themed project structure with routing and navigation |
| **Week 2** | P1 - Discovery | Events list, search, filters, event/performance details |
| **Week 3** | P2 - Analytics | Price charts, availability trends, comparisons, CSV export |
| **Week 4** | Testing & Polish | E2E test suite, performance optimization, bug fixes |

### Story Point Distribution

- **Week 1**: 5 points (setup/infrastructure)
- **Week 2**: 13 points (P1 user stories - event discovery)
- **Week 3**: 12 points (P2 user stories - analytics)
- **Week 4**: 5 points (testing + refinement)

**Total**: ~35 story points

---

## Week 1: Foundation & Setup

**Goal**: Establish project infrastructure, theme system, navigation, and mock data foundation

**User Stories**: None (infrastructure sprint)

### Tasks

#### 1.1 Project Initialization & Dependencies (2 points)
- [ ] **Init Next.js Config**
  - Configure `next.config.ts` for production builds
  - Enable image optimization
  - Configure path aliases (`@/*`)
  
- [ ] **Install Core Dependencies**
  ```bash
  npm install @tanstack/react-query recharts date-fns clsx tailwind-merge lucide-react class-variance-authority
  ```
  - TanStack Query: Data fetching & caching
  - Recharts: Chart visualization
  - date-fns: Date formatting
  - clsx & tailwind-merge: Class composition
  - lucide-react: Icon library
  - class-variance-authority: Component variants
  
- [ ] **Install Dev Dependencies**
  ```bash
  npm install -D @types/d3 @testing-library/react @testing-library/jest-dom @playwright/test vitest
  ```

- [ ] **Update package.json scripts**
  ```json
  {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
  ```

**Acceptance Criteria**:
- All dependencies installed without conflicts
- `npm run dev` starts dev server successfully
- Next.js config validated with no warnings

---

#### 1.2 Theme System: Dark/Light Mode (2 points)
- [ ] **Configure Tailwind CSS v4 for theming**
  - Update `tailwind.config.ts` with color scheme support
  - Use CSS custom properties for theme variables
  - Reference: https://shadcn.com/docs/dark-mode/class

- [ ] **Create theme context + provider**
  - File: `app/providers.tsx`
  - Exports: `ThemeProvider`, `useTheme` hook
  - Features:
    - Toggle between 'light' and 'dark' modes
    - Persist preference to localStorage
    - System preference detection fallback

- [ ] **Update Root Layout**
  - File: `app/layout.tsx`
  - Wrap with ThemeProvider
  - Add theme toggle button to header
  - Configure initial theme from system preference

- [ ] **Style Updates**
  - File: `app/globals.css`
  - Import Tailwind directives
  - Define CSS variables for light/dark modes:
    - Background colors
    - Text colors
    - Border colors
  - Apply `dark:` class variants to root HTML element

**Acceptance Criteria**:
- Theme toggle button visible in header
- Clicking button switches between light and dark modes
- Theme persists across page reloads
- All text readable in both modes (WCAG AA color contrast)
- System prefers-color-scheme respected on first load

---

#### 1.3 Project Structure & Routing (1 point)
- [ ] **Create directory structure**
  ```
  app/
  ├── layout.tsx
  ├── page.tsx (homepage → events list)
  ├── globals.css
  ├── events/
  │   ├── page.tsx (events listing)
  │   └── [eventId]/
  │       ├── page.tsx (event detail)
  │       └── performances/
  │           └── [performanceId]/
  │               ├── page.tsx (performance detail)
  │               └── analytics/
  │                   └── page.tsx (analytics dashboard)
  └── compare/
      └── page.tsx (performance comparison)
  
  components/
  ├── layout/
  │   ├── navbar.tsx
  │   └── footer.tsx
  ├── events/
  ├── performances/
  ├── analytics/
  ├── shared/
  └── ui/ (SHADCN components - install as needed)
  
  lib/
  ├── services/
  │   └── mock/
  │       ├── api-client.ts
  │       └── (generators TBD per feature)
  ├── types/
  ├── utils/
  └── hooks/
  
  public/
  └── images/
  ```

- [ ] **Create basic routing pages** (stub implementations)
  - `app/page.tsx` → redirects to `/events`
  - `app/events/page.tsx` → placeholder "Events List"
  - `app/events/[eventId]/page.tsx` → placeholder "Event Detail"
  - `app/events/[eventId]/performances/[performanceId]/page.tsx` → placeholder "Performance Detail"
  - `app/events/[eventId]/performances/[performanceId]/analytics/page.tsx` → placeholder "Analytics"
  - `app/compare/page.tsx` → placeholder "Comparison"

**Acceptance Criteria**:
- All routes accessible without 404 errors
- Page structure matches specification in plan.md
- Breadcrumb navigation visible on all pages

---

#### 1.4 Navigation Component (1 point)
- [ ] **Create Navbar component**
  - File: `components/layout/navbar.tsx`
  - Features:
    - Logo/app title
    - Navigation links: Home, Events, Compare
    - Theme toggle button (light/dark mode)
    - Responsive hamburger menu (mobile)
  - Install SHADCN: `button`
  
- [ ] **Create basic Footer component**
  - File: `components/layout/footer.tsx`
  - Simple copyright and links

- [ ] **Integrate into Layout**
  - Update `app/layout.tsx` to use Navbar + Footer
  - Wrapper layout for all pages

**Acceptance Criteria**:
- Navigation visible on all pages
- Theme toggle works from navbar
- Mobile menu toggles on small screens
- All links navigate correctly

---

#### 1.5 Mock Data Architecture Foundation (1 point)
- [ ] **Create API client interface**
  - File: `lib/services/mock/api-client.ts`
  - Base class/interface with methods (implementations in Week 2-3):
    ```typescript
    class MockApiClient {
      async getEvents(filters?: EventFilters): Promise<Event[]>
      async getEvent(id: string): Promise<Event>
      async getPerformance(id: string): Promise<Performance>
      async getPriceHistory(performanceId: string, params?: PriceHistoryParams): Promise<PriceHistory[]>
      async getAvailabilityTrend(performanceId: string): Promise<AvailabilityTrend[]>
      async comparePerformances(performanceIds: string[]): Promise<ComparisonData>
    }
    ```

- [ ] **Create TypeScript interfaces**
  - File: `lib/types/index.ts` (import from spec: data-model.md)
  - Types:
    - Event, Performance, Section, Seat
    - PriceHistory, AvailabilityTrend
    - ComparisonData
    - Filter/Sort types

- [ ] **Create custom hooks foundation**
  - File: `lib/hooks/use-query-client.ts`
  - File: `lib/hooks/use-debounce.ts`
  - TanStack Query configuration

**Acceptance Criteria**:
- All TypeScript interfaces properly typed
- API client structure defined (methods callable in Week 2+)
- No runtime errors when importing types

---

### Week 1 Deliverable

✅ **Outcome**: 
- Project fully initialized with all dependencies
- Dark/light mode theme system working
- Navigation structure in place
- Routing skeleton complete
- Mock data architecture foundation ready

**Status Check**: `npm run dev` launches app with working theme toggle, navigation, and routing

---

## Week 2: P1 - Event & Performance Discovery

**Goal**: Implement complete event discovery flow - browse, search, filter, view details

**User Stories**:
- **US-001**: Browse Events - Users see grid of available events
- **US-002**: Search Events - Users search for events by name
- **US-003**: Filter Events - Users filter by type, venue, date, price
- **US-004**: View Event Details - Users see event metadata and performances
- **US-005**: View Performance Details - Users see performance-specific data

### Tasks

#### 2.1 Mock Data Generation - Events & Performances (2 points)
- [ ] **Create event mock data generator**
  - File: `lib/services/mock/events.mock.ts`
  - Generate 20-30 mock events
  - Data includes: id, name, description, venue, eventType, dateRange, thumbnail, tags
  - Realistic event types: ballet, opera, theater, concert, musical, dance
  - Realistic venues (NYC theaters)
  
- [ ] **Create performance mock data generator**
  - File: `lib/services/mock/performances.mock.ts`
  - Generate 5-10 performances per event
  - Data includes: id, eventId, performanceDate, status, totalSeats, availableSeats, priceRange
  - Realistic status transitions: on_sale, selling_fast, sold_out
  - Dates spread across 2-6 weeks

- [ ] **Create section mock data generator**
  - File: `lib/services/mock/sections.mock.ts`
  - Generate 4-6 sections per performance
  - Price tiers: premium (highest), standard, value, accessible
  - Realistic availability: premium less available, value more available

- [ ] **Implement in API client**
  - Add `getEvents(filters?: EventFilters)` → returns array of Events
  - Add `getEvent(id: string)` → returns single Event with performances
  - Simulate 200-400ms latency

**Acceptance Criteria**:
- Mock data generates consistently without duplicates
- Events have valid UUIDs and relationships
- Price tiers ordered correctly (premium > standard > value)
- Performance dates are realistic and future-dated

---

#### 2.2 Event Grid Component (3 points)
- [ ] **Create EventCard component**
  - File: `components/events/event-card.tsx`
  - Display: Thumbnail, title, venue, date range, price range
  - Install SHADCN: `card`
  - Styling: Responsive, dark/light mode aware
  - Interactive: Hover effects, link to event detail

- [ ] **Create EventGrid component**
  - File: `components/events/event-grid.tsx`
  - Display grid of EventCards
  - Responsive grid: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
  - Include skeleton loaders during fetch

- [ ] **Create EventsListPage**
  - File: `app/events/page.tsx`
  - Fetch events using hook: `useEvents()`
  - Display EventGrid with loading/error states
  - Install SHADCN: `skeleton`

- [ ] **Create useEvents hook**
  - File: `lib/hooks/use-events.ts`
  - TanStack Query wrapper
  - Query key: `['events', filters]`
  - Caching: 5 min stale time

**Acceptance Criteria**:
- Event grid displays 20+ mock events
- Cards show correct information and images
- Skeleton shows during loading
- Error state displays if data fetch fails
- Responsive on all viewport sizes
- Dark mode colors readable

---

#### 2.3 Search Functionality (2 points)
- [ ] **Create EventSearch component**
  - File: `components/events/event-search.tsx`
  - Input field for search text
  - Install SHADCN: `input`
  - Debounced search (300ms) to avoid excessive re-renders
  - Use hook: `useDebounce()`

- [ ] **Implement search filtering**
  - Update `useEvents` hook to accept search param
  - Mock API filters events by name/description match
  - Update EventsListPage to pass search to hook

- [ ] **Add search UI to EventsListPage**
  - Place search above event grid
  - Show "N results for 'query'" feedback
  - Clear button to reset search

**Acceptance Criteria**:
- Typing in search field filters events
- Results update after 300ms debounce delay
- No results displays empty state with message
- "X of Y results" indicator shown
- Clear button resets to all events

---

#### 2.4 Filter Sidebar (3 points)
- [ ] **Create EventFilters component**
  - File: `components/events/event-filters.tsx`
  - Filter options:
    - Event Type (multi-select): ballet, opera, theater, concert, musical, dance
    - Venue (multi-select)
    - Date Range (date picker)
    - Price Range (slider or min/max inputs)
    - Availability Status: all, available, selling_fast, sold_out
  - Install SHADCN: `select`, `checkbox`, `slider` (or `input` for range)
  - Install SHADCN: `badge` for active filter display

- [ ] **Integrate filters into EventsListPage**
  - Sidebar layout: filters on left, grid on right (desktop)
  - Mobile: Filters in collapsible drawer
  - Install SHADCN: `button` (filter toggle on mobile)

- [ ] **Update mock API**
  - `getEvents(filters)` respects all filter params
  - Filter logic: type, venue, date range, price range, availability

- [ ] **Add active filter badges**
  - Show pills for each active filter
  - Clicking pill removes that filter

**Acceptance Criteria**:
- All filter types work independently
- Multiple filters combine (AND logic)
- Active filters displayed as badges
- Clear all filters button works
- Results update in real-time as filters change
- Mobile drawer closes after selection
- Responsive layout on all sizes

---

#### 2.5 Event Detail Page (2 points)
- [ ] **Create EventDetail component**
  - File: `app/events/[eventId]/page.tsx`
  - Display:
    - Event thumbnail (large)
    - Title, description, event type
    - Venue information
    - Date range
    - List of all performances

- [ ] **Create PerformancesList component**
  - File: `components/performances/performance-list.tsx`
  - Display each performance with:
    - Date/time
    - Status badge (on_sale, selling_fast, sold_out)
    - Available seats count
    - Price range
    - Link to performance detail
  - Install SHADCN: `badge`

- [ ] **Create useEvent hook**
  - File: `lib/hooks/use-event.ts`
  - TanStack Query wrapper for single event
  - Query key: `['event', eventId]`

- [ ] **Add breadcrumb navigation**
  - Show: Home > Events > [Event Name]
  - Install SHADCN: `breadcrumb` (or custom)

**Acceptance Criteria**:
- Event detail loads from route param
- All performances listed with correct data
- Performance links navigate to detail page
- Breadcrumbs appear and navigate correctly
- Loading and error states handled
- Responsive on mobile (scrollable performance list)

---

#### 2.6 Performance Detail Page (2 points)
- [ ] **Create PerformanceDetail component**
  - File: `app/events/[eventId]/performances/[performanceId]/page.tsx`
  - Display:
    - Performance metadata (date, time, doors, duration)
    - Event information (title, thumbnail)
    - Venue details
    - Availability summary (total, sold, available)
    - Price range
    - Sections table with prices and availability

- [ ] **Create SectionsTable component**
  - File: `components/performances/sections-table.tsx`
  - Columns: Section Name, Price Tier, Price, Available, Total, % Available
  - Install SHADCN: `table`
  - Dark mode styling

- [ ] **Create usePerformance hook**
  - File: `lib/hooks/use-performance.ts`
  - TanStack Query wrapper
  - Query key: `['performance', performanceId]`

- [ ] **Add navigation links**
  - Link to analytics dashboard
  - Back button to event detail
  - Breadcrumbs: Home > Events > [Event] > [Performance]

**Acceptance Criteria**:
- Performance data loads correctly
- Sections table displays accurate data
- All numeric values formatted correctly (currency, percentages)
- Status badges show correct colors
- Navigation links work
- Layout responsive on mobile (scrollable table)

---

#### 2.7 E2E Tests - Event Discovery Flow (2 points)
- [ ] **Setup Playwright**
  - File: `playwright.config.ts`
  - Configure: base URL (localhost:3000), timeout, retries
  
- [ ] **Create test fixtures & utilities**
  - File: `tests/e2e/fixtures.ts`
  - Mock API responses
  - Login/auth setup (if needed)

- [ ] **Write E2E test: Browse Events**
  - File: `tests/e2e/event-discovery.spec.ts`
  - Test name: "User can browse events on homepage"
  - Steps:
    1. Navigate to `/events`
    2. Verify event grid displays
    3. Verify at least 5 events visible
    4. Verify event cards show: thumbnail, title, venue, price range

- [ ] **Write E2E test: Search Events**
  - Test name: "User can search for events"
  - Steps:
    1. Go to `/events`
    2. Type "Swan Lake" in search
    3. Verify results filtered
    4. Verify search shows results count

- [ ] **Write E2E test: Filter Events**
  - Test name: "User can filter events by type"
  - Steps:
    1. Go to `/events`
    2. Click "Ballet" filter
    3. Verify results show only ballet events
    4. Click filter again to remove
    5. Verify all events shown again

- [ ] **Write E2E test: View Event Details**
  - Test name: "User can view event and performance details"
  - Steps:
    1. Go to `/events`
    2. Click first event card
    3. Verify event detail page loads
    4. Verify performances listed
    5. Click first performance
    6. Verify performance detail page loads with sections table

**Acceptance Criteria**:
- All tests pass: `npm run test:e2e`
- Tests run in headless mode without UI
- Proper assertions on element visibility and text content
- Tests complete in < 60 seconds total

---

### Week 2 Deliverable

✅ **Outcome**: 
- Complete P1 user story flow implemented
- Mock event data generation working
- Search and filter functionality operational
- Event and performance detail pages functional
- E2E tests covering critical discovery path

**Status Check**: 
```
npm run dev
# Navigate to /events → view events → search → filter → view details → view performance
npm run test:e2e
# All discovery tests passing
```

---

## Week 3: P2 - Analytics & Data Visualization

**Goal**: Implement analytics dashboards with price history charts, availability trends, and comparison functionality

**User Stories**:
- **US-006**: View Price History - Users see interactive price trend charts
- **US-007**: Analyze Availability Trends - Users see seat availability over time
- **US-008**: Compare Performances - Users compare multiple performances side-by-side
- **US-009**: Export Comparison - Users export comparison data as CSV

### Tasks

#### 3.1 Mock Data Generation - Analytics (2 points)
- [ ] **Create price history mock data generator**
  - File: `lib/services/mock/price-history.mock.ts`
  - Generate 30-60 historical data points per section
  - Time span: 30 days before performance date
  - Data includes: timestamp, price, availableSeats, soldSeats
  - Realistic patterns:
    - Prices start lower, gradually increase
    - Occasional spikes for high demand
    - Different sections have different price curves

- [ ] **Create availability trend mock data generator**
  - File: `lib/services/mock/availability.mock.ts`
  - Generate 30-60 data points per section
  - Track: availableSeats, soldSeats, % available over time
  - Realistic patterns:
    - Premium sections sell faster
    - Value sections sell slower
    - Include "selling_fast" and "sold_out" transitions

- [ ] **Implement in API client**
  - Add `getPriceHistory(performanceId, params)` → PriceHistory[]
  - Add `getAvailabilityTrend(performanceId)` → AvailabilityTrend[]
  - Simulate 300-500ms latency (simulates data processing)

**Acceptance Criteria**:
- Price data shows realistic trends
- Availability decreases over time
- Multiple sections tracked separately
- Data contains accurate timestamps
- Numeric values in correct units (prices in cents, seats as count)

---

#### 3.2 Price History Chart Component (3 points)
- [ ] **Create PriceHistoryChart component**
  - File: `components/analytics/price-history-chart.tsx`
  - Chart type: Multi-line chart (one line per section)
  - X-axis: Time/date
  - Y-axis: Price (USD)
  - Install SHADCN: None (Recharts handles visualization)
  - Dependencies: recharts

- [ ] **Create time range selector**
  - File: `components/analytics/time-range-selector.tsx`
  - Options: 24h, 7d, 30d, all time
  - Install SHADCN: `button` (button group)
  - Install SHADCN: `segment-group` or use `button` with active styling

- [ ] **Create section selector (multi-select)**
  - File: `components/analytics/section-selector.tsx`
  - Checkboxes for each section
  - Toggle lines on/off in real-time
  - Install SHADCN: `checkbox`

- [ ] **Integrate into Analytics Dashboard**
  - File: `app/events/[eventId]/performances/[performanceId]/analytics/page.tsx`
  - Layout: Time range buttons at top, section selector on side, chart below
  - Include legend showing line colors per section
  - Responsive: Stack selectors on mobile

- [ ] **Create usePriceHistory hook**
  - File: `lib/hooks/use-price-history.ts`
  - Query key: `['priceHistory', performanceId, timeRange]`
  - Refetch when time range or selected sections change

**Acceptance Criteria**:
- Chart renders with 30+ data points per line
- Multiple sections display as separate lines with distinct colors
- Tooltip shows: timestamp, price, section on hover
- Time range buttons filter data correctly
- Section checkboxes add/remove lines in real-time
- Responsive on all viewport sizes
- Dark mode contrast readable

---

#### 3.3 Availability Trend Visualization (2 points)
- [ ] **Create AvailabilityHeatmap component**
  - File: `components/analytics/availability-heatmap.tsx`
  - Chart type: Area chart or bar chart
  - Show: % Available over time per section
  - Color gradient: Green (high availability) → Red (low availability)
  - Install from recharts: AreaChart or BarChart

- [ ] **Create SellingVelocityCard component**
  - File: `components/analytics/selling-velocity-card.tsx`
  - Display metric: Seats sold per hour
  - Show: Trend arrow (up/down) and percentage change
  - Install SHADCN: `card`
  - Dependencies: lucide-react for arrow icons

- [ ] **Add to Analytics Dashboard**
  - Place heatmap below price history
  - Place velocity card in sidebar or below heatmap
  - Include "Estimated Sellout" date if available

- [ ] **Create useAvailabilityTrend hook**
  - Query key: `['availabilityTrend', performanceId]`

**Acceptance Criteria**:
- Heatmap displays accurate data
- Color gradient clearly indicates availability
- Selling velocity metric calculated correctly
- Responsive layout on mobile
- All numeric values formatted appropriately

---

#### 3.4 Performance Comparison Feature (3 points)
- [ ] **Create ComparisonPage**
  - File: `app/compare/page.tsx`
  - Feature: Multi-select performances for comparison
  - Display: Side-by-side table of selected performances

- [ ] **Create PerformanceSelector component**
  - File: `components/analytics/performance-selector.tsx`
  - Search/select performances from current event
  - Multi-select up to 5 performances
  - Install SHADCN: `command` (or `select`)
  - Install SHADCN: `popover` (for dropdown)

- [ ] **Create ComparisonTable component**
  - File: `components/analytics/comparison-table.tsx`
  - Columns: 
    - Metric (left column)
    - Performance 1
    - Performance 2
    - Performance 3 (etc.)
  - Rows:
    - Date/Time
    - Status
    - Total Seats
    - Available Seats
    - % Available
    - Price Range
    - Recommended Sections
  - Install SHADCN: `table`
  - Highlighting: Best value sections for each performance

- [ ] **Create useComparison hook**
  - API method: `comparePerformances(performanceIds: string[])`
  - Query key: `['comparison', performanceIds.sort()]`

**Acceptance Criteria**:
- Can select 2-5 performances
- Table displays side-by-side comparison
- All metrics calculated correctly
- Responsive scrolling on mobile
- "Best value" sections highlighted clearly

---

#### 3.5 CSV Export Functionality (2 points)
- [ ] **Create CSV export utility**
  - File: `lib/utils/csv-export.ts`
  - Function: `exportComparisonToCSV(comparisonData: ComparisonData, filename: string)`
  - Include:
    - Comparison metadata (generated date)
    - Performance details (date, venue, status)
    - Section comparison data
    - Metrics summary

- [ ] **Create ExportButton component**
  - File: `components/analytics/export-button.tsx`
  - Trigger: Click button to export
  - Install SHADCN: `button`
  - Icon: Download icon from lucide-react
  - Confirm: Optionally show toast on successful export

- [ ] **Integrate into ComparisonTable**
  - Add export button above/below table
  - Click generates CSV file
  - File named: `comparison-[timestamp].csv`

**Acceptance Criteria**:
- CSV file downloads when button clicked
- CSV contains all comparison data
- CSV properly formatted (headers, quotes, escaping)
- File can be opened in Excel/Google Sheets
- Date/time fields formatted human-readable
- Prices displayed in USD format

---

#### 3.6 Analytics E2E Tests (2 points)
- [ ] **Write E2E test: View Price History**
  - File: `tests/e2e/analytics.spec.ts`
  - Test name: "User can view and interact with price history chart"
  - Steps:
    1. Navigate to performance detail page
    2. Click "Analytics" link
    3. Verify price history chart displays
    4. Verify multiple sections displayed as lines
    5. Change time range to "7d"
    6. Verify chart updates
    7. Toggle section checkbox
    8. Verify line added/removed

- [ ] **Write E2E test: View Availability Trends**
  - Test name: "User can view availability heatmap and selling velocity"
  - Steps:
    1. On analytics page
    2. Scroll down to heatmap
    3. Verify heatmap displays with color gradient
    4. Verify selling velocity metric shown
    5. Verify estimated sellout date displayed

- [ ] **Write E2E test: Compare Performances**
  - Test name: "User can compare multiple performances"
  - Steps:
    1. Navigate to `/compare`
    2. Select 2-3 performances
    3. Verify comparison table renders
    4. Verify all metrics displayed correctly
    5. Verify "Best value" highlighted

- [ ] **Write E2E test: Export Comparison**
  - Test name: "User can export comparison as CSV"
  - Steps:
    1. On comparison page with data
    2. Click "Export to CSV"
    3. Verify file downloads
    4. Verify file readable as CSV

**Acceptance Criteria**:
- All analytics tests pass: `npm run test:e2e`
- Tests verify: chart rendering, interactivity, data accuracy, export
- No flaky tests (consistent passes)
- Tests complete in < 90 seconds total

---

#### 3.7 Polish & Accessibility (1 point)
- [ ] **Verify dark/light mode on analytics pages**
  - Chart colors visible in both modes
  - Table contrast meets WCAG AA
  - Icon colors appropriate

- [ ] **Add loading skeletons to analytics**
  - Charts show skeleton during data fetch
  - Install SHADCN: `skeleton`

- [ ] **Keyboard navigation**
  - All buttons/selects keyboard accessible
  - Time range and section filters selectable via Tab
  - Enter key triggers actions

- [ ] **Responsive refinement**
  - Charts scale properly on mobile
  - Table scrolls horizontally on mobile
  - Selectors stack vertically on mobile

**Acceptance Criteria**:
- Readable in both light and dark modes
- All interactive elements keyboard-accessible
- No horizontal scroll on mobile < 375px
- Touch targets meet 44x44px minimum

---

### Week 3 Deliverable

✅ **Outcome**: 
- Complete P2 analytics functionality implemented
- Price history and availability charts working
- Performance comparison table functional
- CSV export working
- E2E tests covering analytics flows
- Full dark/light mode support

**Status Check**: 
```
npm run dev
# Navigate to performance → analytics → view charts → compare → export CSV
npm run test:e2e
# All tests (Week 2 + Week 3) passing
```

---

## Week 4: Testing, Optimization & Refinement

**Goal**: Comprehensive testing, performance optimization, bug fixes, and production readiness

### Tasks

#### 4.1 E2E Test Suite Expansion (2 points)
- [ ] **Edge case tests**
  - Test: No events/performances matching filters
    - Verify empty state displays helpful message
  - Test: Sold-out performances
    - Verify status displayed correctly
    - Verify analytics still visible
  - Test: Performances with insufficient price history
    - Verify error state handled gracefully
  - Test: Large dataset handling (100+ results)
    - Verify pagination/scrolling works

- [ ] **Cross-browser testing**
  - Run tests on: Chrome, Firefox, Safari, Edge
  - Verify: `playwright test --project=chromium,firefox,webkit`

- [ ] **Mobile device testing**
  - Test on: iPhone 12, Pixel 5 (via Playwright emulation)
  - Verify: Touch interactions, responsive layout, readability

**Acceptance Criteria**:
- All edge case tests passing
- Cross-browser tests pass on all browsers
- Mobile device tests passing
- Zero test flakiness

---

#### 4.2 Performance Optimization (1.5 points)
- [ ] **Bundle analysis**
  - Install: `npm install -D @next/bundle-analyzer`
  - Analyze production bundle size
  - Target: < 500KB gzipped
  - Identify and remove unused dependencies

- [ ] **Code splitting verification**
  - Charts (Recharts) lazy loaded on analytics page
  - Heavy components code-split automatically by Next.js
  - Verify with Chrome DevTools

- [ ] **Image optimization**
  - All event thumbnails using Next.js `Image` component
  - Verify: WebP format, responsive sizes
  - Test: Network tab shows optimized image sizes

- [ ] **React optimization**
  - Identify unnecessary re-renders (React DevTools Profiler)
  - Add React.memo to pure components if needed
  - Verify: useMemo on expensive calculations

**Acceptance Criteria**:
- Bundle size < 500KB gzipped
- Charts lazy load (verify Network tab)
- Images load as WebP on modern browsers
- Lighthouse Performance score: 85+ on desktop, 75+ on mobile

---

#### 4.3 Accessibility Audit (1 point)
- [ ] **Manual keyboard navigation test**
  - Navigate entire app using Tab/Shift+Tab only
  - Verify: Logical tab order, focus indicators visible
  - Test: All buttons, links, form inputs keyboard-accessible
  - Test: Escape key closes modals/dropdowns

- [ ] **Color contrast verification**
  - Use: axe DevTools browser extension
  - Target: WCAG AA level (4.5:1 minimum for text)
  - Check: Both light and dark modes
  - Fix: Any contrast violations

- [ ] **Screen reader testing** (manual spot check)
  - Test with: NVDA (Windows) or VoiceOver (Mac)
  - Verify: Event cards readable
  - Verify: Charts have ARIA labels
  - Verify: Table headers marked up semantically

- [ ] **Semantic HTML audit**
  - Verify: Proper heading hierarchy (h1 > h2 > h3)
  - Verify: Lists use `<ul>`/`<li>` or `<ol>`/`<li>`
  - Verify: Tables use `<th>` for headers
  - Verify: Forms use `<label>` elements

**Acceptance Criteria**:
- All keyboard navigation working
- Zero contrast violations (axe DevTools)
- Screen reader reads key information correctly
- Semantic HTML validated with WAVE or AXE

---

#### 4.4 Bug Fixes & Edge Cases (1.5 points)
- [ ] **Triage reported issues**
  - Document any bugs found during testing
  - Prioritize: Critical (breaking), High (major features), Medium (UX), Low (cosmetic)

- [ ] **Fix network error handling**
  - Display error message: "Failed to load data. Please try again."
  - Include retry button
  - Verify: Retry button re-fetches data

- [ ] **Fix empty state messaging**
  - Search returns no results: "No events match 'xyz'. Try a different search."
  - No performances: "No performances found for this event."
  - Add icon illustrations for empty states

- [ ] **Fix responsive layout issues**
  - Test all breakpoints: 320px, 768px, 1024px, 1440px, 2560px
  - Fix: Any layouts that break
  - Verify: Touch targets 44x44px on mobile

- [ ] **Theme persistence fixes**
  - Verify: Theme survives hard refresh
  - Verify: Theme survives across tabs (localStorage)
  - Test: No flash of wrong theme on page load

**Acceptance Criteria**:
- All reported bugs fixed or documented as deferred
- Error states display user-friendly messages
- Empty states have helpful messaging
- Layout works on all tested viewport widths
- No console errors or warnings

---

#### 4.5 Documentation & Final Polish (1 point)
- [ ] **Update README.md**
  - Installation instructions
  - Development server setup
  - Build & deployment instructions
  - Testing instructions (E2E)
  - Architecture overview

- [ ] **Add JSDoc comments to utilities**
  - Document utility functions
  - Document custom hooks
  - Document component props (TypeScript)

- [ ] **Create CONTRIBUTING.md** (optional)
  - Development best practices
  - How to add new components
  - Testing guidelines

- [ ] **Final visual polish**
  - Verify all colors consistent in dark/light modes
  - Verify all fonts readable and properly sized
  - Verify all spacing consistent
  - Verify button sizes consistent

- [ ] **Production build test**
  - Run: `npm run build`
  - Verify: No build errors
  - Run: `npm run start`
  - Verify: App loads correctly in production mode

**Acceptance Criteria**:
- README is comprehensive and up-to-date
- `npm run build` completes without errors
- Production server starts successfully
- All documentation current

---

#### 4.6 Final Testing & QA (1.5 points)
- [ ] **Full E2E test run**
  - Run: `npm run test:e2e`
  - Verify: 100% tests passing
  - Run: `npm run test:e2e:ui` for visual inspection

- [ ] **Lighthouse audit**
  - Build production version: `npm run build && npm run start`
  - Run Lighthouse in Chrome DevTools
  - Screenshot scores
  - Target scores:
    - Performance: 85+
    - Accessibility: 95+
    - Best Practices: 90+

- [ ] **Manual QA checklist**
  - [ ] Homepage loads correctly
  - [ ] Events list displays and scrolls
  - [ ] Search filters events in real-time
  - [ ] All filter types work
  - [ ] Event detail page shows all performances
  - [ ] Performance detail shows sections table
  - [ ] Analytics page loads with charts
  - [ ] Chart interactions work (hover, click)
  - [ ] Time range selector works
  - [ ] Comparison page works (select, display, export)
  - [ ] CSV export downloads correct file
  - [ ] Dark/light mode toggle works
  - [ ] Navigation links work
  - [ ] All pages responsive on mobile
  - [ ] No console errors/warnings

- [ ] **User acceptance testing**
  - Share with stakeholder/team
  - Gather feedback
  - Document minor feedback as "future enhancements"

**Acceptance Criteria**:
- All E2E tests passing (0 flakiness)
- Lighthouse scores meet targets
- Manual QA checklist 100% complete
- Zero critical bugs remaining
- Feedback documented

---

### Week 4 Deliverable

✅ **Final Outcome**: 
- Production-ready dashboard application
- Comprehensive E2E test suite
- Performance optimized
- Accessibility compliant
- Fully documented
- Ready for deployment

**Status Check**: 
```
npm run test:e2e           # All tests passing
npm run build              # No errors
npm run start              # Production server works
# Run Lighthouse audit → Performance 85+, Accessibility 95+
```

---

## Sprint Success Criteria

### Must-Have (Definition of Done)

- ✅ **P1 Complete**: Event discovery fully functional (browse, search, filter, view details)
- ✅ **P2 Complete**: Analytics working (price charts, availability trends, comparison, CSV export)
- ✅ **Dark/Light Mode**: Theme toggle working, all pages readable in both modes
- ✅ **E2E Tests**: Critical user flows covered with Playwright tests (all passing)
- ✅ **Responsive**: Works on 320px - 2560px viewports
- ✅ **Performance**: Lighthouse 85+ (desktop), 75+ (mobile)
- ✅ **No Critical Bugs**: Zero blocking issues at sprint end
- ✅ **Accessible**: WCAG 2.1 AA compliance verified

### Nice-to-Have (If time permits)

- Advanced filtering with saved presets
- Favorites/bookmarking events
- Sort options for event grid
- Advanced data export (JSON format)
- Service worker for offline support
- Improved skeleton loader designs

### Out of Scope (Deferred)

- Interactive seat map visualization
- User authentication/accounts
- Real-time data updates (WebSocket)
- Multi-language support
- Mobile app (native iOS/Android)

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Recharts performance** | Low | High | Test chart rendering with 1000+ data points early (Week 3 Day 1) |
| **Mock data complexity** | Medium | Medium | Generate mock data incrementally; validate consistency |
| **E2E test flakiness** | Medium | High | Use explicit waits; avoid timing-dependent assertions; run tests multiple times |
| **Responsive design issues** | Medium | Medium | Test on actual devices/emulators early; use CSS Grid/Flexbox patterns |
| **Dark mode edge cases** | Low | Low | Test all components in both modes during Week 1; use CSS variable approach |
| **Lighthouse score targets** | Medium | Medium | Monitor bundle size from Week 2; lazy-load heavy components |

---

## Team Capacity & Handoff

### Estimated Workload: 35 story points over 4 weeks

- **Week 1 (5 pts)**: Setup/infrastructure (individual contributor)
- **Week 2 (13 pts)**: P1 features (1-2 developers possible)
- **Week 3 (12 pts)**: P2 features (1-2 developers possible)
- **Week 4 (5 pts)**: Testing & polish (individual contributor or full team)

### Suggested Developer Allocation

**Option 1: Single Developer**
- Complete sprint end-to-end
- Follow weekly breakdown sequentially
- Estimated: 140-160 hours (4 weeks at ~40-50 hrs/week)

**Option 2: Two Developers**
- Dev 1: Week 1 (setup), Week 2 (events discovery), Week 3 (comparison & CSV)
- Dev 2: Week 3 (price charts & trends), Week 4 (testing & optimization)
- Parallel work reduces total time

### Post-Sprint Handoff

After sprint completion:
- Code review with team
- Deploy to staging environment
- Stakeholder UAT (1-2 days)
- Deploy to production
- Monitor metrics and error tracking

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16.1 + React 19 | Server-side rendering & routing |
| **Language** | TypeScript 5 | Type safety |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **UI Components** | SHADCN (copy-paste) | Pre-built, accessible components |
| **Charts** | Recharts 2.x | React-first data visualization |
| **Data Fetching** | TanStack Query 5.x | Server state management & caching |
| **Testing** | Playwright | E2E testing (cross-browser) |
| **Icons** | Lucide React | SVG icon library |
| **Utilities** | date-fns, clsx, tailwind-merge | Date formatting, class composition |

---

## Assumptions & Dependencies

### Assumptions

1. **Mock data sufficient for MVP**: No real backend required during sprint
2. **Recharts learning curve minimal**: Team familiar with React patterns
3. **SHADCN component library available**: Can install components on-demand
4. **4-week sprint uninterrupted**: No mid-sprint scope changes or critical production issues
5. **Development environment setup**: All developers have Node.js 18+, npm 9+, VS Code
6. **Browser support**: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+

### Dependencies

- ✅ Node.js 18+ installed
- ✅ npm 9+ installed
- ✅ Git repository initialized
- ✅ Specs/requirements finalized (this document)
- ⏳ Backend API specifications (for future integration post-sprint)

---

## Next Steps After Sprint

### Week 5+ Activities

1. **Real Backend Integration**
   - Replace mock services with actual API client
   - Update environment variables for production API
   - Implement authentication (if required)

2. **Real-Time Updates** (future sprint)
   - WebSocket integration for live price updates
   - Real-time availability changes

3. **Advanced Features** (future sprint)
   - Seat map visualization
   - User accounts & saved searches
   - Price alerts/notifications

4. **Deployment**
   - Set up CI/CD pipeline (GitHub Actions)
   - Deploy to Vercel or similar platform
   - Configure monitoring & error tracking

---

## Document Control

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 1.0 | 2026-01-07 | Planning Team | Final |

---

## Questions & Support

For questions about this sprint plan, refer to:
- **Feature Specification**: `spec.md`
- **Technical Research**: `research.md`
- **Data Model**: `data-model.md`
- **API Contracts**: `contracts/api-endpoints.md`
- **Development Setup**: `quickstart.md`

---

**Sprint Ready! 🚀**
