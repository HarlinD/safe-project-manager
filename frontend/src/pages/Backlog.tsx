import React from 'react';

const Backlog: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Backlog Management</h1>
        <span className="text-sm text-gray-500">E-commerce Platform</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Backlog Overview</h2>
        <p className="text-gray-600">Backlog management med WSJF-prioritering kommer att implementeras här...</p>
      </div>
    </div>
  );
};

export default Backlog;
