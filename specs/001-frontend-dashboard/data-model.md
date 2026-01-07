# Data Model: Event Ticket Analytics Dashboard

**Feature**: 001-frontend-dashboard  
**Date**: 2026-01-07  
**Purpose**: Define TypeScript interfaces for all domain entities

## Core Entities

### Event

Represents a show or production with multiple performances.

```typescript
interface Event {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Event name (e.g., "Swan Lake")
  description: string;           // Full description with HTML support
  venue: Venue;                  // Venue reference
  eventType: EventType;          // Event category
  dateRange: DateRange;          // Start and end dates
  thumbnail: string;             // Image URL
  performances: Performance[];   // Associated performances
  tags: string[];               // Searchable tags
  createdAt: Date;              // Record creation timestamp
  updatedAt: Date;              // Last update timestamp
}

type EventType = 
  | 'ballet' 
  | 'opera' 
  | 'theater' 
  | 'concert' 
  | 'musical' 
  | 'dance'
  | 'other';

interface DateRange {
  start: Date;
  end: Date;
}
```

**Validation Rules**:
- `id`: Must be valid UUID format
- `name`: Required, 1-200 characters
- `description`: Required, max 5000 characters
- `dateRange.start`: Must be before `dateRange.end`
- `performances`: Must contain at least 1 performance

**State Transitions**: None (static data in mock environment)

---

### Performance

Represents a specific showing of an event.

```typescript
interface Performance {
  id: string;                    // Unique identifier (UUID)
  eventId: string;               // Reference to Event
  event?: Event;                 // Populated event (optional join)
  venue: Venue;                  // Venue reference
  performanceDate: Date;         // Date and time of performance
  doors: Date;                   // When doors open
  duration: number;              // Duration in minutes
  status: PerformanceStatus;     // Current status
  sections: Section[];           // Seating sections
  totalSeats: number;            // Total capacity
  availableSeats: number;        // Currently available
  soldSeats: number;             // Already sold
  priceRange: PriceRange;        // Min/max prices
  metadata: PerformanceMetadata; // Additional details
  createdAt: Date;
  updatedAt: Date;
}

type PerformanceStatus = 
  | 'on_sale'      // Tickets available
  | 'selling_fast' // Low availability (< 20%)
  | 'sold_out'     // No tickets available
  | 'cancelled'    // Performance cancelled
  | 'postponed';   // Rescheduled

interface PriceRange {
  min: number;  // Lowest price (USD cents)
  max: number;  // Highest price (USD cents)
}

interface PerformanceMetadata {
  cast?: string[];           // Performers/actors
  runtime?: number;          // Including intermissions
  intermissions?: number;    // Number of intermissions
  ageRestriction?: string;   // e.g., "All ages", "18+"
  specialNotes?: string;     // Important notices
}
```

**Validation Rules**:
- `eventId`: Must reference existing Event
- `performanceDate`: Must be in the future (for active performances)
- `doors`: Must be before `performanceDate`
- `availableSeats + soldSeats` should equal `totalSeats`
- `priceRange.min` < `priceRange.max`

**State Transitions**:
- `on_sale` → `selling_fast` (when `availableSeats / totalSeats < 0.2`)
- `on_sale` / `selling_fast` → `sold_out` (when `availableSeats === 0`)
- Any status → `cancelled` or `postponed` (admin action)

---

### Section

Represents a venue seating section with pricing tier.

```typescript
interface Section {
  id: string;                    // Unique identifier
  performanceId: string;         // Reference to Performance
  name: string;                  // Section name (e.g., "Orchestra", "Balcony")
  priceTier: PriceTier;         // Pricing category
  price: number;                 // Current price (USD cents)
  totalSeats: number;            // Section capacity
  availableSeats: number;        // Currently available
  location: SectionLocation;     // Physical location metadata
  amenities: string[];           // Section features
  restrictions?: string[];       // Access limitations
  rows: Row[];                   // Seat rows (optional detail)
}

type PriceTier = 
  | 'premium'     // Highest price tier
  | 'standard'    // Mid-range tier
  | 'value'       // Budget tier
  | 'accessible'; // ADA/accessible seating

interface SectionLocation {
  floor: string;           // e.g., "Orchestra Level", "Mezzanine"
  position: string;        // e.g., "Center", "Left", "Right"
  distanceFromStage?: number; // Meters (optional)
}
```

