import { format } from 'date-fns';

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
 * Formats time only:
 * "11:01 AM"
 */
export const formatTime = (date: number | string): string => {
  return format(new Date(date), 'hh:mm aa');
};
