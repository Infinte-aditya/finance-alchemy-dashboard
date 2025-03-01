
import React from 'react';
import { CurrencyRupee, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '@/components/shared/Card';

const Investments = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Investments</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Track your Indian stock market investments and portfolio performance
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">NSE Index</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">22,430.50</span>
            <span className="flex items-center text-finance-positive">
              <TrendingUp className="mr-1 h-4 w-4" />
              +1.2%
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">NIFTY 50</p>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">BSE Index</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">73,840.35</span>
            <span className="flex items-center text-finance-positive">
              <TrendingUp className="mr-1 h-4 w-4" />
              +0.9%
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">SENSEX</p>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Top Holdings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Reliance</span>
              <div className="text-right">
                <div className="flex items-center justify-end font-medium">
                  <CurrencyRupee className="h-3 w-3" /> 2,850.75
                </div>
                <span className="text-xs text-finance-positive">+2.1%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">HDFC Bank</span>
              <div className="text-right">
                <div className="flex items-center justify-end font-medium">
                  <CurrencyRupee className="h-3 w-3" /> 1,675.30
                </div>
                <span className="text-xs text-finance-negative">-0.5%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">TCS</span>
              <div className="text-right">
                <div className="flex items-center justify-end font-medium">
                  <CurrencyRupee className="h-3 w-3" /> 3,940.20
                </div>
                <span className="text-xs text-finance-positive">+1.3%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h3 className="mb-4 text-xl font-medium">Indian Market ETFs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 text-left font-medium">Name</th>
                  <th className="pb-3 text-right font-medium">Price</th>
                  <th className="pb-3 text-right font-medium">Change</th>
                  <th className="pb-3 text-right font-medium">AUM (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-3 text-left">Nippon India ETF Nifty BeES</td>
                  <td className="py-3 text-right"><CurrencyRupee className="inline h-3 w-3" /> 224.30</td>
                  <td className="py-3 text-right text-finance-positive">+1.2%</td>
                  <td className="py-3 text-right">5,240</td>
                </tr>
                <tr>
                  <td className="py-3 text-left">SBI ETF Sensex</td>
                  <td className="py-3 text-right"><CurrencyRupee className="inline h-3 w-3" /> 738.40</td>
                  <td className="py-3 text-right text-finance-positive">+0.9%</td>
                  <td className="py-3 text-right">3,860</td>
                </tr>
                <tr>
                  <td className="py-3 text-left">HDFC Nifty 50 ETF</td>
                  <td className="py-3 text-right"><CurrencyRupee className="inline h-3 w-3" /> 224.10</td>
                  <td className="py-3 text-right text-finance-positive">+1.1%</td>
                  <td className="py-3 text-right">2,980</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Investments;
