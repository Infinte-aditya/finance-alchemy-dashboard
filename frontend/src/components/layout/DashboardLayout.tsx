
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar variant="dashboard" />
      <main className="pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
