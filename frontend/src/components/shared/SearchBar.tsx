import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import Button from '@/components/shared/Button';
import { Loader2, Search } from 'lucide-react';

// Interfaces
interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: string;
  type?: 'stock' | 'crypto';
  currency?: string;
}

interface SearchBarProps {
  onMarketSelect: (market: MarketData) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onMarketSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch search results from both Finnhub and Binance
  const fetchFuzzySearch = async (query: string): Promise<SearchResult[]> => {
    const token = localStorage.getItem('finance_auth_token');
    if (!token) throw new Error('No token found');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const finnhubPromise = fetch(
      `http://localhost:3001/api/fuzzy-search?query=${encodeURIComponent(query)}`,
      { headers }
    ).then(res => res.ok ? res.json() : []);

    const binancePromise = fetch(
      `http://localhost:3001/api/binance-fuzzy-search?query=${encodeURIComponent(query)}`,
      { headers }
    ).then(res => res.ok ? res.json() : []);

    const [finnhubResults, binanceResults] = await Promise.all([finnhubPromise, binancePromise]);

    const combinedResults = [...finnhubResults, ...binanceResults];
    const uniqueResults = Array.from(
      new Map(combinedResults.map(item => [item.symbol, item])).values()
    );

    return uniqueResults.slice(0, 10);
  };

  // Fetch detailed market data
  const fetchMarketData = async (symbol: string): Promise<MarketData> => {
    const token = localStorage.getItem('finance_auth_token');
    if (!token) throw new Error('No token found');
    const response = await fetch(
      `http://localhost:3001/api/search?symbol=${encodeURIComponent(symbol)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch market data');
    return response.json();
  };

  // React Query hooks
  const { data: searchResults, isLoading: isSearchLoading, error: searchError, refetch: refetchFuzzy } = useQuery({
    queryKey: ['fuzzySearch', searchTerm],
    queryFn: () => fetchFuzzySearch(searchTerm),
    enabled: false,
  });

  const { data: marketData, isLoading: isMarketLoading, error: marketError, refetch: refetchMarket } = useQuery({
    queryKey: ['marketData', selectedSymbol],
    queryFn: () => fetchMarketData(selectedSymbol!),
    enabled: !!selectedSymbol,
  });

  // Handlers
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsDropdownOpen(true);
      refetchFuzzy();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsDropdownOpen(true);
      refetchFuzzy();
    }
  };

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setIsDropdownOpen(false); // Close dropdown
    refetchMarket().then((result) => {
      if (result.data) {
        onMarketSelect(result.data);
      }
    });
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search stocks or crypto (e.g., AAPL, BTC)"
          className="w-full max-w-md text-gray-900 dark:text-gray-200 dark:bg-gray-700"
        />
        <Button onClick={handleSearch} disabled={isSearchLoading}>
          {isSearchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {searchError && (
        <p className="text-red-500">
          Error: {(searchError as Error).message || 'Could not fetch search results'}
        </p>
      )}

      {searchResults && !isSearchLoading && searchTerm && isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full max-w-md bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.symbol}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(result.symbol)}
            >
              <p className="text-sm text-gray-900 dark:text-gray-200">{result.name} ({result.symbol})</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{result.exchange}</p>
            </div>
          ))}
        </div>
      )}

      {marketError && (
        <p className="text-red-500">
          Error: {(marketError as Error).message || 'Could not fetch market data'}
        </p>
      )}
    </div>
  );
};

export default SearchBar;