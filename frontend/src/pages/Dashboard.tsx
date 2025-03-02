import React from 'react';
import Card from '@/components/shared/Card';
import MarketCard from '@/components/shared/MarketCard';
import InsightCard from '@/components/shared/InsightCard';
import TransactionForm from '@/components/forms/TransactionForm';
import { useAuth } from '@/hooks/useAuth';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  AreaChart 
} from 'recharts';
import { 
  AreaChart as AreaChartIcon,
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  LineChart as LineChartIcon, 
  PiggyBank,
  RefreshCw,
  TrendingUp, 
  Upload,
  Search,
  Loader2,
} from 'lucide-react';
import Button from '@/components/shared/Button';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';

const spendingData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 3500 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 2890 },
  { name: 'Jun', amount: 3390 },
  { name: 'Jul', amount: 3490 },
];

interface MarketData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Fetch default market data on load
  const fetchDefaultMarketData = async (): Promise<MarketData[]> => {
    const token = localStorage.getItem('finance_auth_token');
    const response = await fetch('http://localhost:3001/api/market-data', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch default market data');
    return response.json();
  };

  const { data: defaultMarketData, error: defaultError, isLoading: isDefaultLoading } = useQuery({
    queryKey: ['defaultMarketData'],
    queryFn: fetchDefaultMarketData,
  });

  // Fetch search market data
  const fetchSearchMarketData = async (symbol: string): Promise<MarketData> => {
    const token = localStorage.getItem('finance_auth_token');
    const response = await fetch(`http://localhost:3001/api/search?symbol=${symbol}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch market data');
    return response.json();
  };

  const { data: searchResult, error: searchError, isLoading: isSearchLoading } = useQuery({
    queryKey: ['marketData', debouncedSearchTerm],
    queryFn: () => fetchSearchMarketData(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm.trim(),
  });

  // Fetch transactions
  const fetchTransactions = async (): Promise<any[]> => {
    const token = localStorage.getItem('finance_auth_token');
    const response = await fetch('http://localhost:3001/transactions', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  };

  const { data: transactions, error: txError, isLoading: isTxLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleTransactionSuccess = () => {
    refetchTransactions(); // Refresh transaction list after adding
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.name}</p>
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

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stocks or crypto (e.g., AAPL, BTC-USD)"
          className="w-full max-w-md text-gray-900 dark:text-gray-200 dark:bg-gray-700"
        />
        {isSearchLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      {/* Search Result */}
      {searchError && (
        <p className="text-finance-negative">Error: {(searchError as Error).message}</p>
      )}
      {searchResult && !isSearchLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MarketCard
            symbol={searchResult.symbol}
            name={searchResult.name}
            price={searchResult.price}
            change={searchResult.change}
            changePercent={searchResult.change}
            type={searchResult.symbol.includes('-') ? 'crypto' : 'stock'}
            icon={
              searchResult.symbol.includes('-') ? (
                <AreaChartIcon className="h-5 w-5 text-purple-600" />
              ) : (
                <LineChartIcon className="h-5 w-5 text-blue-600" />
              )
            }
          />
        </div>
      )}

      {/* Default Market Data */}
      {defaultError && (
        <p className="text-finance-negative">Error: {(defaultError as Error).message}</p>
      )}
      {defaultMarketData && !isDefaultLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {defaultMarketData.map((item: MarketData) => (
            <MarketCard
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
              price={item.price}
              change={item.change}
              changePercent={item.change}
              type={item.symbol.includes('-') ? 'crypto' : 'stock'}
              icon={
                item.symbol.includes('-') ? (
                  <AreaChartIcon className="h-5 w-5 text-purple-600" />
                ) : (
                  <LineChartIcon className="h-5 w-5 text-blue-600" />
                )
              }
            />
          ))}
        </div>
      )}

      {/* Existing Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Balance', value: '$24,560.00', change: '+4.3%', isPositive: true, icon: <DollarSign className="h-5 w-5 text-white" />, color: 'bg-primary' },
          { title: 'Monthly Expenses', value: '$3,180.40', change: '-2.1%', isPositive: true, icon: <CreditCard className="h-5 w-5 text-white" />, color: 'bg-finance-blue' },
          { title: 'Investments', value: '$28,450.90', change: '+8.2%', isPositive: true, icon: <TrendingUp className="h-5 w-5 text-white" />, color: 'bg-finance-green' },
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
                <h3 className="text-lg font-medium">Spending Overview</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your monthly expenses</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">Monthly</Button>
                <Button variant="ghost" size="sm" className="text-xs">Yearly</Button>
              </div>
            </div>
            <div className="h-64">
              <AreaChart width={700} height={250} data={spendingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0055FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0055FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#0055FF" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
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
            {/* Transaction List */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
              {txError && (
                <p className="text-finance-negative">Error: {(txError as Error).message}</p>
              )}
              {isTxLoading && <Loader2 className="h-5 w-5 animate-spin mx-auto" />}
              {transactions && !isTxLoading && (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {transactions.map((tx) => (
                    <li key={tx._id} className="text-sm text-gray-700 dark:text-gray-300">
                      {tx.description} - ${tx.amount} ({tx.category}) on {new Date(tx.date).toLocaleDateString()}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InsightCard
            title="Reduce Subscription Costs"
            description="You're spending $94/month on subscriptions you rarely use."
            category="spending"
            actionText="View Subscriptions"
            onAction={() => console.log('View subscriptions')}
          />
          <InsightCard
            title="Investment Opportunity"
            description="Consider allocating 10% to tech ETFs for diversification."
            category="investment"
            actionText="Explore Options"
            onAction={() => console.log('Explore investment options')}
          />
          <InsightCard
            title="Unusual Spending"
            description="Dining expenses are 43% higher than average."
            category="spending"
            actionText="View Transactions"
            onAction={() => console.log('View transactions')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;