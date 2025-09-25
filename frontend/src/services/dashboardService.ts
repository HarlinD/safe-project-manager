import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3016';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface DashboardMetrics {
  releaseTrains: {
    active: number;
    total: number;
    change: string;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    change: string;
  };
  risks: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    change: string;
  };
  teamHealth: {
    average: number;
    range: string;
    change: string;
  };
  velocity: {
    average: number;
    trend: string;
    change: string;
  };
  completion: {
    rate: number;
    change: string;
  };
}

export interface ReleaseTrain {
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
  risks: number;
  features: number;
  completedFeatures: number;
}

export interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  releaseTrain?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ChartDataPoint {
  name: string;
  velocity?: number;
  planned?: number;
  actual?: number;
  health?: number;
  trend?: string;
}

export interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  total?: number;
  error?: string;
  message?: string;
}

class DashboardService {
  // Fetch dashboard metrics
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await api.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      throw error;
    }
  }

  // Fetch release trains overview
  async getReleaseTrains(): Promise<ReleaseTrain[]> {
    try {
      const response = await api.get<ApiResponse<ReleaseTrain[]>>('/dashboard/release-trains');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch release trains:', error);
      throw error;
    }
  }

  // Fetch activity feed
  async getActivities(limit: number = 10, type?: string): Promise<ActivityItem[]> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (type) {
        params.append('type', type);
      }
      
      const response = await api.get<ApiResponse<ActivityItem[]>>(`/dashboard/activities?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      throw error;
    }
  }

  // Fetch velocity chart data
  async getVelocityData(timeRange: number = 6): Promise<ChartDataPoint[]> {
    try {
      const response = await api.get<ApiResponse<ChartDataPoint[]>>(`/dashboard/charts/velocity?timeRange=${timeRange}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch velocity data:', error);
      throw error;
    }
  }

  // Fetch team health chart data
  async getTeamHealthData(): Promise<ChartDataPoint[]> {
    try {
      const response = await api.get<ApiResponse<ChartDataPoint[]>>('/dashboard/charts/team-health');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch team health data:', error);
      throw error;
    }
  }

  // Fetch risk distribution data
  async getRiskDistributionData(): Promise<RiskDistributionData[]> {
    try {
      const response = await api.get<ApiResponse<RiskDistributionData[]>>('/dashboard/charts/risk-distribution');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch risk distribution data:', error);
      throw error;
    }
  }

  // Subscribe to real-time updates
  async subscribeToUpdates(organizationId: string, userId: string): Promise<void> {
    try {
      await api.post('/dashboard/subscribe', {
        organizationId,
        userId
      });
    } catch (error) {
      console.error('Failed to subscribe to updates:', error);
      throw error;
    }
  }

  // Refresh dashboard data
  async refreshDashboard(organizationId: string): Promise<void> {
    try {
      await api.post('/dashboard/refresh', {
        organizationId
      });
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      throw error;
    }
  }

  // Get dashboard data for a specific time range
  async getDashboardData(timeRange: string = '7d') {
    try {
      const [metrics, releaseTrains, activities, velocityData, teamHealthData, riskData] = await Promise.all([
        this.getMetrics(),
        this.getReleaseTrains(),
        this.getActivities(10),
        this.getVelocityData(6),
        this.getTeamHealthData(),
        this.getRiskDistributionData()
      ]);

      return {
        metrics,
        releaseTrains,
        activities,
        charts: {
          velocity: velocityData,
          teamHealth: teamHealthData,
          riskDistribution: riskData
        },
        timeRange,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
