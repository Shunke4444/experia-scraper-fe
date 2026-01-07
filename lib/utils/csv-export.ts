export interface CsvRow {
  [key: string]: string | number | boolean | null | undefined;
}

export function convertToCSV(data: CsvRow[], headers?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  const keys = headers || Object.keys(data[0]);

  const headerRow = keys.join(',');

  const rows = data.map((row) => {
    return keys
      .map((key) => {
        const value = row[key];

        if (value === null || value === undefined) {
          return '';
        }

        const stringValue = String(value);

        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (
          stringValue.includes(',') ||
          stringValue.includes('"') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(',');
  });

  return [headerRow, ...rows].join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportToCSV(data: CsvRow[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, filename);
}
