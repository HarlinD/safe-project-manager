import { createClient, RedisClientType } from 'redis';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

class CacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const config: CacheConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6380'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0')
    };

    this.client = createClient({
      socket: {
        host: config.host,
        port: config.port
      },
      password: config.password,
      database: config.db
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      console.log('Redis Client Disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
    }
  }

  // ==============================================
  // BASIC CACHE OPERATIONS
  // ==============================================

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) return null;
      return await this.client.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // ==============================================
  // JSON CACHE OPERATIONS
  // ==============================================

  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache getJSON error:', error);
      return null;
    }
  }

  async setJSON<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      return await this.set(key, jsonValue, ttlSeconds);
    } catch (error) {
      console.error('Cache setJSON error:', error);
      return false;
    }
  }

  // ==============================================
  // DASHBOARD CACHE OPERATIONS
  // ==============================================

  async getDashboardMetrics(organizationId: string) {
    const key = `dashboard:metrics:${organizationId}`;
    return await this.getJSON(key);
  }

  async setDashboardMetrics(organizationId: string, metrics: any, ttlSeconds: number = 300) {
    const key = `dashboard:metrics:${organizationId}`;
    return await this.setJSON(key, metrics, ttlSeconds);
  }

  async getReleaseTrains(organizationId: string) {
    const key = `dashboard:release-trains:${organizationId}`;
    return await this.getJSON(key);
  }

  async setReleaseTrains(organizationId: string, releaseTrains: any, ttlSeconds: number = 300) {
    const key = `dashboard:release-trains:${organizationId}`;
    return await this.setJSON(key, releaseTrains, ttlSeconds);
  }

  async getActivities(organizationId: string, limit: number = 10) {
    const key = `dashboard:activities:${organizationId}:${limit}`;
    return await this.getJSON(key);
  }

  async setActivities(organizationId: string, activities: any, limit: number = 10, ttlSeconds: number = 60) {
    const key = `dashboard:activities:${organizationId}:${limit}`;
    return await this.setJSON(key, activities, ttlSeconds);
  }

  async getChartData(chartType: string, organizationId: string, params: Record<string, any> = {}) {
    const paramString = Object.keys(params).length > 0 ? `:${JSON.stringify(params)}` : '';
    const key = `dashboard:chart:${chartType}:${organizationId}${paramString}`;
    return await this.getJSON(key);
  }

  async setChartData(chartType: string, organizationId: string, data: any, params: Record<string, any> = {}, ttlSeconds: number = 300) {
    const paramString = Object.keys(params).length > 0 ? `:${JSON.stringify(params)}` : '';
    const key = `dashboard:chart:${chartType}:${organizationId}${paramString}`;
    return await this.setJSON(key, data, ttlSeconds);
  }

  // ==============================================
  // SESSION CACHE OPERATIONS
  // ==============================================

  async getSession(sessionId: string) {
    const key = `session:${sessionId}`;
    return await this.getJSON(key);
  }

  async setSession(sessionId: string, sessionData: any, ttlSeconds: number = 3600) {
    const key = `session:${sessionId}`;
    return await this.setJSON(key, sessionData, ttlSeconds);
  }

  async deleteSession(sessionId: string) {
    const key = `session:${sessionId}`;
    return await this.del(key);
  }

  // ==============================================
  // RATE LIMITING
  // ==============================================

  async incrementRateLimit(key: string, windowSeconds: number = 60): Promise<number> {
    try {
      if (!this.isConnected) return 0;
      
      const pipeline = this.client.multi();
      pipeline.incr(key);
      pipeline.expire(key, windowSeconds);
      const results = await pipeline.exec();
      
      return results ? results[0] as number : 0;
    } catch (error) {
      console.error('Rate limit increment error:', error);
      return 0;
    }
  }

  async getRateLimit(key: string): Promise<number> {
    try {
      if (!this.isConnected) return 0;
      const value = await this.client.get(key);
      return value ? parseInt(value) : 0;
    } catch (error) {
      console.error('Rate limit get error:', error);
      return 0;
    }
  }

  // ==============================================
  // REAL-TIME DATA CACHE
  // ==============================================

  async publishUpdate(channel: string, data: any): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      await this.client.publish(channel, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Cache publish error:', error);
      return false;
    }
  }

  async subscribeToUpdates(channel: string, callback: (data: any) => void): Promise<void> {
    try {
      if (!this.isConnected) return;
      
      await this.client.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          callback(data);
        } catch (error) {
          console.error('Cache subscription message parse error:', error);
        }
      });
    } catch (error) {
      console.error('Cache subscription error:', error);
    }
  }

  // ==============================================
  // CACHE INVALIDATION
  // ==============================================

  async invalidateDashboard(organizationId: string): Promise<void> {
    const patterns = [
      `dashboard:metrics:${organizationId}`,
      `dashboard:release-trains:${organizationId}`,
      `dashboard:activities:${organizationId}:*`,
      `dashboard:chart:*:${organizationId}*`
    ];

    for (const pattern of patterns) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } catch (error) {
        console.error(`Cache invalidation error for pattern ${pattern}:`, error);
      }
    }
  }

  async invalidateReleaseTrain(releaseTrainId: string): Promise<void> {
    const patterns = [
      `dashboard:*:*`, // Invalidate all dashboard caches
      `release-train:${releaseTrainId}:*`
    ];

    for (const pattern of patterns) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } catch (error) {
        console.error(`Cache invalidation error for pattern ${pattern}:`, error);
      }
    }
  }

  // ==============================================
  // HEALTH CHECK
  // ==============================================

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Cache health check failed:', error);
      return false;
    }
  }

  // ==============================================
  // CACHE STATISTICS
  // ==============================================

  async getStats(): Promise<any> {
    try {
      if (!this.isConnected) return null;
      
      const info = await this.client.info('memory');
      const keyspace = await this.client.info('keyspace');
      
      return {
        connected: this.isConnected,
        memory: info,
        keyspace: keyspace,
        uptime: await this.client.info('server')
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }
}

export const cacheService = new CacheService();
export default cacheService;
