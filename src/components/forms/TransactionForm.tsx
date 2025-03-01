
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/shared/Button';

const formSchema = z.object({
  amount: z.coerce.number()
    .positive({ message: 'Amount must be a positive number' }),
  date: z.date({
    required_error: 'Please select a date',
  }),
  description: z.string()
    .min(3, { message: 'Description must be at least 3 characters' })
    .max(200, { message: 'Description cannot exceed 200 characters' }),
  category: z.string({
    required_error: 'Please select a category',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Saving & Debt',
  'Personal Spending',
  'Recreation',
  'Miscellaneous'
];

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      date: new Date(),
      description: '',
      category: '',
    },
  });

  const watchDescription = form.watch('description');

  // Simulated AI categorization based on description
  React.useEffect(() => {
    if (watchDescription.length > 5) {
      // This would be replaced with an actual AI suggestion API call
      const suggestCategory = () => {
        const lowerDesc = watchDescription.toLowerCase();
        
        if (lowerDesc.includes('rent') || lowerDesc.includes('mortgage')) 
          return 'Housing';
        if (lowerDesc.includes('gas') || lowerDesc.includes('uber') || lowerDesc.includes('car')) 
          return 'Transportation';
        if (lowerDesc.includes('grocery') || lowerDesc.includes('restaurant') || lowerDesc.includes('coffee')) 
          return 'Food';
        if (lowerDesc.includes('electric') || lowerDesc.includes('water') || lowerDesc.includes('phone')) 
          return 'Utilities';
        if (lowerDesc.includes('movie') || lowerDesc.includes('concert') || lowerDesc.includes('game')) 
          return 'Recreation';
        if (lowerDesc.includes('doctor') || lowerDesc.includes('medicine') || lowerDesc.includes('hospital')) 
          return 'Healthcare';
        
        return null;
      };
      
      const suggested = suggestCategory();
      if (suggested && suggested !== form.getValues('category')) {
        setSuggestedCategory(suggested);
      }
    } else {
      setSuggestedCategory(null);
    }
  }, [watchDescription, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Submitting transaction:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Transaction added successfully');
      
      // Reset form
      form.reset({
        amount: undefined,
        date: new Date(),
        description: '',
        category: '',
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const applySuggestion = () => {
    if (suggestedCategory) {
      form.setValue('category', suggestedCategory);
      setSuggestedCategory(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      placeholder="0.00" 
                      {...field} 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What was this transaction for?" 
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <div className="flex justify-between">
                <FormMessage />
                <p className="text-xs text-gray-500">
                  {field.value.length}/200
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <div className="relative">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {suggestedCategory && !field.value && (
                    <div className="absolute right-0 top-0 mt-11 bg-finance-light-green text-finance-green text-sm p-2 rounded-md animate-fade-in">
                      <span>Suggestion: {suggestedCategory}</span>
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={applySuggestion} 
                        className="text-finance-green underline p-0 ml-2 h-auto"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
          loadingText="Adding Transaction..."
        >
          Add Transaction
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
