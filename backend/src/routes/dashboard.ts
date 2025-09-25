import express, { Request, Response } from 'express';
import { io } from '../index';
import { databaseService } from '../services/databaseService';
import { cacheService } from '../services/cacheService';

const router = express.Router();

// Dashboard metrics endpoint
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const organizationId = req.query.organizationId as string || 'default-org';
    
    // Try to get from cache first
    let metrics = await cacheService.getDashboardMetrics(organizationId);
    
    if (!metrics) {
      // Get from database
      metrics = await databaseService.getDashboardMetrics(organizationId);
      
      // Cache the result for 5 minutes
      await cacheService.setDashboardMetrics(organizationId, metrics, 300);
    }

    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Release train overview endpoint
router.get('/release-trains', async (req: Request, res: Response) => {
  try {
    const releaseTrains = [
      {
        id: 'rt1',
        name: 'RT-1 E-commerce',
        status: 'on-track',
        progress: 85,
        velocity: 42,
        teamCount: 4,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        budget: 500000,
        spent: 425000,
        risks: 2,
        features: 12,
        completedFeatures: 10
      },
      {
        id: 'rt2',
        name: 'RT-2 Mobile App',
        status: 'at-risk',
        progress: 72,
        velocity: 38,
        teamCount: 3,
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        budget: 300000,
        spent: 280000,
        risks: 5,
        features: 8,
        completedFeatures: 6
      },
      {
        id: 'rt3',
        name: 'RT-3 Data Platform',
        status: 'on-track',
        progress: 91,
        velocity: 45,
        teamCount: 5,
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        budget: 750000,
        spent: 682500,
        risks: 1,
        features: 15,
        completedFeatures: 14
      },
      {
        id: 'rt4',
        name: 'RT-4 Analytics',
        status: 'delayed',
        progress: 45,
        velocity: 28,
        teamCount: 2,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        budget: 200000,
        spent: 190000,
        risks: 8,
        features: 6,
        completedFeatures: 3
      }
    ];

    res.json({
      success: true,
      data: releaseTrains,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch release trains',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Activity feed endpoint
router.get('/activities', async (req: Request, res: Response) => {
  try {
    const { limit = 10, type } = req.query;
    
    const activities = [
      {
        id: '1',
        type: 'error',
        title: 'Critical risk identified',
        description: 'RT-4: Resource shortage affecting delivery timeline',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user: 'Anna (RTE)',
        releaseTrain: 'RT-4',
        priority: 'high'
      },
      {
        id: '2',
        type: 'success',
        title: 'Sprint completed',
        description: 'RT-2: Sprint 3 completed with 2 story points remaining',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        user: 'Marcus (PO)',
        releaseTrain: 'RT-2',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'info',
        title: 'PI Planning scheduled',
        description: 'RT-1: PI Planning session scheduled for next Monday',
        timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
        user: 'David (Portfolio)',
        releaseTrain: 'RT-1',
        priority: 'medium'
      },
      {
        id: '4',
        type: 'success',
        title: 'Feature completed',
        description: 'RT-3: Feature "User Authentication" completed',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        user: 'Lisa (SM)',
        releaseTrain: 'RT-3',
        priority: 'low'
      },
      {
        id: '5',
        type: 'warning',
        title: 'Budget alert',
        description: 'RT-4: Approaching 95% of allocated budget',
        timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
        user: 'System',
        releaseTrain: 'RT-4',
        priority: 'high'
      }
    ];

    let filteredActivities = activities;
    if (type) {
      filteredActivities = activities.filter(activity => activity.type === type);
    }

    const limitedActivities = filteredActivities.slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: limitedActivities,
      total: filteredActivities.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Chart data endpoints
router.get('/charts/velocity', async (req: Request, res: Response) => {
  try {
    const { timeRange = '6' } = req.query;
    const sprintCount = parseInt(timeRange as string);
    
    const velocityData = Array.from({ length: sprintCount }, (_, i) => ({
      name: `Sprint ${i + 1}`,
      velocity: Math.floor(Math.random() * 20) + 30 + i * 2,
      planned: Math.floor(Math.random() * 20) + 35 + i,
      actual: Math.floor(Math.random() * 20) + 30 + i * 2
    }));

    res.json({
      success: true,
      data: velocityData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch velocity data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/charts/team-health', async (req: Request, res: Response) => {
  try {
    const teamHealthData = [
      { name: 'RT-1', health: 8.5, trend: 'up' },
      { name: 'RT-2', health: 7.8, trend: 'stable' },
      { name: 'RT-3', health: 9.1, trend: 'up' },
      { name: 'RT-4', health: 6.2, trend: 'down' }
    ];

    res.json({
      success: true,
      data: teamHealthData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team health data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/charts/risk-distribution', async (req: Request, res: Response) => {
  try {
    const riskDistributionData = [
      { name: 'Low', value: 15, color: '#10B981' },
      { name: 'Medium', value: 8, color: '#F59E0B' },
      { name: 'High', value: 3, color: '#EF4444' },
      { name: 'Critical', value: 2, color: '#DC2626' }
    ];

    res.json({
      success: true,
      data: riskDistributionData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch risk distribution data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Real-time updates endpoint
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { organizationId, userId } = req.body;
    
    // In a real implementation, you would store subscription info
    // and set up real-time updates via WebSocket
    
    res.json({
      success: true,
      message: 'Subscribed to real-time updates',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to updates',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Dashboard refresh endpoint
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.body;
    
    // Emit real-time update to connected clients
    if (io) {
      io.to(`org-${organizationId}`).emit('dashboard-update', {
        type: 'refresh',
        timestamp: new Date().toISOString(),
        data: {
          message: 'Dashboard data refreshed'
        }
      });
    }

    res.json({
      success: true,
      message: 'Dashboard refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to refresh dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
