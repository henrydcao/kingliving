import { useState, useEffect, useCallback, memo } from 'react';
import { Calendar, X } from 'lucide-react';
import type { DateRange, DateRangeFilterProps } from '../types/DateRange';

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

export const DateRangeFilter = memo<DateRangeFilterProps>(({
  dateRange,
  onDateRangeChange,
  disabled = false,
  className = ""
}) => {
  const [localStartDate, setLocalStartDate] = useState<string>(dateRange.startDate || '');
  const [localEndDate, setLocalEndDate] = useState<string>(dateRange.endDate || '');
  const [validationError, setValidationError] = useState<string>('');

  const debouncedOnDateRangeChange = useCallback(
    debounce((range: DateRange) => {
      onDateRangeChange(range);
    }, 300),
    [onDateRangeChange]
  );

  const validateDateRange = useCallback((start: string, end: string): string => {
    if (start && end && start > end) {
      return 'Start date cannot be after end date';
    }
    return '';
  }, []);

  const updateDateRange = useCallback((start: string, end: string) => {
    const error = validateDateRange(start, end);
    setValidationError(error);
    
    if (!error) {
      const newRange: DateRange = {
        startDate: start || null,
        endDate: end || null
      };
      debouncedOnDateRangeChange(newRange);
    }
  }, [validateDateRange, debouncedOnDateRangeChange]);

  useEffect(() => {
    setLocalStartDate(dateRange.startDate || '');
    setLocalEndDate(dateRange.endDate || '');
    setValidationError('');
  }, [dateRange]);

  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setLocalStartDate(newStartDate);
    updateDateRange(newStartDate, localEndDate);
  }, [localEndDate, updateDateRange]);

  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setLocalEndDate(newEndDate);
    updateDateRange(localStartDate, newEndDate);
  }, [localStartDate, updateDateRange]);

  const handleClear = useCallback(() => {
    setLocalStartDate('');
    setLocalEndDate('');
    setValidationError('');
    onDateRangeChange({ startDate: null, endDate: null });
  }, [onDateRangeChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  const hasActiveFilter = localStartDate || localEndDate;

  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="date"
            value={localStartDate}
            onChange={handleStartDateChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`appearance-none bg-white border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 hover:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
              validationError ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : 'border-gray-300'
            }`}
            style={{ minHeight: "44px", minWidth: "150px" }}
            aria-label="Filter by start date"
            aria-describedby={validationError ? "date-range-error" : undefined}
            placeholder="Start date"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="date"
            value={localEndDate}
            onChange={handleEndDateChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`appearance-none bg-white border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 hover:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
              validationError ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : 'border-gray-300'
            }`}
            style={{ minHeight: "44px", minWidth: "150px" }}
            aria-label="Filter by end date"
            aria-describedby={validationError ? "date-range-error" : undefined}
            placeholder="End date"
          />
        </div>
      </div>

      {hasActiveFilter && !disabled && (
        <button
          onClick={handleClear}
          className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
          style={{ minHeight: "44px", minWidth: "44px" }}
          aria-label="Clear date range filter"
          type="button"
        >
          <X className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Clear</span>
        </button>
      )}

      {validationError && (
        <div 
          id="date-range-error" 
          className="text-sm text-red-600 mt-1 sm:mt-0 sm:ml-2 flex items-center"
          role="alert"
          aria-live="polite"
        >
          {validationError}
        </div>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {hasActiveFilter && !validationError && (
          `Date range filter active: ${localStartDate ? `from ${localStartDate}` : ''} ${localEndDate ? `to ${localEndDate}` : ''}`
        )}
      </div>
    </div>
  );
});

DateRangeFilter.displayName = 'DateRangeFilter';