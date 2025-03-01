
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
  hoverEffect?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Card = ({ 
  variant = 'default', 
  hoverEffect = false, 
  className,
  children,
  ...props 
}: CardProps) => {
  return (
    <div 
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variant === 'default' && "bg-white dark:bg-gray-800 shadow-sm",
        variant === 'glass' && "glass-card",
        variant === 'outline' && "border bg-transparent",
        hoverEffect && "hover-scale hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
