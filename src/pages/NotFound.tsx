import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Hotel } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-8">
        <Hotel size={64} className="mx-auto text-primary-600 mb-4" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
      </div>
      
      <Link 
        to="/"
        className="flex items-center px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;