import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/shared/Button';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number' }),
  date: z.date({ required_error: 'Please select a date' }),
  description: z.string().min(3, { message: 'Description must be at least 3 characters' }).max(200, { message: 'Description cannot exceed 200 characters' }),
  category: z.string({ required_error: 'Please select a category' }).optional(), // Optional since backend can classify
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 
  'Healthcare', 'Saving & Debt', 'Personal Spending', 'Recreation', 'Miscellaneous'
];

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      description: '',
      category: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('finance_auth_token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add transaction');

      toast.success('Transaction added successfully');
      form.reset({
        amount: undefined,
        date: new Date(),
        description: '',
        category: '',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <Input 
                      placeholder="0.00" 
                      {...field} 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="pl-8 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
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
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={isSubmitting}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                  className="resize-none text-gray-900 dark:text-gray-200 dark:bg-gray-700"
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="flex justify-between">
                <FormMessage />
                <p className="text-xs text-gray-500">{field.value.length}/200</p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category (Optional)</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="text-gray-900 dark:text-gray-200 dark:bg-gray-700">
                    <SelectValue placeholder="Select a category or leave blank to auto-classify" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
          loadingText="Adding Transaction..."
          disabled={isSubmitting}
        >
          Add Transaction
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;