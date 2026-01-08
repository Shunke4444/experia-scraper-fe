import { Section, PriceTier, Row } from '@/lib/types/section';
import { Seat, SeatStatus } from '@/lib/types/seat';

const sectionTemplates: {
  name: string;
  tier: PriceTier;
  floor: string;
  position: string;
  basePrice: number;
  seatCount: number;
}[] = [
  {
    name: 'Orchestra Center',
    tier: 'premium',
    floor: 'Orchestra Level',
    position: 'Center',
    basePrice: 25000,
    seatCount: 300,
  },
  {
    name: 'Orchestra Left',
    tier: 'premium',
    floor: 'Orchestra Level',
    position: 'Left',
    basePrice: 22000,
    seatCount: 200,
  },
  {
    name: 'Orchestra Right',
    tier: 'premium',
    floor: 'Orchestra Level',
    position: 'Right',
    basePrice: 22000,
    seatCount: 200,
  },
  {
    name: 'Mezzanine Center',
    tier: 'standard',
    floor: 'Mezzanine',
    position: 'Center',
    basePrice: 15000,
    seatCount: 250,
  },
  {
    name: 'Mezzanine Side',
    tier: 'standard',
    floor: 'Mezzanine',
    position: 'Side',
    basePrice: 12000,
    seatCount: 300,
  },
  {
    name: 'Balcony',
    tier: 'value',
    floor: 'Balcony',
    position: 'Center',
    basePrice: 7500,
    seatCount: 400,
  },
  {
    name: 'Upper Balcony',
    tier: 'value',
    floor: 'Upper Balcony',
    position: 'Center',
    basePrice: 5000,
    seatCount: 500,
  },
  {
    name: 'Accessible',
    tier: 'accessible',
    floor: 'Orchestra Level',
    position: 'Side',
    basePrice: 15000,
    seatCount: 50,
  },
];

function generateSeats(
  sectionId: string,
  seatCount: number,
  price: number,
  soldPercentage: number
): { seats: Seat[]; rows: Row[] } {
  const seats: Seat[] = [];
  const rowsMap: Map<string, Seat[]> = new Map();

  const rowCount = Math.ceil(seatCount / 20);
  const seatsPerRow = Math.ceil(seatCount / rowCount);

  let seatIndex = 0;
  for (let r = 0; r < rowCount; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    const rowSeats: Seat[] = [];

    for (let s = 0; s < seatsPerRow && seatIndex < seatCount; s++) {
      const seatNumber = (s + 1).toString();
      const isSold = Math.random() < soldPercentage;

      const seat: Seat = {
        id: `seat_${sectionId}_${rowLetter}${seatNumber}`,
        sectionId,
        row: rowLetter,
        number: seatNumber,
        status: isSold ? 'sold' : 'available',
        price: price + Math.floor(Math.random() * 500) - 250,
        coordinates: {
          x: 100 + s * 15,
          y: 100 + r * 20,
        },
        features: {
          aisle: s === 0 || s === seatsPerRow - 1,
          accessible: false,
        },
      };

      seats.push(seat);
      rowSeats.push(seat);
      seatIndex++;
    }

    rowsMap.set(rowLetter, rowSeats);
  }

  const rows: Row[] = Array.from(rowsMap.entries()).map(([row, rowSeats]) => ({
    row,
    seats: rowSeats,
  }));

  return { seats, rows };
}

export function generateMockSections(
  performanceId: string,
  soldPercentage: number = 0.4
): Section[] {
  return sectionTemplates.map((template, index) => {
    const sectionId = `sec_${performanceId}_${index}`;
    const priceVariation = Math.floor(Math.random() * 2000) - 1000;
    const price = template.basePrice + priceVariation;

    const { seats, rows } = generateSeats(
      sectionId,
      template.seatCount,
      price,
      soldPercentage
    );

    const availableSeats = seats.filter((s) => s.status === 'available').length;

    return {
      id: sectionId,
      performanceId,
      name: template.name,
      priceTier: template.tier,
      price,
      totalSeats: template.seatCount,
      availableSeats,
      location: {
        floor: template.floor,
        position: template.position,
        distanceFromStage: template.tier === 'premium' ? 10 : template.tier === 'standard' ? 25 : 40,
      },
      amenities:
        template.tier === 'premium'
          ? ['Best view', 'Close to stage', 'Premium seating']
          : template.tier === 'accessible'
          ? ['Wheelchair accessible', 'Companion seating']
          : [],
      restrictions: template.tier === 'accessible' ? ['Requires accessibility verification'] : undefined,
      rows,
    };
  });
}

export function getSectionById(sections: Section[], sectionId: string): Section | undefined {
  return sections.find((s) => s.id === sectionId);
}
