# Quickstart Guide: Event Ticket Analytics Dashboard

**Feature**: 001-frontend-dashboard  
**Date**: 2026-01-07  
**Purpose**: Development setup and testing instructions

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code** (recommended): With extensions for TypeScript, ESLint, Prettier

---

## Initial Setup

### 1. Clone and Navigate to Project

```bash
cd experia-scraper-fe
git checkout 001-frontend-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Next.js, React, TypeScript
- SHADCN UI components (will be added incrementally)
- Recharts, D3.js
- TanStack Query
- Vitest, Testing Library, Playwright
- ESLint, Prettier

### 3. Install SHADCN UI Components

```bash
# Initialize SHADCN (if not already done)
npx shadcn@latest init

# Install required components
npx shadcn@latest add button card input label
npx shadcn@latest add badge table pagination select
npx shadcn@latest add dialog dropdown-menu separator
npx shadcn@latest add tabs switch slider
npx shadcn@latest add popover tooltip
npx shadcn@latest add skeleton alert scroll-area
npx shadcn@latest add command breadcrumb
```

### 4. Environment Setup

Create `.env.local` file (for future backend integration):

```bash
# Mock API configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_MOCK_DELAY_MS=300

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SEAT_MAP=true
```

### 5. Start Development Server

```bash
npm run dev
```

Application will be available at: `http://localhost:3000`

---

## Project Structure Overview

```
experia-scraper-fe/
├── app/                    # Next.js pages (App Router)
├── components/
│   ├── ui/                # SHADCN components
│   ├── events/            # Event-related components
│   ├── analytics/         # Chart & analytics components
│   └── seat-map/          # Seat map visualization
├── lib/
│   ├── services/mock/     # Mock data services
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Helper functions
├── hooks/                 # Custom React hooks
└── tests/                 # Test files
```

---

## Development Workflow

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run component tests
npm run test:component

# Run E2E tests
npm run test:e2e

# Test coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## Key Development Scenarios

### Scenario 1: Browse Events

**User Journey**: User visits homepage → views event list → searches/filters → clicks event

**How to Test**:
1. Navigate to `http://localhost:3000`
2. Event grid should display with mock events
3. Search bar: Enter "Swan Lake" → events filter
4. Filters: Select "Ballet" event type → events filter
5. Click an event card → navigate to event detail page
6. Verify: Event details, performance list visible

**Expected Behavior**:
- ✅ Grid displays 20+ mock events
- ✅ Search filters in real-time (debounced)
- ✅ Filter sidebar updates results
- ✅ Loading skeleton shown during data fetch
- ✅ Responsive layout (mobile, tablet, desktop)

---

### Scenario 2: View Performance Details

**User Journey**: User on event detail page → selects performance → views pricing/availability

**How to Test**:
1. Navigate to `/events/[eventId]`
2. Performance list should display
3. Click a performance → navigate to `/events/[eventId]/performances/[performanceId]`
4. Verify: Performance metadata, sections table, price range, availability summary

**Expected Behavior**:
- ✅ Performance list sorted by date (ascending)
- ✅ Status badges (on_sale, selling_fast, sold_out)
- ✅ Section table with prices and availability
- ✅ Link to analytics and seat map visible

---

### Scenario 3: Analyze Price History

**User Journey**: User on performance detail → navigates to analytics → views price trends

**How to Test**:
1. Navigate to `/events/[eventId]/performances/[performanceId]/analytics`
2. Price history chart should render
3. Time range selector: Click "7d" → chart updates
4. Section filter: Select "Orchestra Center" → chart updates
5. Hover over data points → tooltip shows details

**Expected Behavior**:
- ✅ Chart renders with realistic historical data
- ✅ Time range changes update data (24h, 7d, 30d, all)
- ✅ Multiple sections can be compared (multi-line chart)
- ✅ Tooltip shows: timestamp, price, section, availability
- ✅ Chart is responsive and interactive

---

### Scenario 4: Interactive Seat Map

**User Journey**: User on performance detail → views seat map → hovers over seats → zooms/pans

**How to Test**:
1. Navigate to `/events/[eventId]/performances/[performanceId]/seat-map`
2. SVG seat map should render
3. Hover over seats → tooltip appears
4. Zoom controls: Click +/- → map scales
5. Pan: Click and drag → map moves
6. Mobile: Touch gestures for zoom/pan

**Expected Behavior**:
- ✅ Seat map renders 2000+ seats in < 1 second
- ✅ Seats color-coded by price tier (premium, standard, value)
- ✅ Availability status visible (available, sold, reserved)
- ✅ Tooltip shows: seat number, price, section, row
- ✅ Zoom/pan works smoothly (no lag)
- ✅ Responsive scaling on mobile

---

### Scenario 5: Compare Performances

**User Journey**: User selects multiple performances → views comparison table → exports data

**How to Test**:
1. Navigate to `/compare`
2. Performance selector: Choose 2-3 performances
3. Comparison table should render
4. Click "Export CSV" → file downloads

