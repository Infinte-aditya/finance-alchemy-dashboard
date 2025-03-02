
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import { motion } from 'framer-motion';
import { ArrowRight, IndianRupee, LineChart, PieChart, TrendingUp, Zap } from 'lucide-react';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                AI-Powered Finance
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Transform Your <span className="text-primary">Financial</span> Future
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Harness the power of AI to track expenses, analyze investments, and gain real-time financial insights.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button size="lg" className="w-full sm:w-auto">
                  {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={user ? "/dashboard/insights" : "/login"}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {user ? "View Insights" : "Login"}
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative"
          >
            <HeroDataVisualizer />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HeroDataVisualizer = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 lg:p-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Monthly Summary</h3>
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Income</span>
                <span className="font-medium flex items-center"><IndianRupee className="h-4 w-4 mr-1" />5,240</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expenses</span>
                <span className="font-medium flex items-center"><IndianRupee className="h-4 w-4 mr-1" />3,180</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Savings</span>
                <span className="font-medium text-finance-green flex items-center"><IndianRupee className="h-4 w-4 mr-1" />2,060</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">AI Insights</h3>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">You could save <span className="flex items-center inline-flex"><IndianRupee className="h-3 w-3" />320</span>/month by reducing dining expenses.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Investments</h3>
              <TrendingUp className="h-5 w-5 text-finance-green" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Portfolio Value</span>
                <span className="font-medium flex items-center"><IndianRupee className="h-4 w-4 mr-1" />28,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Return</span>
                <span className="font-medium text-finance-green">+8.2%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Market Trends</h3>
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tech sector up 3.2% this week.</p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-12 h-12 bg-finance-blue rounded-full blur-xl opacity-50"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-finance-green rounded-full blur-xl opacity-50"></div>
    </div>
  );
};

export default HeroSection;
