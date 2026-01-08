# API Contracts: Event Ticket Analytics Dashboard

**Feature**: 001-frontend-dashboard  
**Date**: 2026-01-07  
**Purpose**: Define mock API endpoint contracts for frontend development

**Note**: These contracts define the expected interface between frontend and backend. Currently implemented as mock services, but will be replaced with real API calls in future sprints.

---

## Base Configuration

**Base URL**: `http://localhost:3000/api` (mock) → `https://api.experia.com/v1` (production)  
**Content-Type**: `application/json`  
**Auth**: None (deferred to future sprint)

---

## Endpoints

### 1. GET /events

Retrieve a list of events with optional filtering.

**Query Parameters**:
```typescript
{
  search?: string;           // Search in name/description
  eventType?: EventType[];   // Filter by event types
  venueId?: string[];        // Filter by venues
  startDate?: string;        // ISO 8601 date
  endDate?: string;          // ISO 8601 date
  minPrice?: number;         // USD cents
  maxPrice?: number;         // USD cents
  availability?: 'all' | 'available' | 'selling_fast' | 'sold_out';
  page?: number;             // Page number (default: 1)
  pageSize?: number;         // Items per page (default: 20)
  sortBy?: 'name' | 'date' | 'price' | 'availability';
  sortDirection?: 'asc' | 'desc';
}
```

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": "evt_123abc",
      "name": "Swan Lake",
      "description": "Classical ballet by Pyotr Ilyich Tchaikovsky...",
      "venue": {
        "id": "venue_koch",
        "name": "David H. Koch Theater",
        "address": {
          "street": "20 Lincoln Center Plaza",
          "city": "New York",
          "state": "NY",
          "zipCode": "10023",
          "country": "USA"
        }
      },
      "eventType": "ballet",
      "dateRange": {
        "start": "2026-02-01T00:00:00Z",
        "end": "2026-02-28T00:00:00Z"
      },
      "thumbnail": "/images/events/swan-lake.jpg",
      "performanceCount": 12,
      "priceRange": {
        "min": 5000,
        "max": 25000
      },
      "tags": ["classical", "ballet", "tchaikovsky"],
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-07T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

---

### 2. GET /events/:eventId

Retrieve detailed information for a specific event.

**Path Parameters**:
- `eventId` (string, required): Event identifier

