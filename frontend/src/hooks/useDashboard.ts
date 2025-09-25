import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardMetrics, ReleaseTrain, ActivityItem, ChartDataPoint, RiskDistributionData } from '../services/dashboardService';

interface DashboardData {
  metrics: DashboardMetrics | null;
  releaseTrains: ReleaseTrain[];
  activities: ActivityItem[];
  charts: {
    velocity: ChartDataPoint[];
    teamHealth: ChartDataPoint[];
    riskDistribution: RiskDistributionData[];
  };
  timeRange: string;
  timestamp: string;
}

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

export const useDashboard = (timeRange: string = '7d'): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const dashboardData = await dashboardService.getDashboardData(timeRange);
      setData(dashboardData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [timeRange]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        fetchData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchData, isRefreshing]);

  return {
    data,
    loading,
    error,
    refresh,
    isRefreshing,
    lastUpdated
  };
};

// Hook for real-time updates via WebSocket
export const useDashboardRealtime = (organizationId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // This would connect to WebSocket in a real implementation
    // For now, we'll simulate the connection
    setIsConnected(true);
    
    const handleDashboardUpdate = (event: any) => {
      console.log('Dashboard update received:', event);
      setLastUpdate(new Date());
    };

    // Simulate WebSocket event listener
    window.addEventListener('dashboard-update', handleDashboardUpdate);

    return () => {
      window.removeEventListener('dashboard-update', handleDashboardUpdate);
      setIsConnected(false);
    };
  }, [organizationId]);

  return {
    isConnected,
    lastUpdate
  };
};

// Hook for dashboard metrics only
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setError(null);
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
};

// Hook for release trains only
export const useReleaseTrains = () => {
  const [releaseTrains, setReleaseTrains] = useState<ReleaseTrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleaseTrains = async () => {
      try {
        setError(null);
        const data = await dashboardService.getReleaseTrains();
        setReleaseTrains(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch release trains');
      } finally {
        setLoading(false);
      }
    };

    fetchReleaseTrains();
  }, []);

  return { releaseTrains, loading, error };
};

// Hook for activities only
export const useActivities = (limit: number = 10, type?: string) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setError(null);
        const data = await dashboardService.getActivities(limit, type);
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [limit, type]);

  return { activities, loading, error };
};
