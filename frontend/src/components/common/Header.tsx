import React from 'react';
import { Bell, Mail, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">
              🏢 SAFe Project Manager
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Mail className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                David (Portföljansvarig)
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
