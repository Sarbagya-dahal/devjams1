import React from 'react';

const ViewReports = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950 flex items-center justify-center">
      <div className="text-center p-8 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-md mx-4">
        <h1 className="text-3xl font-bold text-white mb-4">View Reports</h1>
        <p className="text-blue-100 dark:text-blue-200 mb-6">
          Financial reports and analytics will be displayed here.
        </p>
        <div className="animate-pulse flex justify-center">
          <div className="h-12 w-12 bg-blue-500/30 rounded-full flex items-center justify-center">
            <svg 
              className="h-8 w-8 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
        </div>
        <p className="text-blue-200/70 dark:text-blue-300/70 text-sm mt-6">
          This section is currently under development
        </p>
      </div>
    </div>
  );
};

export default ViewReports;
