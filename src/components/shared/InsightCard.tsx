
import React from 'react';
import Card from './Card';
import { LightbulbIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface InsightCardProps {
  title: string;
  description: string;
  category?: 'spending' | 'investment' | 'market' | 'general';
  actionText?: string;
  onAction?: () => void;
  chart?: React.ReactNode;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  category = 'general',
  actionText,
  onAction,
  chart,
  className
}) => {
  const categoryColors = {
    spending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    investment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    market: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    general: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  };
  
  return (
    <Card 
      variant="default" 
      hoverEffect 
      className={cn("overflow-hidden", className)}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="bg-finance-light-blue p-2 rounded-full mr-3">
              <LightbulbIcon className="h-5 w-5 text-finance-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Insight</p>
              <h3 className="font-medium text-lg">{title}</h3>
            </div>
          </div>
          {category && (
            <span className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              categoryColors[category]
            )}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          )}
        </div>
        
        <div className="flex-grow">
          <p className="text-gray-600 dark:text-gray-300 text-balance mb-4">{description}</p>
          
          {chart && (
            <div className="my-4">
              {chart}
            </div>
          )}
          
          {actionText && onAction && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAction}
                className="text-finance-blue border-finance-blue hover:bg-finance-light-blue hover:text-finance-blue"
              >
                {actionText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InsightCard;
