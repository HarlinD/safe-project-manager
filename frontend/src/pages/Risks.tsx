import React from 'react';

const Risks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Risk & Impediment Management</h1>
        <span className="text-sm text-gray-500">Portfolio Overview</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Register</h2>
        <p className="text-gray-600">Riskhantering och impediment tracking kommer att implementeras här...</p>
      </div>
    </div>
  );
};

export default Risks;
