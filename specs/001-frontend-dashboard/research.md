# Research: Event Ticket Analytics Dashboard

**Feature**: 001-frontend-dashboard  
**Date**: 2026-01-07  
**Purpose**: Document technical decisions and library selections for the frontend implementation

## Key Technical Decisions

### 1. UI Component Library: SHADCN UI

**Decision**: Use SHADCN UI components as-is with minimal customization

**Rationale**:
- Copy-paste component model provides full control over code
- Built on Radix UI primitives for accessibility
- Tailwind CSS integration is seamless
- No runtime dependencies (components are copied into codebase)
- Excellent TypeScript support out of the box
- Active community and comprehensive documentation

**Alternatives Considered**:
- **Material UI (MUI)**: Rejected due to larger bundle size and opinionated styling that requires significant customization
- **Chakra UI**: Rejected due to additional runtime dependencies and theming complexity
- **Ant Design**: Rejected due to design system that doesn't align with modern web aesthetics
- **Headless UI**: Considered but SHADCN provides more complete components with better defaults

**Implementation Notes**:
- Install components on-demand using `npx shadcn@latest add [component]`
- Components will be in `/components/ui`
- Minimal theming via Tailwind CSS variables in `globals.css`

---

### 2. Data Visualization: Recharts

**Decision**: Use Recharts for all chart components (price history, availability trends)

**Rationale**:
- React-first library with declarative API
- Excellent TypeScript support
- Responsive by default
- Lightweight compared to D3.js for standard charts
- Composable component architecture matches React patterns
- Good documentation and examples
- No direct D3.js knowledge required for standard charts

**Alternatives Considered**:
- **Chart.js with react-chartjs-2**: Rejected due to imperative API that doesn't feel React-native
- **Victory**: Rejected due to larger bundle size and animation performance issues
- **Nivo**: Considered but Recharts has better TypeScript support and simpler API
- **Pure D3.js**: Overkill for standard charts; reserved for custom seat map only

**Implementation Notes**:
- Use for: Line charts (price history), bar charts (comparison), area charts (availability trends)
- Custom tooltips via Recharts' `<Tooltip>` component
- Responsive container wrapper for all charts

---

### 3. Seat Map Visualization: D3.js

**Decision**: Use D3.js for custom SVG seat map rendering

**Rationale**:
- Industry standard for custom data visualizations
- Full control over SVG generation and manipulation
- Excellent performance with large datasets (2000+ seats)
- Rich ecosystem of examples and plugins
- Supports zoom/pan behaviors out of the box
- Can integrate with React via refs

**Alternatives Considered**:
- **SVG.js**: Rejected due to less mature ecosystem and fewer examples
- **Fabric.js**: Rejected as it's canvas-based (harder to make accessible)
- **Pre-built seat map libraries**: No suitable React library found for custom venue layouts
- **Pure React SVG components**: Rejected due to performance concerns with 2000+ seats

**Implementation Notes**:
- Use D3 for: SVG generation, zoom/pan behavior, seat positioning calculations
- React manages: Data flow, event handlers, tooltips
- Hybrid approach: D3 renders SVG, React handles interactivity

---

### 4. Data Fetching: TanStack Query (React Query)

**Decision**: Use TanStack Query for managing mock API calls and caching

**Rationale**:
- Excellent caching and refetching strategies
- Built-in loading and error states
- Optimistic updates support
- DevTools for debugging
- Easy to swap mock services with real API later
- TypeScript support is excellent

**Alternatives Considered**:
- **SWR**: Rejected due to less flexible caching strategies
- **Plain fetch with useState**: Rejected due to manual cache management complexity
- **Redux Toolkit Query (RTK Query)**: Rejected as overkill for this use case (no global state needed)

