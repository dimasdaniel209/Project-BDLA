/**
 * Utility functions for reliable Local Date & Time handling without timezone offset glitches
 */

/**
 * Convert Date or ISO string into local `YYYY-MM-DDTHH:mm` string
 * directly compatible with HTML `<input type="datetime-local" />`
 */
export function toLocalDatetimeInputValue(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert `YYYY-MM-DDTHH:mm` from `<input type="datetime-local" />` to an exact ISO String
 */
export function fromLocalDatetimeInputValue(inputValue: string): string {
  if (!inputValue) return '';
  const d = new Date(inputValue);
  if (isNaN(d.getTime())) return '';
  return d.toISOString();
}

/**
 * Format date for human-friendly Indonesian display
 */
export function formatIndonesianDateTime(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
