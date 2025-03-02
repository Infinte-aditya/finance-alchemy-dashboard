
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/shared/Card';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">User Information</h2>
            <p className="text-gray-600 dark:text-gray-300">Manage your account details</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="mt-1 text-gray-900 dark:text-white font-medium">{user?.name || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="mt-1 text-gray-900 dark:text-white font-medium">{user?.email || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