**Validation Rules**:
- `name`: Required, unique within performance
- `price`: Must be > 0
- `availableSeats`: Must be ≤ `totalSeats`
- `priceTier`: Must match expected price ranges (premium > standard > value)

---

### Seat

Represents an individual seat within a section.

```typescript
interface Seat {
  id: string;                    // Unique identifier
  sectionId: string;             // Reference to Section
  row: string;                   // Row identifier (e.g., "A", "12")
  number: string;                // Seat number within row
  status: SeatStatus;            // Availability status
  price: number;                 // Current price (USD cents)
  coordinates?: Coordinates;     // SVG coordinates for seat map
  features?: SeatFeatures;       // Special characteristics
}

type SeatStatus = 
  | 'available'    // Can be purchased
  | 'reserved'     // In someone's cart
  | 'sold'         // Already purchased
  | 'blocked';     // Not for sale (e.g., obstructed view)

interface Coordinates {
  x: number;  // SVG x position
  y: number;  // SVG y position
}

interface SeatFeatures {
  accessible?: boolean;      // ADA accessible
  aisle?: boolean;           // Aisle seat
  obstructedView?: boolean;  // Limited view
  extraLegroom?: boolean;    // More space
}
```

**Validation Rules**:
- `row` + `number`: Must be unique within section
- `status === 'available'`: Seat can be selected
- `price`: Should match section price (may vary for special seats)

**State Transitions**:
- `available` → `reserved` (user adds to cart, 15min hold)
- `reserved` → `available` (timeout or cart abandonment)
- `reserved` → `sold` (purchase completed)
- Any status → `blocked` (admin action)

---

### PriceHistory

Represents historical pricing and availability data.

```typescript
interface PriceHistory {
  id: string;
  performanceId: string;         // Reference to Performance
  sectionId: string;             // Reference to Section
  timestamp: Date;               // When data was captured
  price: number;                 // Price at this time (USD cents)
  availableSeats: number;        // Seats available at this time
  soldSeats: number;             // Seats sold at this time
  changeType?: PriceChangeType;  // Type of change (optional)
}

type PriceChangeType = 
  | 'increase' 
  | 'decrease' 
  | 'unchanged';

// Aggregated analytics view
interface PriceAnalytics {
  sectionId: string;
  sectionName: string;
  currentPrice: number;
  history: PriceHistory[];       // Time series data
  priceChange24h: number;        // Change in last 24h (percentage)
  priceChange7d: number;         // Change in last 7d (percentage)
  lowestPrice: number;           // Historical low
  highestPrice: number;          // Historical high
  averagePrice: number;          // Mean price
  lastUpdated: Date;
}
```

**Validation Rules**:
- `timestamp`: Must be in the past
- `price`: Must be > 0
- `availableSeats + soldSeats`: Should match section capacity
- Data points sorted by `timestamp` ascending

---

### Venue

Represents a performance venue with layout metadata.

