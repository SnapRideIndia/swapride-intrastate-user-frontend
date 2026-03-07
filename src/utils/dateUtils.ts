import { format, parse, isValid } from 'date-fns';

/**
 * Formats a timestamp (ms) or ISO date string into:
 * "25 Feb 2026 . 11:01 AM"
 */
export const formatTransactionDate = (date: number | string): string => {
  return format(new Date(date), 'd MMM yyyy . hh:mm aa');
};

/**
 * Formats a date into a short human-readable string:
 * "25 Feb 2026"
 */
export const formatShortDate = (date: number | string): string => {
  return format(new Date(date), 'd MMM yyyy');
};

/**
 * Formats time from an ISO string, timestamp, or raw 'HH:mm:ss' to:
 * "11:01 AM"
 */
export const formatTime = (timeStr: number | string): string => {
  if (!timeStr) return '--:--';
  if (typeof timeStr === 'number') {
    return format(new Date(timeStr), 'hh:mm aa');
  }

  // Handle raw 'HH:mm' or 'HH:mm:ss' strings safely using date-fns
  if (typeof timeStr === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
    const rawFormat = timeStr.length > 5 ? 'HH:mm:ss' : 'HH:mm';
    const parsed = parse(timeStr, rawFormat, new Date());
    if (isValid(parsed)) return format(parsed, 'hh:mm aa');
  }

  const d = new Date(timeStr);
  return isValid(d) ? format(d, 'hh:mm aa') : '--:--';
};
