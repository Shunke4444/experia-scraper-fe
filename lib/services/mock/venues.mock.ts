import { Venue, VenueType } from '@/lib/types/venue';

const venueData: Venue[] = [
  {
    id: 'venue_koch',
    name: 'David H. Koch Theater',
    address: {
      street: '20 Lincoln Center Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10023',
      country: 'USA',
    },
    capacity: 2586,
    layout: {
      type: 'theater',
      floors: 3,
      seatMapUrl: '/seat-maps/koch-theater.svg',
    },
    amenities: ['Accessible seating', 'Coat check', 'Gift shop', 'Restaurant'],
    parkingInfo: 'Parking garage available at 62nd Street and Amsterdam Avenue',
    publicTransit: ['Subway: 1 train to 66th Street', 'Bus: M5, M7, M11, M104'],
    images: ['/images/venues/koch-exterior.jpg', '/images/venues/koch-interior.jpg'],
  },
  {
    id: 'venue_met',
    name: 'Metropolitan Opera House',
    address: {
      street: '30 Lincoln Center Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10023',
      country: 'USA',
    },
    capacity: 3800,
    layout: {
      type: 'theater',
      floors: 6,
      seatMapUrl: '/seat-maps/met-opera.svg',
    },
    amenities: ['Accessible seating', 'Restaurant', 'Gift shop', 'Audio description'],
    parkingInfo: 'Lincoln Center parking available',
    publicTransit: ['Subway: 1 train to 66th Street', 'Bus: M5, M7, M11, M66'],
  },
  {
    id: 'venue_carnegie',
    name: 'Carnegie Hall',
    address: {
      street: '881 7th Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10019',
      country: 'USA',
    },
    capacity: 2804,
    layout: {
      type: 'concert_hall',
      floors: 5,
      seatMapUrl: '/seat-maps/carnegie.svg',
    },
    amenities: ['Accessible seating', 'Gift shop', 'Cafe'],
    parkingInfo: 'Nearby parking garages available',
    publicTransit: ['Subway: N, Q, R to 57th Street', 'Bus: M57, M31'],
  },
  {
    id: 'venue_beacon',
    name: 'Beacon Theatre',
    address: {
      street: '2124 Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10023',
      country: 'USA',
    },
    capacity: 2894,
    layout: {
      type: 'theater',
      floors: 3,
      seatMapUrl: '/seat-maps/beacon.svg',
    },
    amenities: ['Accessible seating', 'Concessions', 'Merchandise'],
    parkingInfo: 'Street parking and nearby garages',
    publicTransit: ['Subway: 1, 2, 3 to 72nd Street'],
  },
  {
    id: 'venue_radio',
    name: 'Radio City Music Hall',
    address: {
      street: '1260 6th Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10020',
      country: 'USA',
    },
    capacity: 5960,
    layout: {
      type: 'theater',
      floors: 3,
      seatMapUrl: '/seat-maps/radio-city.svg',
    },
    amenities: ['Accessible seating', 'Restaurants', 'Gift shop', 'Tours'],
    parkingInfo: 'Rockefeller Center parking',
    publicTransit: ['Subway: B, D, F, M to 47-50 Streets'],
  },
];

export function generateMockVenues(): Venue[] {
  return venueData;
}

export function generateMockVenue(id: string): Venue | undefined {
  return venueData.find((v) => v.id === id);
}

export function getRandomVenue(): Venue {
  return venueData[Math.floor(Math.random() * venueData.length)];
}
