export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type VenueType =
  | 'theater'
  | 'arena'
  | 'concert_hall'
  | 'stadium'
  | 'amphitheater'
  | 'other';

export interface Coordinates {
  x: number;
  y: number;
}

export interface SeatMapSection {
  sectionId: string;
  path: string;
  labelPosition: Coordinates;
}

export interface SeatMapData {
  svgContent: string;
  viewBox: string;
  sections: SeatMapSection[];
}

export interface VenueLayout {
  type: VenueType;
  floors: number;
  seatMapUrl?: string;
  seatMapData?: SeatMapData;
}

export interface Venue {
  id: string;
  name: string;
  address: Address;
  capacity: number;
  layout: VenueLayout;
  amenities: string[];
  parkingInfo?: string;
  publicTransit?: string[];
  images?: string[];
}
