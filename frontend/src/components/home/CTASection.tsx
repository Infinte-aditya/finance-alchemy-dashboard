
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import { ChevronRight } from 'lucide-react';

const CTASection = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Financial Future?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are taking control of their finances with our AI-powered platform.
        </p>
        <Link to={user ? "/dashboard" : "/signup"} className="inline-block">
          <Button size="lg">
            {user ? "Go to Dashboard" : "Get Started Today"} <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
