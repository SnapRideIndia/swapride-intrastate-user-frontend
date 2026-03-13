export type DateFilterValue =
  | 'TODAY'
  | 'YESTERDAY'
  | 'THIS_WEEK'
  | 'LAST_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | 'THIS_YEAR';

export type DateFilter =
  | { mode: 'NONE' }
  | { mode: 'PRESET'; preset: DateFilterValue }
  | { mode: 'CUSTOM'; startDate: string; endDate: string };

export type AmountFilter =
  | { mode: 'NONE' }
  | { mode: 'PRESET'; min?: number; max?: number }
  | { mode: 'CUSTOM'; min?: number; max?: number };

export type PaymentFilter = 'ALL' | 'WALLET' | 'GATEWAY';