**Implementation Notes**:
- Simulate API latency (200-500ms) in mock services
- Use query keys: `['events']`, `['event', eventId]`, `['performance', perfId]`, `['analytics', perfId]`
- Stale time: 5 minutes (data doesn't change frequently in mock environment)

---

### 5. Testing Strategy

**Decision**: Three-tier testing approach - Vitest (unit), React Testing Library (component), Playwright (E2E)

**Rationale**:
- **Vitest**: Fast, Vite-native, excellent TypeScript support, compatible with Jest API
- **React Testing Library**: Industry standard for component testing, encourages accessibility
- **Playwright**: Cross-browser E2E testing, excellent debugging tools, auto-wait features

**Alternatives Considered**:
- **Jest**: Rejected in favor of Vitest for better Vite integration and performance
- **Cypress**: Rejected in favor of Playwright for better TypeScript support and cross-browser testing
- **Testing Library + Jest DOM**: Will use Testing Library + Vitest DOM matchers instead

**Implementation Notes**:
- Unit tests: Utilities, formatters, validators (lib/utils)
- Component tests: User interactions, rendering, accessibility
- E2E tests: Critical user flows (browse → view → interact)
- Target: 80% coverage for critical paths

---

### 6. Mock Data Architecture

**Decision**: Service layer abstraction with realistic data generators

**Rationale**:
- Clean separation between UI and data layer
- Easy to swap with real API client
- Realistic patterns help identify UI issues early
- Simulated latency tests loading states
- Type-safe contracts between UI and data

**Implementation Approach**:

```typescript
// lib/services/mock/api-client.ts
export class MockApiClient {
  private async simulateDelay(ms: number = 300): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    await this.simulateDelay();
    return generateMockEvents(filters);
  }
  
  async getPerformance(id: string): Promise<Performance> {
    await this.simulateDelay();
    return generateMockPerformance(id);
  }
  
  // ... other methods
}

// hooks/use-events.ts
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => apiClient.getEvents(filters),
  });
}
```

**Data Characteristics**:
- Consistent relationships (event IDs match performance references)
- Realistic pricing patterns (sections have different tiers, prices fluctuate slightly over time)
- Availability decreases over time (seats "sell out" gradually)
- Edge cases included (sold out performances, high demand events, price spikes)

---

### 7. Responsive Design Strategy

**Decision**: Mobile-first Tailwind CSS with responsive breakpoints

**Rationale**:
- Tailwind's utility-first approach works well with responsive design
- Mobile-first ensures core functionality on smallest screens
- Next.js Image component handles responsive images
- CSS Grid and Flexbox for complex layouts

**Breakpoints**:
- Mobile: 320px - 767px (sm)
- Tablet: 768px - 1023px (md)
- Desktop: 1024px - 1439px (lg)
- Large Desktop: 1440px+ (xl, 2xl)

**Implementation Notes**:
- Navigation: Mobile hamburger menu, desktop horizontal nav
- Charts: Responsive containers, adjust legend position
- Seat map: Scale-to-fit on mobile, full interaction on desktop
- Tables: Horizontal scroll on mobile, full display on desktop

---

### 8. Performance Optimization

**Decision**: Multi-pronged performance optimization strategy

**Strategies**:
1. **Code Splitting**: Next.js automatic route-based splitting
2. **Lazy Loading**: React.lazy for heavy components (seat map, charts)
3. **Image Optimization**: Next.js Image component with WebP
4. **Bundle Analysis**: @next/bundle-analyzer to track size
5. **React Optimization**: useMemo for expensive calculations, React.memo for pure components
6. **Virtual Scrolling**: Not needed for initial scope (pagination sufficient)

**Performance Budget**:
- Initial bundle: <500KB gzipped
- Route bundles: <200KB each
- Images: <100KB each (optimized)
- Time to Interactive: <3s on 4G

---

### 9. Accessibility (a11y) Requirements

**Decision**: WCAG 2.1 AA compliance across all components

**Implementation Checklist**:
- [ ] Color contrast ratio ≥ 4.5:1 for all text
- [ ] Keyboard navigation for all interactive elements
- [ ] Focus indicators visible on all focusable elements
- [ ] ARIA labels for icon buttons and complex widgets
- [ ] Semantic HTML (headings hierarchy, landmarks)
- [ ] Skip links for keyboard users
- [ ] Alt text for all images
- [ ] Form labels and error messages
- [ ] Screen reader testing with NVDA/VoiceOver

**Tools**:
- eslint-plugin-jsx-a11y (linting)
- axe DevTools (browser extension)
- Lighthouse accessibility audit
- Manual keyboard testing

---

## Dependencies Summary

### Production Dependencies

```json
{
  "next": "16.1.1",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "@tanstack/react-query": "^5.0.0",
  "recharts": "^2.10.0",
  "d3": "^7.8.0",
  "date-fns": "^3.0.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "latest",
  "class-variance-authority": "^0.7.0"
}
```

### Development Dependencies

```json
{
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/d3": "^7.4.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "eslint": "^9",
  "eslint-config-next": "16.1.1",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@playwright/test": "^1.40.0",
  "@next/bundle-analyzer": "^14.0.0"
}
```

---

## Open Questions & Future Considerations

### Resolved
- ✅ Should we use a state management library? **No** - React Context + TanStack Query sufficient
- ✅ Do we need server-side rendering for SEO? **No** - Analytics dashboard doesn't need SEO
- ✅ Should seat map be a separate library? **No** - Keep in monorepo for now

### Deferred to Future Sprints
- Real-time updates via WebSocket (when backend available)
- User authentication and preferences
- Advanced filtering (multi-select, range sliders)
- Data export in multiple formats (JSON, Excel)
- Offline support with service workers
- Multi-venue seat map templates
