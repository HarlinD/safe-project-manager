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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                metric.color === 'blue' ? 'bg-blue-50' :
                metric.color === 'green' ? 'bg-green-50' :
                metric.color === 'red' ? 'bg-red-50' :
                metric.color === 'purple' ? 'bg-purple-50' :
                metric.color === 'orange' ? 'bg-orange-50' :
                metric.color === 'teal' ? 'bg-teal-50' : 'bg-gray-50'
              }`}>
                <metric.icon className={`h-6 w-6 ${
                  metric.color === 'blue' ? 'text-blue-600' :
                  metric.color === 'green' ? 'text-green-600' :
                  metric.color === 'red' ? 'text-red-600' :
                  metric.color === 'purple' ? 'text-purple-600' :
                  metric.color === 'orange' ? 'text-orange-600' :
                  metric.color === 'teal' ? 'text-teal-600' : 'text-gray-600'
                }`} />
              </div>
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                metric.trend === 'up' ? 'bg-green-100 text-green-700' : 
                metric.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <span className="mr-1">
                  {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                </span>
                {metric.trend === 'up' ? 'Up' : metric.trend === 'down' ? 'Down' : 'Stable'}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </p>
                {metric.description && (
                  <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                    <div className="relative">
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                        {metric.description}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 cursor-help"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Velocity Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Story points delivered per sprint</p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Last 6 sprints</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.charts.velocity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} SP`, 'Velocity']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#0066CC" 
                  strokeWidth={3}
                  dot={{ fill: '#0066CC', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#0066CC', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Average: {data?.charts.velocity ? 
                Math.round(data.charts.velocity.reduce((sum, sprint) => sum + (sprint.velocity || 0), 0) / data.charts.velocity.length) 
                : 0} SP
              </span>
              <span>Trend: {data?.charts.velocity && data.charts.velocity.length > 1 ? 
                ((data.charts.velocity[data.charts.velocity.length - 1].velocity || 0) > (data.charts.velocity[0].velocity || 0) ? '↗ Increasing' : '↘ Decreasing')
                : '→ Stable'
              }</span>
            </div>
          </div>
        </div>

        {/* Team Health Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Team Health Score</h2>
                <p className="text-sm text-gray-600 mt-1">Health metrics by Release Train</p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  Avg: {data?.charts.teamHealth ? 
                    (data.charts.teamHealth.reduce((sum, team) => sum + (team.health || 0), 0) / data.charts.teamHealth.length).toFixed(1) 
                    : '0'}/10
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.charts.teamHealth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}/10`, 'Health Score']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="health" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {(data?.charts.teamHealth || []).map((team, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{team.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      (team.health || 0) >= 8 ? 'bg-green-500' :
                      (team.health || 0) >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-bold text-gray-900">{team.health || 0}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Release Train Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Release Train Overview</h2>
              <p className="text-sm text-gray-600 mt-1">Monitor progress and health across all release trains</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter by status</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(data?.releaseTrains || []).map((train) => (
              <div key={train.id} className={`group border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                train.status === 'on-track' ? 'border-green-200 bg-green-50/30' :
                train.status === 'at-risk' ? 'border-yellow-200 bg-yellow-50/30' :
                train.status === 'delayed' ? 'border-red-200 bg-red-50/30' :
                'border-blue-200 bg-blue-50/30'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      train.status === 'on-track' ? 'bg-green-500' :
                      train.status === 'at-risk' ? 'bg-yellow-500' :
                      train.status === 'delayed' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <h3 className="font-semibold text-gray-900">{train.name}</h3>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    train.status === 'on-track' ? 'bg-green-100 text-green-800' :
                    train.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                    train.status === 'delayed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {train.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Progress</span>
                      <span>{train.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          train.progress >= 80 ? 'bg-green-500' :
                          train.progress >= 60 ? 'bg-blue-500' :
                          train.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${train.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                      <div className="text-lg font-bold text-gray-900">{train.velocity}</div>
                      <div className="text-xs text-gray-500">Velocity (SP)</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                      <div className="text-lg font-bold text-gray-900">{train.teamCount}</div>
                      <div className="text-xs text-gray-500">Teams</div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Budget Utilization</span>
                      <span>{Math.round((train.spent / train.budget) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          (train.spent / train.budget) < 0.8 ? 'bg-green-500' :
                          (train.spent / train.budget) < 0.95 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(train.spent / train.budget) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>${(train.budget / 1000).toFixed(0)}k budget</span>
                      <span>${(train.spent / 1000).toFixed(0)}k spent</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Risk Distribution</h2>
                <p className="text-sm text-gray-600 mt-1">Monitor risk levels across projects</p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">
                  {(data?.charts.riskDistribution || []).reduce((sum, item) => sum + item.value, 0)} Total
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data?.charts.riskDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {(data?.charts.riskDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} risks`, 'Count']}
                    labelStyle={{ color: '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {(data?.charts.riskDistribution || []).map((item, index) => {
                const total = (data?.charts.riskDistribution || []).reduce((sum, risk) => sum + risk.value, 0);
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{percentage}%</span>
                      <span className="font-bold text-gray-900">{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Activity & Alerts</h2>
                <p className="text-sm text-gray-600 mt-1">Latest updates and notifications</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(data?.activities || []).map((activity) => (
                <div key={activity.id} className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    activity.type === 'success' ? 'bg-green-100 text-green-600' :
                    activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </p>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-3 w-3 text-gray-500" />
                        </div>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                      </div>
                      {activity.releaseTrain && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {activity.releaseTrain}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(data?.activities || []).length === 0 && (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">Activity will appear here as teams work</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;