export interface ChartDataset {
  label: string;
  data: number[];
  color: string;
  borderColor?: string;
  backgroundColor?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface TooltipData {
  timestamp: Date;
  price: number;
  section: string;
  availableSeats: number;
}
