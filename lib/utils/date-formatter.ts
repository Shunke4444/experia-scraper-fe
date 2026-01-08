import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isThisWeek,
  parseISO,
} from 'date-fns';

export type DateFormatStyle = 'short' | 'medium' | 'long';

const dateFormats: Record<DateFormatStyle, string> = {
  short: 'M/d/yy',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
};

export function formatDate(date: Date | string, style: DateFormatStyle = 'medium'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, dateFormats[style]);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;

  const startYear = format(startDate, 'yyyy');
  const endYear = format(endDate, 'yyyy');

  if (startYear === endYear) {
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  }

  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) {
    return `Today at ${format(d, 'h:mm a')}`;
  }

  if (isTomorrow(d)) {
    return `Tomorrow at ${format(d, 'h:mm a')}`;
  }

  if (isThisWeek(d)) {
    return format(d, 'EEEE h:mm a');
  }

  return formatDateTime(d);
}

export function formatRelativeTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}
