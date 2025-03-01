
import React from 'react';
import { IndianRupee } from 'lucide-react';
import Card from '@/components/shared/Card';

const Expenses = () => {
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
              <IndianRupee className="h-5 w-5" /> 24,500
            </span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-2 rounded-full bg-finance-blue" style={{ width: '65%' }}></div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">UPI Transactions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">PhonePe</span>
              <span className="flex items-center font-medium text-finance-negative">
                <IndianRupee className="h-4 w-4" /> 8,240
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Google Pay</span>
              <span className="flex items-center font-medium text-finance-negative">
                <IndianRupee className="h-4 w-4" /> 5,130
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Paytm</span>
              <span className="flex items-center font-medium text-finance-negative">
                <IndianRupee className="h-4 w-4" /> 3,780
              </span>
            </div>
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
