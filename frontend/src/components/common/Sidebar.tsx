import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Train, 
  ClipboardList, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Settings 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigationItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/release-train', icon: Train, label: 'Release Train' },
    { path: '/pi-planning', icon: ClipboardList, label: 'PI Planning' },
    { path: '/backlog', icon: FileText, label: 'Backlog' },
    { path: '/sprint-planning', icon: FileText, label: 'Sprint Planning' },
    { path: '/risks', icon: AlertTriangle, label: 'Risks' },
    { path: '/metrics', icon: TrendingUp, label: 'Metrics' },
    { path: '/stakeholders', icon: Users, label: 'Stakeholders' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
