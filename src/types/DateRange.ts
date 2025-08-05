export interface DateRange {
  startDate: string | null;  // ISO string format (YYYY-MM-DD)
  endDate: string | null;    // ISO string format (YYYY-MM-DD)
}

export interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  disabled?: boolean;
  className?: string;
}