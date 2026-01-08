'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Seat } from '@/lib/types/seat';
import { Section } from '@/lib/types/section';
import { SeatTooltip } from './seat-tooltip';
import { ZoomControls } from './zoom-controls';
import { SectionHighlight } from './section-highlight';
import { SeatLegend } from './seat-legend';
import { cn } from '@/lib/utils';

interface SeatMapProps {
  sections: Section[];
  onSeatSelect?: (seat: Seat, section: Section) => void;
  className?: string;
}

const SEAT_RADIUS = 8;
const SEAT_SPACING = 20;
const SECTION_PADDING = 30;

const priceTierColors: Record<string, string> = {
  premium: '#a855f7',
  standard: '#3b82f6',
  value: '#22c55e',
  accessible: '#06b6d4',
};

const statusOpacity: Record<string, number> = {
  available: 1,
  reserved: 0.6,
  sold: 0.3,
  blocked: 0.15,
};

export function SeatMapSVG({ sections, onSeatSelect, className }: SeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [hoveredSection, setHoveredSection] = useState<Section | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Calculate layout dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width, 400),
          height: Math.max(height, 400)
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Initialize D3 zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        svg.select('.seat-map-content').attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Initial fit to view
    fitToView();

    return () => {
      svg.on('.zoom', null);
    };
  }, [dimensions, sections]);

  const fitToView = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;

    const svg = d3.select(svgRef.current);
    const contentBounds = calculateContentBounds();

    if (!contentBounds) return;

    const { minX, minY, maxX, maxY } = contentBounds;
    const contentWidth = maxX - minX + SECTION_PADDING * 2;
    const contentHeight = maxY - minY + SECTION_PADDING * 2;

    const scale = Math.min(
      dimensions.width / contentWidth,
      dimensions.height / contentHeight,
      1
    ) * 0.9;

    const translateX = (dimensions.width - contentWidth * scale) / 2 - minX * scale + SECTION_PADDING * scale;
    const translateY = (dimensions.height - contentHeight * scale) / 2 - minY * scale + SECTION_PADDING * scale;

    svg.transition()
      .duration(500)
      .call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      );
  }, [dimensions, sections]);

  const calculateContentBounds = useCallback(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    sections.forEach(section => {
      section.rows.forEach(row => {
        row.seats.forEach(seat => {
          if (seat.coordinates) {
            minX = Math.min(minX, seat.coordinates.x);
            minY = Math.min(minY, seat.coordinates.y);
            maxX = Math.max(maxX, seat.coordinates.x);
            maxY = Math.max(maxY, seat.coordinates.y);
          }
        });
      });
    });

    if (minX === Infinity) return null;
    return { minX, minY, maxX, maxY };
  }, [sections]);

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  }, []);

  const handleReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  const handleSeatHover = useCallback((
    event: React.MouseEvent,
    seat: Seat | null,
    section: Section | null
  ) => {
    setHoveredSeat(seat);
    setHoveredSection(section);
    if (seat) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  }, []);

  const handleSeatClick = useCallback((seat: Seat, section: Section) => {
    if (seat.status === 'available' && onSeatSelect) {
      onSeatSelect(seat, section);
    }
  }, [onSeatSelect]);

  const handleSectionClick = useCallback((section: Section) => {
    setSelectedSection(prev => prev?.id === section.id ? null : section);
  }, []);

  // Render stage
  const renderStage = () => {
    const stageBounds = calculateContentBounds();
    if (!stageBounds) return null;

    const stageWidth = stageBounds.maxX - stageBounds.minX;
    const stageX = stageBounds.minX;
    const stageY = stageBounds.minY - 80;

    return (
      <g className="stage">
        <rect
          x={stageX}
          y={stageY}
          width={stageWidth}
          height={40}
          rx={4}
          fill="#1f2937"
          stroke="#374151"
          strokeWidth={2}
        />
        <text
          x={stageX + stageWidth / 2}
          y={stageY + 25}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize={14}
          fontWeight={500}
        >
          STAGE
        </text>
      </g>
    );
  };

  // Render sections
  const renderSections = () => {
    return sections.map(section => {
      const sectionSeats: { seat: Seat; x: number; y: number }[] = [];

      section.rows.forEach(row => {
        row.seats.forEach(seat => {
          if (seat.coordinates) {
            sectionSeats.push({
              seat,
              x: seat.coordinates.x,
              y: seat.coordinates.y,
            });
          }
        });
      });

      if (sectionSeats.length === 0) return null;

      // Calculate section bounds for label
      const xs = sectionSeats.map(s => s.x);
      const ys = sectionSeats.map(s => s.y);
      const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
      const minY = Math.min(...ys);

      return (
        <g key={section.id} className="section-group">
          {/* Section label */}
          <text
            x={centerX}
            y={minY - 20}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={12}
            fontWeight={600}
            className="cursor-pointer hover:fill-primary"
            onClick={() => handleSectionClick(section)}
          >
            {section.name}
          </text>

          {/* Seats */}
          {sectionSeats.map(({ seat, x, y }) => (
            <circle
              key={seat.id}
              cx={x}
              cy={y}
              r={SEAT_RADIUS}
              fill={priceTierColors[section.priceTier]}
              opacity={statusOpacity[seat.status]}
              stroke={hoveredSeat?.id === seat.id ? '#fff' : 'transparent'}
              strokeWidth={2}
              className={cn(
                'transition-all duration-150',
                seat.status === 'available' && 'cursor-pointer hover:opacity-80'
              )}
              onMouseEnter={(e) => handleSeatHover(e, seat, section)}
              onMouseLeave={(e) => handleSeatHover(e, null, null)}
              onMouseMove={(e) => {
                if (hoveredSeat?.id === seat.id) {
                  setTooltipPosition({ x: e.clientX, y: e.clientY });
                }
              }}
              onClick={() => handleSeatClick(seat, section)}
            />
          ))}
        </g>
      );
    });
  };

  return (
    <div className={cn('relative flex flex-col', className)}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10">
        <ZoomControls
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitToView={fitToView}
          onReset={handleReset}
        />
      </div>

      {/* Section highlight panel */}
      {selectedSection && (
        <div className="absolute top-4 left-4 z-10 w-64">
          <SectionHighlight section={selectedSection} />
        </div>
      )}

      {/* SVG Container */}
      <div
        ref={containerRef}
        className="flex-1 min-h-[400px] overflow-hidden rounded-lg border bg-muted/30"
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="touch-none"
        >
          <g className="seat-map-content">
            {renderStage()}
            {renderSections()}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4">
        <SeatLegend />
      </div>

      {/* Tooltip */}
      <SeatTooltip
        seat={hoveredSeat}
        sectionName={hoveredSection?.name}
        position={tooltipPosition}
        visible={!!hoveredSeat}
      />
    </div>
  );
}