**Expected Behavior**:
- ✅ Can select up to 5 performances
- ✅ Table shows side-by-side price comparison
- ✅ Availability percentages calculated
- ✅ Recommended sections highlighted
- ✅ CSV export contains all comparison data

---

## Mock Data Exploration

### Available Mock Data

The mock service generates realistic data for:
- **Events**: 25 events across different types (ballet, opera, theater, concert)
- **Performances**: 5-10 performances per event
- **Sections**: 6 sections per performance (Premium, Standard, Value, Accessible)
- **Seats**: ~2000 seats per performance
- **Price History**: 30 days of historical pricing data
- **Availability Trends**: Gradual seat sales over time

### Inspecting Mock Data

```typescript
// In browser console
import { MockApiClient } from '@/lib/services/mock/api-client';

const client = new MockApiClient();

// Get all events
const events = await client.getEvents();
console.log(events);

// Get specific performance
const perf = await client.getPerformance('perf_123');
console.log(perf);

// Get price history
const history = await client.getPriceHistory('perf_123');
console.log(history);
```

### Simulated Network Behavior

Mock API simulates realistic conditions:
- **Latency**: 200-500ms delays
- **Errors**: 5% chance of failure (for error state testing)
- **Large Datasets**: Seat maps with 2000+ seats
- **Data Consistency**: All relationships are valid (event → performance → section)

---

## Accessibility Testing

### Manual Keyboard Testing

```
Tab       → Navigate through interactive elements
Enter     → Activate buttons/links
Space     → Toggle checkboxes/switches
Arrows    → Navigate within components (tabs, select, etc.)
Esc       → Close dialogs/popovers
```

**Checklist**:
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] Logical tab order
- [ ] No keyboard traps
- [ ] Skip links work

### Screen Reader Testing

**Tools**:
- **Windows**: NVDA (free)
- **macOS**: VoiceOver (built-in)
- **Chrome Extension**: Screen Reader (for quick checks)

**Test Scenarios**:
- Navigate event grid
- Read event card details
- Interact with filters
- Understand chart data (via ARIA labels)
- Navigate seat map

---

## Performance Testing

### Lighthouse Audit

```bash
# Build production version
npm run build

# Start production server
npm run start

# Run Lighthouse (Chrome DevTools)
# 1. Open Chrome DevTools
# 2. Navigate to Lighthouse tab
# 3. Select categories: Performance, Accessibility, Best Practices
# 4. Click "Generate report"
```

**Target Scores**:
- Performance: ≥ 90 (desktop), ≥ 80 (mobile)
- Accessibility: ≥ 95
- Best Practices: ≥ 90

### Bundle Size Analysis

```bash
# Analyze bundle
npm run analyze

# Opens bundle analyzer in browser
# Check for:
# - Total bundle size < 500KB gzipped
# - No duplicate dependencies
# - Large libraries code-split
```

---

## Common Issues & Solutions

### Issue: SHADCN components not found

**Solution**:
```bash
# Reinstall SHADCN components
npx shadcn@latest add button card input
```

---

### Issue: Mock data not loading

**Solution**:
1. Check browser console for errors
2. Verify mock service imports: `@/lib/services/mock/api-client`
3. Check TanStack Query DevTools (bottom right corner)
4. Inspect network tab (should see no actual network requests)

---

### Issue: Tests failing

**Solution**:
```bash
# Clear test cache
npm run test:clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run tests in verbose mode
npm run test -- --verbose
```

---

### Issue: TypeScript errors

**Solution**:
```bash
# Regenerate TypeScript config
npx tsc --init

# Check for missing type definitions
npm install --save-dev @types/node @types/react @types/d3

# Restart TypeScript server (VS Code)
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Next Steps

After completing development:

1. **Run Full Test Suite**:
   ```bash
   npm run test:all
   npm run test:e2e
   ```

2. **Check Code Quality**:
   ```bash
   npm run lint
   npm run type-check
   ```

3. **Performance Audit**:
   ```bash
   npm run build
   npm run analyze
   # Run Lighthouse audit
   ```

4. **Accessibility Audit**:
   - Run axe DevTools
   - Manual keyboard testing
   - Screen reader testing

5. **Documentation**:
   - Update README.md
   - Document component usage
   - Add JSDoc comments to complex functions

6. **Code Review**:
   - Create PR from `001-frontend-dashboard` to `main`
   - Request review from team
   - Address feedback

7. **Deployment** (future):
   - Deploy to Vercel/Netlify
   - Configure environment variables
   - Set up CI/CD pipeline

---

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **SHADCN UI**: https://ui.shadcn.com
- **Recharts**: https://recharts.org
- **D3.js**: https://d3js.org
- **TanStack Query**: https://tanstack.com/query
- **Vitest**: https://vitest.dev
- **Playwright**: https://playwright.dev

---

**Questions or Issues?**  
Contact the development team or create an issue in the repository.
