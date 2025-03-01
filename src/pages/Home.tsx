
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/shared/Button';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight, 
  LineChart, 
  PieChart,
  TrendingUp,
  Zap,
  IndianRupee
} from 'lucide-react';
import Card from '@/components/shared/Card';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
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
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-finance-blue rounded-full blur-xl opacity-50"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-finance-green rounded-full blur-xl opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expense Tracking",
                description: "Effortlessly track and categorize your spending with AI-powered suggestions.",
                icon: <CreditCardIcon className="h-10 w-10 text-finance-blue" />,
              },
              {
                title: "Investment Analysis",
                description: "Monitor your portfolio performance and receive personalized investment insights.",
                icon: <TrendingUpIcon className="h-10 w-10 text-finance-green" />,
              },
              {
                title: "AI Financial Insights",
                description: "Get actionable recommendations to optimize your financial decisions.",
                icon: <LightbulbIcon className="h-10 w-10 text-amber-500" />,
              },
              {
                title: "Real-time Market Data",
                description: "Stay informed with up-to-date market information on stocks, crypto, and indices.",
                icon: <ChartIcon className="h-10 w-10 text-purple-500" />,
              },
              {
                title: "Budget Planning",
                description: "Create smart budgets that adapt to your spending patterns and financial goals.",
                icon: <TargetIcon className="h-10 w-10 text-finance-blue" />,
              },
              {
                title: "Financial Reports",
                description: "Generate comprehensive reports to visualize your financial health over time.",
                icon: <FileTextIcon className="h-10 w-10 text-finance-green" />,
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className="text-center p-8 hover:border-primary transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
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
      
      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-primary">Finance Alchemy</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">AI-powered financial insights</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Features</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Pricing</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Finance Alchemy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Icons for features section
const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M7 16l4-8 4 2 4-6" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

export default Home;
