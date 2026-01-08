'use client';

import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToView: () => void;
  onReset: () => void;
  zoomLevel: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onFitToView,
  onReset,
  zoomLevel,
  minZoom = 0.5,
  maxZoom = 3,
  className,
}: ZoomControlsProps) {
  const zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-sm backdrop-blur',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        disabled={zoomLevel <= minZoom}
        title="Zoom out"
        className="h-8 w-8"
      >
        <ZoomOut className="h-4 w-4" />
        <span className="sr-only">Zoom out</span>
      </Button>

      <span className="w-12 text-center text-sm font-medium">{zoomPercentage}%</span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        disabled={zoomLevel >= maxZoom}
        title="Zoom in"
        className="h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" />
        <span className="sr-only">Zoom in</span>
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        variant="ghost"
        size="icon"
        onClick={onFitToView}
        title="Fit to view"
        className="h-8 w-8"
      >
        <Maximize2 className="h-4 w-4" />
        <span className="sr-only">Fit to view</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        title="Reset view"
        className="h-8 w-8"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reset view</span>
      </Button>
    </div>
  );
}
