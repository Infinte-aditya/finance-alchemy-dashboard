import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default', 
  size = 'default',
  isLoading = false,
  loadingText,
  className,
  children,
  ...props 
}, ref) => {
  const variantClass = variant === 'success' ? 'bg-finance-green hover:bg-finance-green/90 text-white' : '';
  
  return (
    <ShadcnButton
      ref={ref}
      variant={variant === 'success' ? 'default' : variant}
      size={size}
      className={cn(variantClass, className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      )}
      {!isLoading && children}
    </ShadcnButton>
  );
});

Button.displayName = 'Button';

export default Button;