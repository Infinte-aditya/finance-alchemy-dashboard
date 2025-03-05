import React from 'react';
import { IndianRupee, TrendingUp, AlertTriangle, LineChart } from 'lucide-react';
import Card from '@/components/shared/Card';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SpendingByCategory {
  category: string;
  totalAmount: number;
}

const Insights = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const { data: spendingByCategory, error: spendingError, isLoading: isSpendingLoading } = useQuery<SpendingByCategory[], Error>({
    queryKey: ['spendingByCategory'],
    queryFn: fetchSpendingByCategory,
  });

  if (!user) return <div>Please log in to view insights</div>;
  if (isSpendingLoading) return <div>Loading...</div>;
  if (spendingError) return <div>Error: {spendingError.message}</div>;

  const topCategories = spendingByCategory?.sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 3) || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Insights</h1>
      <p className="text-gray-600 dark:text-gray-300">
        AI-generated insights about your finances with focus on Indian markets
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center text-finance-blue">
            <LineChart className="mr-2 h-5 w-5" />
            <h3 className="text-lg font-medium">Investment Opportunities</h3>
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Based on your risk profile and market conditions, here are some investment opportunities:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <TrendingUp className="mr-2 h-5 w-5 text-finance-positive" />
              <div>
                <p className="font-medium">Indian IT Sector</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consider allocating 15% of your portfolio to IT sector funds or stocks like Infosys, TCS, and HCL Tech.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <TrendingUp className="mr-2 h-5 w-5 text-finance-positive" />
              <div>
                <p className="font-medium">Sovereign Gold Bonds</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Next SGB tranche opens next week. Consider 5-10% allocation as inflation hedge.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <TrendingUp className="mr-2 h-5 w-5 text-finance-positive" />
              <div>
                <p className="font-medium">Digital Payment Stocks</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  UPI transactions growing at 40% YoY. Consider stocks in the payment ecosystem.
                </p>
              </div>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center text-finance-negative">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <h3 className="text-lg font-medium">Spending Insights</h3>
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Analysis of your recent spending patterns:
          </p>
          <div className="space-y-4">
            {topCategories.map((item, index) => (
              <div key={item.category}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="flex items-center text-sm font-medium">
                    <IndianRupee className="h-3 w-3" /> {item.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 rounded-full bg-finance-negative" style={{ width: `${Math.min((item.totalAmount / (topCategories[0].totalAmount || 1)) * 100, 100)}%` }}></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {index === 0 ? 'Highest spending category this month.' : 'Consider reviewing expenses in this category.'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-xl font-medium">Tax Saving Recommendations</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Based on your income and investment pattern, here are tax-saving recommendations for the current financial year:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-left font-medium">Investment Type</th>
                <th className="pb-3 text-right font-medium">Recommended Amount</th>
                <th className="pb-3 text-right font-medium">Tax Section</th>
                <th className="pb-3 text-right font-medium">Potential Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-3 text-left">ELSS Mutual Funds</td>
                <td className="py-3 text-right"><IndianRupee className="inline h-3 w-3" /> 1,50,000</td>
                <td className="py-3 text-right">80C</td>
                <td className="py-3 text-right"><IndianRupee className="inline h-3 w-3" /> 46,800</td>
              </tr>
              <tr>
                <td className="py-3 text-left">NPS Tier 1</td>
                <td className="py-3 text-right"><IndianRupee className="inline h-3 w-3" /> 50,000</td>
                <td className="py-3 text-right">80CCD(1B)</td>
                <td className="py-3 text-right"><IndianRupee className="inline h-3 w-3" /> 15,600</td>
              </tr>
              <tr>
                <td className="py-3 text-left">Health Insurance Premium</td>
                <td className="py-3 text-right"><IndianRupee className="inline h-3 w-3" /> 25,000</td>
                <td className="py-3 text-right">80D</td>
                <td className="py-3 text-right"><IndianRupee className="inline h-3 w-3" /> 7,800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Insights;