/**
 * CSV Export Utility
 *
 * Exports data to CSV with proper escaping and BOM for Excel compatibility.
 */

/**
 * Escape a CSV cell value to handle commas, quotes, and newlines.
 */
function escapeCSVCell(value: string | number | undefined | null): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export data as a CSV file download.
 *
 * @param filename - The name of the downloaded file (should end with .csv)
 * @param headers - Array of column header strings
 * @param rows - Array of row arrays, each containing cell values
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | undefined | null)[][],
): void {
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const escapedHeaders = headers.map(escapeCSVCell);
  const escapedRows = rows.map((row) => row.map(escapeCSVCell));
  const csv =
    BOM +
    [escapedHeaders.join(','), ...escapedRows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
