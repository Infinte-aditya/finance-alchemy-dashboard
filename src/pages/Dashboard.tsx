
import React from 'react';
import Card from '@/components/shared/Card';
import MarketCard from '@/components/shared/MarketCard';
import InsightCard from '@/components/shared/InsightCard';
import TransactionForm from '@/components/forms/TransactionForm';
import { useAuth } from '@/hooks/useAuth';
import { LineChart, BarChart } from 'recharts';
import { 
  AreaChart as AreaChartIcon,
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  LineChart as LineChartIcon, 
  PiggyBank,
  RefreshCw,
  TrendingUp, 
  Upload
} from 'lucide-react';
import Button from '@/components/shared/Button';

// Sample data for charts
const spendingData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 3500 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 2890 },
  { name: 'Jun', amount: 3390 },
  { name: 'Jul', amount: 3490 },
];

const stockData = [
  { name: 'Mon', price: 345 },
  { name: 'Tue', price: 356 },
  { name: 'Wed', price: 350 },
  { name: 'Thu', price: 365 },
  { name: 'Fri', price: 380 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}
          </p>
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
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Balance', 
            value: '$24,560.00', 
            change: '+4.3%', 
            isPositive: true, 
            icon: <DollarSign className="h-5 w-5 text-white" />,
            color: 'bg-primary' 
          },
          { 
            title: 'Monthly Expenses', 
            value: '$3,180.40', 
            change: '-2.1%', 
            isPositive: true, 
            icon: <CreditCard className="h-5 w-5 text-white" />,
            color: 'bg-finance-blue'
          },
          { 
            title: 'Investments', 
            value: '$28,450.90', 
            change: '+8.2%', 
            isPositive: true, 
            icon: <TrendingUp className="h-5 w-5 text-white" />,
            color: 'bg-finance-green'
          },
          { 
            title: 'Savings Goal', 
            value: '68%', 
            change: '+2.3%', 
            isPositive: true, 
            icon: <PiggyBank className="h-5 w-5 text-white" />,
            color: 'bg-purple-500'
          },
        ].map((metric, index) => (
          <Card key={index} className="flex items-start">
            <div className="flex-grow">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                {metric.title}
              </p>
              <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
              <div className="flex items-center">
                <span className={`text-xs font-medium flex items-center ${
                  metric.isPositive ? 'text-finance-green' : 'text-finance-negative'
                }`}>
                  {metric.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                  {metric.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  vs last month
                </span>
              </div>
            </div>
            <div className={`${metric.color} p-2 rounded-lg`}>
              {metric.icon}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Middle Section: Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
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
              <AreaChart width={700} height={250} data={spendingData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MarketCard
              symbol="AAPL"
              name="Apple Inc."
              price={173.59}
              change={2.32}
              changePercent={1.35}
              type="stock"
              icon={<LineChartIcon className="h-5 w-5 text-blue-600" />}
              chart={
                <LineChart width={160} height={60} data={stockData}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#36B37E" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#36B37E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#36B37E" dot={false} strokeWidth={2} />
                </LineChart>
              }
            />
            
            <MarketCard
              symbol="BTC"
              name="Bitcoin"
              price={63750.48}
              change={-1240.32}
              changePercent={-1.91}
              type="crypto"
              icon={<AreaChartIcon className="h-5 w-5 text-purple-600" />}
              chart={
                <LineChart width={160} height={60} data={[
                  { name: 'Mon', price: 64000 },
                  { name: 'Tue', price: 66000 },
                  { name: 'Wed', price: 65500 },
                  { name: 'Thu', price: 65000 },
                  { name: 'Fri', price: 63750 },
                ]}>
                  <defs>
                    <linearGradient id="colorPv2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5630" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF5630" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#FF5630" dot={false} strokeWidth={2} />
                </LineChart>
              }
            />
          </div>
        </div>
        
        {/* Transaction Form */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-medium">Add Transaction</h3>
            </div>
            <TransactionForm />
          </Card>
        </div>
      </div>
      
      {/* Insights */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Insights</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InsightCard
            title="Reduce Subscription Costs"
            description="You're spending $94/month on subscriptions you rarely use. Consider canceling Netflix and Spotify Premium."
            category="spending"
            actionText="View Subscriptions"
            onAction={() => console.log('View subscriptions')}
          />
          
          <InsightCard
            title="Investment Opportunity"
            description="Based on your risk profile, consider allocating 10% of your portfolio to tech ETFs for better diversification."
            category="investment"
            actionText="Explore Options"
            onAction={() => console.log('Explore investment options')}
          />
          
          <InsightCard
            title="Unusual Spending"
            description="Your dining expenses are 43% higher than your monthly average. Check recent transactions."
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
