import React from 'react';
import { IndianRupee } from 'lucide-react';
import Card from '@/components/shared/Card';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SpendingByCategory {
  category: string;
  totalAmount: number;
}

const Expenses = () => {
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

  if (!user) return <div>Please log in to view expenses</div>;
  if (isSpendingLoading) return <div>Loading...</div>;
  if (spendingError) return <div>Error: {spendingError.message}</div>;

  const totalSpending = spendingByCategory?.reduce((sum, item) => sum + item.totalAmount, 0) || 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Expenses</h1>
      <p className="text-gray-600 dark:text-gray-300 flex items-center">
        Track your expenses in Indian Rupees <IndianRupee className="ml-1 h-4 w-4" />
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Monthly Summary</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Spending</span>
            <span className="flex items-center text-xl font-bold">
              <IndianRupee className="h-5 w-5" /> {totalSpending.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-2 rounded-full bg-finance-blue" style={{ width: `${Math.min((totalSpending / 50000) * 100, 100)}%` }}></div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Spending by Category</h3>
          <div className="space-y-3">
            {spendingByCategory?.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                <span className="flex items-center font-medium text-finance-negative">
                  <IndianRupee className="h-4 w-4" /> {item.totalAmount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">GST Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total GST Paid</span>
              <span className="flex items-center font-medium">
                <IndianRupee className="h-4 w-4" /> 3,680
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">CGST</span>
              <span className="flex items-center font-medium">
                <IndianRupee className="h-4 w-4" /> 1,840
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">SGST</span>
              <span className="flex items-center font-medium">
                <IndianRupee className="h-4 w-4" /> 1,840
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;