```typescript
interface Venue {
  id: string;
  name: string;                  // Venue name
  address: Address;              // Full address
  capacity: number;              // Total seating capacity
  layout: VenueLayout;           // Seating layout metadata
  amenities: string[];           // Venue features
  parkingInfo?: string;          // Parking details
  publicTransit?: string[];      // Transit options
  images?: string[];             // Venue photos
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface VenueLayout {
  type: VenueType;               // Layout category
  floors: number;                // Number of levels
  seatMapUrl?: string;           // SVG seat map URL
  seatMapData?: SeatMapData;     // Embedded SVG data
}

type VenueType = 
  | 'theater'      // Traditional theater
  | 'arena'        // Large arena
  | 'concert_hall' // Concert hall
  | 'stadium'      // Outdoor stadium
  | 'amphitheater' // Open-air venue
  | 'other';

interface SeatMapData {
  svgContent: string;            // Raw SVG markup
  viewBox: string;               // SVG viewBox attribute
  sections: SeatMapSection[];    // Section coordinates
}

interface SeatMapSection {
  sectionId: string;
  path: string;                  // SVG path for section outline
  labelPosition: Coordinates;    // Where to place section label
}
```

**Validation Rules**:
- `name`: Required, unique
- `capacity`: Must be > 0
- `address`: All fields required
- `layout.seatMapUrl` XOR `layout.seatMapData`: One must be present

---

## Analytics Entities

### AvailabilityTrend

Tracks seat availability over time.

```typescript
interface AvailabilityTrend {
  performanceId: string;
  sectionId: string;
  sectionName: string;
  dataPoints: AvailabilityDataPoint[];
  sellingVelocity: number;       // Seats per hour
  projectedSellout?: Date;       // Estimated sellout time
}

interface AvailabilityDataPoint {
  timestamp: Date;
  availableSeats: number;
  soldSeats: number;
  percentageAvailable: number;   // 0-100
}
```

---

### ComparisonData

Side-by-side performance comparison.

```typescript
interface ComparisonData {
  performances: PerformanceComparison[];
  generatedAt: Date;
}

interface PerformanceComparison {
  performance: Performance;
  sections: SectionComparison[];
  totalAvailability: number;     // Percentage
  priceRange: PriceRange;
  recommendedSections: string[]; // Best value sections
}

interface SectionComparison {
  sectionName: string;
  price: number;
  availableSeats: number;
  percentageAvailable: number;
  pricePerSeat: number;          // Normalized price
  value: ValueRating;            // Price vs location rating
}

type ValueRating = 'excellent' | 'good' | 'fair' | 'premium';
```

---

## UI-Specific Types

### Filter & Search

```typescript
interface EventFilters {
  search?: string;               // Name/description search
  eventTypes?: EventType[];      // Filter by type
  venues?: string[];             // Filter by venue IDs
  dateRange?: DateRange;         // Filter by date
  priceRange?: PriceRange;       // Filter by price
  availability?: AvailabilityFilter;
}

type AvailabilityFilter = 
  | 'all'
  | 'available'   // Has tickets
  | 'selling_fast'
  | 'sold_out';

interface SortOption {
  field: 'name' | 'date' | 'price' | 'availability';
  direction: 'asc' | 'desc';
}
```

---

### Chart Data

```typescript
interface ChartData {
  labels: string[];              // X-axis labels
  datasets: ChartDataset[];      // Y-axis data series
}

interface ChartDataset {
  label: string;                 // Series name
  data: number[];                // Data points
  color: string;                 // Line/bar color
  borderColor?: string;
  backgroundColor?: string;
}
```

---

## Relationships

```
Event (1) ──→ (N) Performance
Performance (1) ──→ (N) Section
Section (1) ──→ (N) Seat
Section (1) ──→ (N) PriceHistory
Performance (N) ──→ (1) Venue
Event (N) ──→ (1) Venue
```

---

## Mock Data Generation Notes

- **Events**: Generate 20-30 events across different types
- **Performances**: 3-10 performances per event, spread over 2-6 weeks
- **Sections**: 4-8 sections per performance (Premium, Standard, Value, Accessible)
- **Seats**: 50-300 seats per section (total ~2000 per performance)
- **PriceHistory**: 10-50 data points per section, 1-30 days historical data
- **Availability**: Gradually decrease over time (simulate selling)
- **Price Changes**: Small fluctuations (±5-10%), occasional spikes for high demand

All mock data should maintain referential integrity and realistic patterns to test UI edge cases.
