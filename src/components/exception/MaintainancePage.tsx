'use client';
import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="text-center px-4">
        <svg
          className="mx-auto mb-8 w-64 h-64 animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          {/* Simplified SVG of a wrench and gear */}
          <path d="M501.1 395.5l-60.1-60.1c-5.6-5.6-14.7-5.6-20.3 0l-45.3 45.3-45.3-45.3 45.3-45.3c5.6-5.6 5.6-14.7 0-20.3l-60.1-60.1c-5.6-5.6-14.7-5.6-20.3 0l-45.3 45.3-45.3-45.3 45.3-45.3c5.6-5.6 5.6-14.7 0-20.3l-60.1-60.1c-5.6-5.6-14.7-5.6-20.3 0l-60.1 60.1c-5.6 5.6-5.6 14.7 0 20.3l45.3 45.3-45.3 45.3-45.3-45.3c-5.6-5.6-14.7-5.6-20.3 0l-60.1 60.1c-5.6 5.6-5.6 14.7 0 20.3l45.3 45.3-45.3 45.3c-5.6 5.6-5.6 14.7 0 20.3l60.1 60.1c5.6 5.6 14.7 5.6 20.3 0l45.3-45.3 45.3 45.3-45.3 45.3c-5.6 5.6-5.6 14.7 0 20.3l60.1 60.1c5.6 5.6 14.7 5.6 20.3 0l60.1-60.1c5.6-5.6 5.6-14.7 0-20.3l-45.3-45.3 45.3-45.3 45.3 45.3c5.6 5.6 14.7 5.6 20.3 0l60.1-60.1c5.6-5.6 5.6-14.7 0-20.3l-45.3-45.3 45.3-45.3c5.6-5.6 5.6-14.7 0-20.3z" />
        </svg>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          We&apos;ll be back soon!
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Sorry for the inconvenience but we&apos;re performing some maintenance at
          the moment. We&apos;ll be back online shortly!
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-indigo-800 font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default MaintenancePage;
