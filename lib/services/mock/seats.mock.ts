import { Seat, SeatStatus } from '@/lib/types/seat';
import { Section } from '@/lib/types/section';
import { SeatMapData, SeatMapSection, Coordinates } from '@/lib/types/venue';

export interface SeatMapResponse {
  performanceId: string;
  venue: {
    id: string;
    name: string;
    layout: {
      type: string;
      floors: number;
      seatMapData: SeatMapData;
    };
  };
  sections: Section[];
}

function generateSVGPath(sectionIndex: number, totalSections: number): string {
  const width = 800;
  const height = 600;
  const cols = 3;
  const rows = Math.ceil(totalSections / cols);

  const col = sectionIndex % cols;
  const row = Math.floor(sectionIndex / cols);

  const sectionWidth = (width - 100) / cols;
  const sectionHeight = (height - 200) / rows;

  const x = 50 + col * sectionWidth + 10;
  const y = 150 + row * sectionHeight + 10;
  const w = sectionWidth - 20;
  const h = sectionHeight - 20;

  return `M ${x},${y} L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} Z`;
}

function generateSeatCoordinates(
  sectionIndex: number,
  rowIndex: number,
  seatIndex: number,
  totalSections: number
): Coordinates {
  const width = 800;
  const cols = 3;
  const rows = Math.ceil(totalSections / cols);

  const col = sectionIndex % cols;
  const row = Math.floor(sectionIndex / cols);

  const sectionWidth = (width - 100) / cols;
  const sectionHeight = 400 / rows;

  const baseX = 60 + col * sectionWidth;
  const baseY = 160 + row * sectionHeight;

  return {
    x: baseX + seatIndex * 12 + 5,
    y: baseY + rowIndex * 15 + 5,
  };
}

export function generateSeatMapData(sections: Section[]): SeatMapData {
  const seatMapSections: SeatMapSection[] = sections.map((section, index) => ({
    sectionId: section.id,
    path: generateSVGPath(index, sections.length),
    labelPosition: {
      x: 100 + (index % 3) * 250,
      y: 200 + Math.floor(index / 3) * 150,
    },
  }));

  const svgContent = `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Stage -->
      <rect x="200" y="20" width="400" height="80" fill="#374151" rx="5"/>
      <text x="400" y="65" text-anchor="middle" fill="white" font-size="20">STAGE</text>

      <!-- Section outlines -->
      ${seatMapSections
        .map(
          (sec, i) => `
        <path d="${sec.path}" fill="none" stroke="#6b7280" stroke-width="2"/>
        <text x="${sec.labelPosition.x}" y="${sec.labelPosition.y}" text-anchor="middle" font-size="12" fill="#374151">
          ${sections[i].name}
        </text>
      `
        )
        .join('')}
    </svg>
  `;

  return {
    svgContent,
    viewBox: '0 0 800 600',
    sections: seatMapSections,
  };
}

export function updateSeatCoordinates(sections: Section[]): Section[] {
  return sections.map((section, sectionIndex) => ({
    ...section,
    rows: section.rows.map((row, rowIndex) => ({
      ...row,
      seats: row.seats.map((seat, seatIndex) => ({
        ...seat,
        coordinates: generateSeatCoordinates(
          sectionIndex,
          rowIndex,
          seatIndex,
          sections.length
        ),
      })),
    })),
  }));
}

export function getAllSeatsFromSections(sections: Section[]): Seat[] {
  return sections.flatMap((section) =>
    section.rows.flatMap((row) => row.seats)
  );
}

export function getSeatById(sections: Section[], seatId: string): Seat | undefined {
  for (const section of sections) {
    for (const row of section.rows) {
      const seat = row.seats.find((s) => s.id === seatId);
      if (seat) return seat;
    }
  }
  return undefined;
}