**Response**: 200 OK
```json
{
  "data": {
    "id": "evt_123abc",
    "name": "Swan Lake",
    "description": "Classical ballet by Pyotr Ilyich Tchaikovsky...",
    "venue": { /* same as above */ },
    "eventType": "ballet",
    "dateRange": {
      "start": "2026-02-01T00:00:00Z",
      "end": "2026-02-28T00:00:00Z"
    },
    "thumbnail": "/images/events/swan-lake.jpg",
    "performances": [
      {
        "id": "perf_456def",
        "performanceDate": "2026-02-15T19:30:00Z",
        "status": "on_sale",
        "availableSeats": 1200,
        "totalSeats": 2586,
        "priceRange": {
          "min": 5000,
          "max": 25000
        }
      }
    ],
    "tags": ["classical", "ballet", "tchaikovsky"],
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-07T12:00:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Event does not exist
- `500 Internal Server Error`: Server error

---

### 3. GET /performances/:performanceId

Retrieve detailed information for a specific performance.

**Path Parameters**:
- `performanceId` (string, required): Performance identifier

**Response**: 200 OK
```json
{
  "data": {
    "id": "perf_456def",
    "eventId": "evt_123abc",
    "event": {
      "id": "evt_123abc",
      "name": "Swan Lake",
      "thumbnail": "/images/events/swan-lake.jpg"
    },
    "venue": { /* full venue object */ },
    "performanceDate": "2026-02-15T19:30:00Z",
    "doors": "2026-02-15T18:30:00Z",
    "duration": 150,
    "status": "on_sale",
    "sections": [
      {
        "id": "sec_orch_center",
        "name": "Orchestra Center",
        "priceTier": "premium",
        "price": 25000,
        "totalSeats": 300,
        "availableSeats": 145,
        "location": {
          "floor": "Orchestra Level",
          "position": "Center",
          "distanceFromStage": 15
        },
        "amenities": ["Best view", "Close to stage"]
      }
    ],
    "totalSeats": 2586,
    "availableSeats": 1200,
    "soldSeats": 1386,
    "priceRange": {
      "min": 5000,
      "max": 25000
    },
    "metadata": {
      "cast": ["Principal Dancer 1", "Principal Dancer 2"],
      "runtime": 150,
      "intermissions": 1,
      "ageRestriction": "All ages",
      "specialNotes": "Live orchestra performance"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-07T12:00:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Performance does not exist
- `500 Internal Server Error`: Server error

---

### 4. GET /performances/:performanceId/seat-map

Retrieve seat-level data and SVG layout for seat map visualization.

**Path Parameters**:
- `performanceId` (string, required): Performance identifier

**Response**: 200 OK
```json
{
  "data": {
    "performanceId": "perf_456def",
    "venue": {
      "id": "venue_koch",
      "name": "David H. Koch Theater",
      "layout": {
        "type": "theater",
        "floors": 3,
        "seatMapData": {
          "svgContent": "<svg>...</svg>",
          "viewBox": "0 0 1000 800",
          "sections": [
            {
              "sectionId": "sec_orch_center",
              "path": "M 100,200 L 300,200 L 300,400 L 100,400 Z",
              "labelPosition": { "x": 200, "y": 300 }
            }
          ]
        }
      }
    },
    "sections": [
      {
        "id": "sec_orch_center",
        "name": "Orchestra Center",
        "priceTier": "premium",
        "price": 25000,
        "totalSeats": 300,
        "availableSeats": 145,
        "rows": [
          {
            "row": "A",
            "seats": [
              {
                "id": "seat_orch_a1",
                "sectionId": "sec_orch_center",
                "row": "A",
                "number": "1",
                "status": "available",
                "price": 25000,
                "coordinates": { "x": 150, "y": 220 },
                "features": {
                  "aisle": true,
                  "accessible": false
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Error Responses**:
- `404 Not Found`: Performance or seat map does not exist
- `500 Internal Server Error`: Server error

---

### 5. GET /performances/:performanceId/analytics/price-history

Retrieve historical price data for analytics visualization.

**Path Parameters**:
- `performanceId` (string, required): Performance identifier

**Query Parameters**:
```typescript
{
  sectionId?: string[];      // Filter by sections (default: all)
  timeRange?: '24h' | '7d' | '30d' | 'all';  // Default: '7d'
  granularity?: 'hour' | 'day' | 'week';     // Data point frequency
}
```

**Response**: 200 OK
```json
{
  "data": {
    "performanceId": "perf_456def",
    "sections": [
      {
        "sectionId": "sec_orch_center",
        "sectionName": "Orchestra Center",
        "currentPrice": 25000,
        "history": [
          {
            "timestamp": "2026-01-01T00:00:00Z",
            "price": 24000,
            "availableSeats": 300,
            "soldSeats": 0
          },
          {
            "timestamp": "2026-01-02T00:00:00Z",
            "price": 24500,
            "availableSeats": 285,
            "soldSeats": 15
          }
        ],
        "priceChange24h": 2.1,
        "priceChange7d": 4.2,
        "lowestPrice": 24000,
        "highestPrice": 25000,
        "averagePrice": 24600
      }
    ],
    "lastUpdated": "2026-01-07T12:00:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Performance does not exist
- `500 Internal Server Error`: Server error

---

### 6. GET /performances/:performanceId/analytics/availability

Retrieve availability trends over time.

**Path Parameters**:
- `performanceId` (string, required): Performance identifier

**Query Parameters**:
```typescript
{
  sectionId?: string[];      // Filter by sections (default: all)
  timeRange?: '24h' | '7d' | '30d' | 'all';
}
```

**Response**: 200 OK
```json
{
  "data": {
    "performanceId": "perf_456def",
    "sections": [
      {
        "sectionId": "sec_orch_center",
        "sectionName": "Orchestra Center",
        "dataPoints": [
          {
            "timestamp": "2026-01-01T00:00:00Z",
            "availableSeats": 300,
            "soldSeats": 0,
            "percentageAvailable": 100
          },
          {
            "timestamp": "2026-01-07T12:00:00Z",
            "availableSeats": 145,
            "soldSeats": 155,
            "percentageAvailable": 48.3
          }
        ],
        "sellingVelocity": 3.7,
        "projectedSellout": "2026-02-10T14:30:00Z"
      }
    ],
    "lastUpdated": "2026-01-07T12:00:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Performance does not exist
- `500 Internal Server Error`: Server error

---

### 7. POST /performances/compare

Compare multiple performances side-by-side.

**Request Body**:
```json
{
  "performanceIds": ["perf_456def", "perf_789ghi", "perf_012jkl"]
}
```

**Response**: 200 OK
```json
{
  "data": {
    "performances": [
      {
        "performance": { /* full performance object */ },
        "sections": [
          {
            "sectionName": "Orchestra Center",
            "price": 25000,
            "availableSeats": 145,
            "percentageAvailable": 48.3,
            "pricePerSeat": 25000,
            "value": "good"
          }
        ],
        "totalAvailability": 46.4,
        "priceRange": {
          "min": 5000,
          "max": 25000
        },
        "recommendedSections": ["sec_mezz_center", "sec_orch_side"]
      }
    ],
    "generatedAt": "2026-01-07T12:00:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid performance IDs or empty list
- `404 Not Found`: One or more performances do not exist
- `500 Internal Server Error`: Server error

---

### 8. GET /venues/:venueId

Retrieve venue information.

**Path Parameters**:
- `venueId` (string, required): Venue identifier

**Response**: 200 OK
```json
{
  "data": {
    "id": "venue_koch",
    "name": "David H. Koch Theater",
    "address": {
      "street": "20 Lincoln Center Plaza",
      "city": "New York",
      "state": "NY",
      "zipCode": "10023",
      "country": "USA"
    },
    "capacity": 2586,
    "layout": {
      "type": "theater",
      "floors": 3,
      "seatMapUrl": "/seat-maps/koch-theater.svg"
    },
    "amenities": [
      "Accessible seating",
      "Coat check",
      "Gift shop",
      "Restaurant"
    ],
    "parkingInfo": "Parking garage available at 62nd Street and Amsterdam Avenue",
    "publicTransit": [
      "Subway: 1 train to 66th Street",
      "Bus: M5, M7, M11, M104"
    ],
    "images": [
      "/images/venues/koch-exterior.jpg",
      "/images/venues/koch-interior.jpg"
    ]
  }
}
```

**Error Responses**:
- `404 Not Found`: Venue does not exist
- `500 Internal Server Error`: Server error

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      /* Additional context (optional) */
    }
  }
}
```

**Common Error Codes**:
- `VALIDATION_ERROR`: Invalid request parameters
- `NOT_FOUND`: Resource does not exist
- `INTERNAL_ERROR`: Server-side error
- `RATE_LIMIT_EXCEEDED`: Too many requests (future)
- `UNAUTHORIZED`: Authentication required (future)

---

## Mock Implementation Notes

### Simulated Latency
- List endpoints: 200-400ms
- Detail endpoints: 150-300ms
- Analytics endpoints: 300-500ms (data processing simulation)

### Data Consistency
- All relationships (event → performance → section → seat) must be valid
- Timestamps should be realistic and sequential
- Availability should decrease over time (simulate sales)
- Prices should fluctuate within reasonable ranges (±10%)

### Error Simulation
- 5% chance of network timeout (for testing error states)
- Occasional "not found" for invalid IDs
- Slow responses for large datasets (> 1000 items)

---

## Future API Enhancements (Post-MVP)

- WebSocket endpoint for real-time availability updates
- POST /cart endpoints for seat reservation
- POST /auth endpoints for user authentication
- GET /user/preferences for saved searches/favorites
- POST /alerts for price drop notifications
- GET /recommendations for personalized suggestions
