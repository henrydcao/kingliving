import { useState, useEffect, useCallback, forwardRef, memo } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

export const Search = memo(forwardRef<HTMLInputElement, SearchProps>(
  ({ 
    searchTerm, 
    onSearchChange, 
    placeholder = "Search orders by ID, product, customer, or status...", 
    disabled = false,
    className = "",
    isLoading = false
  }, ref) => {
    const [localTerm, setLocalTerm] = useState(searchTerm);

    const debouncedOnSearchChange = useCallback(
      (term: string) => {
        const timeoutId = setTimeout(() => {
          onSearchChange(term);
        }, 300);

        return () => clearTimeout(timeoutId);
      },
      [onSearchChange]
    );

    useEffect(() => {
      const cleanup = debouncedOnSearchChange(localTerm);
      return cleanup;
    }, [localTerm, debouncedOnSearchChange]);

    useEffect(() => {
      setLocalTerm(searchTerm);
    }, [searchTerm]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalTerm(e.target.value);
    }, []);

    const handleClear = useCallback(() => {
      setLocalTerm('');
      onSearchChange('');
    }, [onSearchChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        handleClear();
        (e.target as HTMLInputElement).blur();
      }
    }, [handleClear]);

    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 ${className}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" aria-hidden="true" />
            ) : (
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </div>
          
          <input
            ref={ref}
            type="text"
            value={localTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 hover:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            style={{ minHeight: "44px" }}
            aria-label="Search orders"
            aria-describedby="search-description"
            role="searchbox"
            aria-expanded="false"
            aria-autocomplete="list"
          />
          
          {localTerm && !disabled && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              style={{ minWidth: "44px", minHeight: "44px" }}
              aria-label="Clear search"
              type="button"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div id="search-description" className="sr-only">
          Search across order IDs, product names, customer names, and order statuses. Use the Escape key to clear the search.
        </div>
      </div>
    );
  }
));

Search.displayName = 'Search';