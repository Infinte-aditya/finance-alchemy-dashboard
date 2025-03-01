
import React from 'react';

const Footer = () => {
  return (
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
  );
};

export default Footer;
