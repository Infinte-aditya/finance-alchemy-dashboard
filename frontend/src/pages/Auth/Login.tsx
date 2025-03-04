import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  function handleGoogleLogin(response) {
    console.log("Google ID Token:", response.credential);
    // Send this token to your backend
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google credential response:', credentialResponse);
    if (credentialResponse.credential) {
      setLoading(true);
      try {
        await googleLogin(credentialResponse.credential);
      } catch (error) {
        console.error('Google login error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed');
    console.error('Google Sign-In failed at client-side');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="pill"
              theme="outline"
            />
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account?</span>
          <Link to="/signup" className="ml-2 font-medium text-primary hover:text-primary/80">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;