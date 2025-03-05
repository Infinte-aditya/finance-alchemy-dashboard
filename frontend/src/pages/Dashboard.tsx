import React, { useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import MarketCard from '@/components/shared/MarketCard';
import TransactionForm from '@/components/forms/TransactionForm';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import SearchBar from '@/components/shared/SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  AreaChart as AreaChartIcon, ArrowUpRight, CreditCard, DollarSign, 
  LineChart as LineChartIcon, PiggyBank, RefreshCw, TrendingUp, Upload, Loader2 
} from 'lucide-react';
import Button from '@/components/shared/Button';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: string;
  type?: 'stock' | 'crypto';
  currency: string;
}

interface SpendingByCategory {
  category: string;
  totalAmount: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedMarkets, setSelectedMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log('No user authenticated, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchDefaultMarketData = async (): Promise<MarketData[]> => {
    const token = localStorage.getItem('finance_auth_token');
    if (!token) throw new Error('No token found');
    const response = await fetch('http://localhost:3001/api/market-data', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    if (response.status === 429) throw new Error('Rate limit exceeded');
    if (response.status === 401) {
      logout();
      navigate('/login');
      throw new Error('Session expired');
    }
    if (!response.ok) throw new Error('Failed to fetch default market data');
    return response.json();
  };

  const fetchTransactions = async (): Promise<any[]> => {
    const token = localStorage.getItem('finance_auth_token');
    if (!token) throw new Error('No token found');
    const response = await fetch('http://localhost:3001/transactions', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    if (response.status === 429) throw new Error('Rate limit exceeded');
    if (response.status === 401) {
      logout();
      navigate('/login');
      throw new Error('Session expired');
    }
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  };

  const fetchSpendingByCategory = async (): Promise<SpendingByCategory[]> => {
    const token = localStorage.getItem('finance_auth_token');
    if (!token) throw new Error('No token found');
    const response = await fetch('http://localhost:3001/api/spending-by-category', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    if (response.status === 429) throw new Error('Rate limit exceeded');
    if (response.status === 401) {
      logout();
      navigate('/login');
      throw new Error('Session expired');
    }
    if (!response.ok) throw new Error('Failed to fetch spending by category');
    return response.json();
  };

  const { data: defaultMarketData, error: defaultError, isLoading: isDefaultLoading } = useQuery<MarketData[], Error>({
    queryKey: ['defaultMarketData'],
    queryFn: fetchDefaultMarketData,
  });

  const { data: transactions, error: txError, isLoading: isTxLoading, refetch: refetchTransactions } = useQuery<any[], Error>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const { data: spendingByCategory, error: spendingError, isLoading: isSpendingLoading, refetch: refetchSpendingByCategory } = useQuery<SpendingByCategory[], Error>({
    queryKey: ['spendingByCategory'],
    queryFn: fetchSpendingByCategory,
  });

  const refreshData = () => {
    setLoading(true);
    refetchTransactions();
    refetchSpendingByCategory();
    setTimeout(() => setLoading(false), 1500);
  };

  const handleTransactionSuccess = () => {
    refetchTransactions();
    refetchSpendingByCategory();
  };

  const handleMarketSelect = (market: MarketData) => {
    if (!selectedMarkets.some(m => m.symbol === market.symbol)) {
      setSelectedMarkets(prev => [...prev, market]);
    }
  };

  useEffect(() => {
    if (defaultError) toast.error(defaultError.message);
    if (txError) toast.error(txError.message);
    if (spendingError) toast.error(spendingError.message);
    if (defaultError?.message === 'Session expired' || txError?.message === 'Session expired' || spendingError?.message === 'Session expired') {
      logout();
      navigate('/login');
    }
  }, [defaultError, txError, spendingError, logout, navigate]);

  if (!user) return <div>Please log in to view the dashboard</div>;
  if (isDefaultLoading || isTxLoading || isSpendingLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.name || 'User'}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          isLoading={loading}
          loadingText="Refreshing..."
          className="self-start flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <SearchBar onMarketSelect={handleMarketSelect} />

      {selectedMarkets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedMarkets.map((market) => (
            <MarketCard
              key={market.symbol}
              symbol={market.symbol}
              name={market.name}
              price={market.price}
              change={market.change}
              changePercent={market.change}
              type={market.type || (market.symbol.includes('-') ? 'crypto' : 'stock')}
              currency={market.currency}
              icon={market.type === 'crypto' || market.symbol.includes('-') ? <AreaChartIcon className="h-5 w-5 text-purple-600" /> : <LineChartIcon className="h-5 w-5 text-blue-600" />}
            />
          ))}
        </div>
      )}

      {defaultMarketData && !isDefaultLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {defaultMarketData
            .filter(item => item && item.symbol && item.name && typeof item.price === 'number' && typeof item.change === 'number')
            .map((item: MarketData) => (
              <MarketCard
                key={item.symbol}
                symbol={item.symbol || 'N/A'}
                name={item.name || 'Unknown'}
                price={item.price ?? 0}
                change={item.change ?? 0}
                changePercent={item.change ?? 0}
                type={item.type as 'crypto' | 'stock' || 'stock'}
                currency={item.currency}
                icon={item.type === 'crypto' ? <AreaChartIcon className="h-5 w-5 text-purple-600" /> : <LineChartIcon className="h-5 w-5 text-blue-600" />}
              />
            ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Balance', value: '₹24,56,000', change: '+4.3%', isPositive: true, icon: <DollarSign className="h-5 w-5 text-white" />, color: 'bg-primary' },
          { title: 'Monthly Expenses', value: '₹3,18,040', change: '-2.1%', isPositive: true, icon: <CreditCard className="h-5 w-5 text-white" />, color: 'bg-finance-blue' },
          { title: 'Investments', value: '₹28,45,090', change: '+8.2%', isPositive: true, icon: <TrendingUp className="h-5 w-5 text-white" />, color: 'bg-finance-green' },
          { title: 'Savings Goal', value: '68%', change: '+2.3%', isPositive: true, icon: <PiggyBank className="h-5 w-5 text-white" />, color: 'bg-purple-500' },
        ].map((metric, index) => (
          <Card key={index} className="flex items-start">
            <div className="flex-grow">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
              <div className="flex items-center">
                <span className={`text-xs font-medium flex items-center ${metric.isPositive ? 'text-finance-green' : 'text-finance-negative'}`}>
                  {metric.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                  {metric.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
            <div className={`${metric.color} p-2 rounded-lg`}>{metric.icon}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium">Spending by Category</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your expenses by category</p>
              </div>
            </div>
            <div className="h-64">
              {spendingByCategory && !isSpendingLoading ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingByCategory}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    <Bar dataKey="totalAmount" fill="#0055FF" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-medium">Add Transaction</h3>
            </div>
            <TransactionForm onSuccess={handleTransactionSuccess} />
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
              {txError && <p className="text-finance-negative">{txError.message}</p>}
              {isTxLoading && <Loader2 className="h-5 w-5 animate-spin mx-auto" />}
              {transactions && !isTxLoading && (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {transactions.map((tx) => (
                    <li key={tx._id} className="text-sm text-gray-700 dark:text-gray-300">
                      {tx.description || 'No description'} - ₹{tx.amount || 0} ({tx.category || 'Uncategorized'}) on {new Date(tx.date || Date.now()).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Insights</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <InsightsPanel />
      </div>
    </div>
  );
};

export default Dashboard;