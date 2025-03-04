import React from 'react';
import Card from './Card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketCardProps {
  symbol?: string;
  name?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  type?: 'stock' | 'crypto' | 'index';
  icon?: React.ReactNode;
  chart?: React.ReactNode;
}

const MarketCard: React.FC<MarketCardProps> = ({
  symbol = 'N/A',
  name = 'Unknown',
  price = 0,
  change = 0,
  changePercent = 0,
  type = 'stock',
  icon,
  chart
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card 
      variant="default" 
      hoverEffect 
      className="overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div>
              <h3 className="font-medium text-lg">{symbol}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
            </div>
          </div>
          <span className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            type === 'stock' ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
            type === 'crypto' ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          )}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-semibold">${price.toLocaleString()}</span>
            <div className={cn(
              "flex items-center rounded-full px-2 py-1",
              isPositive ? "bg-finance-light-green text-finance-green" : "bg-red-100 text-finance-negative"
            )}>
              {isPositive ? 
                <ArrowUp className="h-3 w-3 mr-1" /> : 
                <ArrowDown className="h-3 w-3 mr-1" />
              }
              <span className="text-sm font-medium">
                {changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          {chart && (
            <div className="mt-4 h-20">
              {chart}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MarketCard;