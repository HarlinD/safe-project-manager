import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Activity, 
  RefreshCw, 
  Settings, 
  Filter,
  Download,
  Calendar,
  Clock,
  Target,
  Zap,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useDashboard, useDashboardRealtime } from '../hooks/useDashboard';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}

interface ReleaseTrain {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  progress: number;
  velocity: number;
  teamCount: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
}

interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  releaseTrain?: string;
}

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'activity';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  visible: boolean;
}

const Dashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const { data, loading, error, refresh, isRefreshing, lastUpdated } = useDashboard(selectedTimeRange);
  const { isConnected } = useDashboardRealtime('org-1');

  // Transform API data to dashboard metrics
  const metrics: DashboardMetric[] = data ? [
    {
      id: 'release-trains',
      title: 'Active Release Trains',
      value: data.metrics?.releaseTrains.active || 0,
      change: data.metrics?.releaseTrains.change || '',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
      description: 'Total number of active Release Trains'
    },
    {
      id: 'projects',
      title: 'Total Projects',
      value: data.metrics?.projects.total || 0,
      change: data.metrics?.projects.change || '',
      trend: 'up',
      icon: Activity,
      color: 'green',
      description: 'Projects across all Release Trains'
    },
    {
      id: 'risks',
      title: 'Critical Risks',
      value: data.metrics?.risks.critical || 0,
      change: data.metrics?.risks.change || '',
      trend: 'neutral',
      icon: AlertTriangle,
      color: 'red',
      description: 'Risks requiring immediate attention'
    },
    {
      id: 'team-health',
      title: 'Team Health Score',
      value: `${data.metrics?.teamHealth.average || 0}/10`,
      change: data.metrics?.teamHealth.change || '',
      trend: 'up',
      icon: Users,
      color: 'purple',
      description: 'Average team health across organization'
    },
    {
      id: 'velocity',
      title: 'Avg Velocity',
      value: `${data.metrics?.velocity.average || 0} SP`,
      change: data.metrics?.velocity.change || '',
      trend: 'up',
      icon: Zap,
      color: 'orange',
      description: 'Average story points per sprint'
    },
    {
      id: 'completion',
      title: 'Sprint Completion',
      value: `${data.metrics?.completion.rate || 0}%`,
      change: data.metrics?.completion.change || '',
      trend: 'up',
      icon: Target,
      color: 'teal',
      description: 'Average sprint completion rate'
    }
  ] : [];

  const handleRefresh = async () => {
    await refresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-50 border-green-200';
      case 'at-risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'delayed': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  const getMetricColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      case 'teal': return 'text-teal-600';
      default: return 'text-gray-600';
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">Failed to load dashboard</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'} • 
            <span className="ml-1">Auto-refresh: Every 5 minutes</span>
            {isConnected && <span className="ml-2 text-green-600">🟢 Live</span>}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-6 w-6 ${getMetricColor(metric.color)}`} />
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.trend === 'up' ? 'bg-green-100 text-green-800' : 
                metric.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className={`text-xs ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change}
              </p>
              {metric.description && (
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Velocity Trend</h2>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Last 6 sprints</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.charts.velocity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#0066CC" 
                  strokeWidth={3}
                  dot={{ fill: '#0066CC', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Health Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Team Health Score</h2>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">By Release Train</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.charts.teamHealth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="health" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Release Train Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Release Train Overview</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Filter by status</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(data?.releaseTrains || []).map((train) => (
              <div key={train.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getStatusColor(train.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{train.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(train.status)}`}>
                    {train.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{train.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${train.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Velocity:</span>
                      <span className="font-medium ml-1">{train.velocity} SP</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Teams:</span>
                      <span className="font-medium ml-1">{train.teamCount}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Budget: ${(train.budget / 1000).toFixed(0)}k</span>
                      <span>Spent: ${(train.spent / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full" 
                        style={{ width: `${(train.spent / train.budget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Risk Distribution</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data?.charts.riskDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.charts.riskDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {(data?.charts.riskDistribution || []).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity & Alerts</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(data?.activities || []).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-lg">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs text-gray-500">by {activity.user}</span>
                      {activity.releaseTrain && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {activity.releaseTrain}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;