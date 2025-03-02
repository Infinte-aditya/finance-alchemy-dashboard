import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import Button from '@/components/shared/Button';
import { Loader2, Search } from 'lucide-react';

interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: string;
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMarketData = async (symbol: string): Promise<MarketData> => {
    const response = await fetch(`http://localhost:3001/api/search?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }
    return response.json();
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['marketData', searchTerm],
    queryFn: () => fetchMarketData(searchTerm),
    enabled: false, // Only fetch on button click, not on every keystroke
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search stocks or crypto (e.g., AAPL, BTC-USD)"
          className="w-full max-w-md text-gray-900 dark:text-gray-200 dark:bg-gray-700"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error && (
        <p className="text-finance-negative">
          Error: {(error as Error).message || 'Could not fetch data'}
        </p>
      )}

      {data && !isLoading && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium">{data.name} ({data.symbol})</h3>
          <p>Price: ${data.price.toLocaleString()}</p>
          <p className={data.change >= 0 ? 'text-finance-green' : 'text-finance-negative'}>
            Change: {data.change.toFixed(2)}%
          </p>
          <p>Market Cap: {data.marketCap}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;