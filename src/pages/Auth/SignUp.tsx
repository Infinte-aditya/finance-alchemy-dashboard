
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencyRupee } from 'lucide-react';

const SignUp = () => {
  const { signup } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signup(name, email, password);
      // Successful signup is handled by the useAuth hook, which redirects to dashboard
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign up to get started with Finance Alchemy <CurrencyRupee className="inline h-4 w-4" />
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 text-gray-800 dark:text-gray-200"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 text-gray-800 dark:text-gray-200"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 text-gray-800 dark:text-gray-200"
              placeholder="••••••••"
            />
          </div>
          
          <Button type="submit" className="w-full" isLoading={loading}>
            Create Account <CurrencyRupee className="ml-2 h-4 w-4" />
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Already have an account?</span>
          <Link to="/login" className="ml-2 font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            🇮🇳 Trusted by investors across India
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">UPI Enabled</p>
              <p className="mt-1 text-sm font-medium">For easy payments</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">NSE/BSE Data</p>
              <p className="mt-1 text-sm font-medium">Indian Market Focus</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">₹ Tracking</p>
              <p className="mt-1 text-sm font-medium">INR by default</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
