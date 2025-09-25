import knex from 'knex';
// @ts-ignore
import config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

export interface Organization {
  id: string;
  name: string;
  description?: string;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  is_active: boolean;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  preferences: Record<string, any>;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface ReleaseTrain {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  rte_id?: string;
  start_date?: Date;
  end_date?: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  budget?: number;
  spent: number;
  velocity_target?: number;
  current_velocity?: number;
  health_score?: number;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface Team {
  id: string;
  release_train_id: string;
  name: string;
  description?: string;
  team_lead_id?: string;
  scrum_master_id?: string;
  product_owner_id?: string;
  capacity: number;
  velocity: number;
  health_score?: number;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Feature {
  id: string;
  epic_id?: string;
  release_train_id: string;
  name: string;
  description?: string;
  acceptance_criteria?: string;
  priority: number;
  status: 'draft' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  effort_estimate?: string;
  business_value: number;
  time_criticality: number;
  risk_reduction: number;
  job_size: number;
  wsjf_score: number;
  assigned_to_team_id?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface Risk {
  id: string;
  organization_id: string;
  release_train_id?: string;
  title: string;
  description?: string;
  category?: string;
  probability: 'Low' | 'Medium' | 'High' | 'Critical';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  risk_score: number;
  status: 'identified' | 'assessed' | 'mitigated' | 'closed';
  mitigation_plan?: string;
  owner_id?: string;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface ActivityLog {
  id: string;
  organization_id: string;
  user_id: string;
  entity_type: string;
  entity_id?: string;
  action: string;
  description: string;
  metadata: Record<string, any>;
  created_at: Date;
}

class DatabaseService {
  // ==============================================
  // ORGANIZATION OPERATIONS
  // ==============================================

  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    const [organization] = await db('organizations')
      .insert(data)
      .returning('*');
    return organization;
  }

  async getOrganization(id: string): Promise<Organization | null> {
    return await db('organizations')
      .where({ id, is_active: true })
      .first();
  }

  async getOrganizations(): Promise<Organization[]> {
    return await db('organizations')
      .where({ is_active: true })
      .orderBy('created_at', 'desc');
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    const [organization] = await db('organizations')
      .where({ id })
      .update(data)
      .returning('*');
    return organization;
  }

  // ==============================================
  // USER OPERATIONS
  // ==============================================

  async createUser(data: Partial<User>): Promise<User> {
    const [user] = await db('users')
      .insert(data)
      .returning('*');
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await db('users')
      .where({ email, is_active: true })
      .first();
  }

  async getUser(id: string): Promise<User | null> {
    return await db('users')
      .where({ id, is_active: true })
      .first();
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db('users')
      .where({ id })
      .update(data)
      .returning('*');
    return user;
  }

  // ==============================================
  // RELEASE TRAIN OPERATIONS
  // ==============================================

  async createReleaseTrain(data: Partial<ReleaseTrain>): Promise<ReleaseTrain> {
    const [releaseTrain] = await db('release_trains')
      .insert(data)
      .returning('*');
    return releaseTrain;
  }

  async getReleaseTrains(organizationId: string): Promise<ReleaseTrain[]> {
    return await db('release_trains')
      .where({ organization_id: organizationId })
      .orderBy('created_at', 'desc');
  }

  async getReleaseTrain(id: string): Promise<ReleaseTrain | null> {
    return await db('release_trains')
      .where({ id })
      .first();
  }

  async updateReleaseTrain(id: string, data: Partial<ReleaseTrain>): Promise<ReleaseTrain> {
    const [releaseTrain] = await db('release_trains')
      .where({ id })
      .update(data)
      .returning('*');
    return releaseTrain;
  }

  async getReleaseTrainProgress(organizationId: string) {
    return await db('release_train_progress')
      .where({ organization_id: organizationId });
  }

  // ==============================================
  // TEAM OPERATIONS
  // ==============================================

  async createTeam(data: Partial<Team>): Promise<Team> {
    const [team] = await db('teams')
      .insert(data)
      .returning('*');
    return team;
  }

  async getTeams(releaseTrainId: string): Promise<Team[]> {
    return await db('teams')
      .where({ release_train_id: releaseTrainId })
      .orderBy('created_at', 'desc');
  }

  async getTeam(id: string): Promise<Team | null> {
    return await db('teams')
      .where({ id })
      .first();
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    const [team] = await db('teams')
      .where({ id })
      .update(data)
      .returning('*');
    return team;
  }

  // ==============================================
  // FEATURE OPERATIONS
  // ==============================================

  async createFeature(data: Partial<Feature>): Promise<Feature> {
    const [feature] = await db('features')
      .insert(data)
      .returning('*');
    return feature;
  }

  async getFeatures(releaseTrainId: string): Promise<Feature[]> {
    return await db('features')
      .where({ release_train_id: releaseTrainId })
      .orderBy('wsjf_score', 'desc');
  }

  async getFeature(id: string): Promise<Feature | null> {
    return await db('features')
      .where({ id })
      .first();
  }

  async updateFeature(id: string, data: Partial<Feature>): Promise<Feature> {
    const [feature] = await db('features')
      .where({ id })
      .update(data)
      .returning('*');
    return feature;
  }

  // ==============================================
  // RISK OPERATIONS
  // ==============================================

  async createRisk(data: Partial<Risk>): Promise<Risk> {
    const [risk] = await db('risks')
      .insert(data)
      .returning('*');
    return risk;
  }

  async getRisks(organizationId: string): Promise<Risk[]> {
    return await db('risks')
      .where({ organization_id: organizationId })
      .orderBy('risk_score', 'desc');
  }

  async getRisk(id: string): Promise<Risk | null> {
    return await db('risks')
      .where({ id })
      .first();
  }

  async updateRisk(id: string, data: Partial<Risk>): Promise<Risk> {
    const [risk] = await db('risks')
      .where({ id })
      .update(data)
      .returning('*');
    return risk;
  }

  // ==============================================
  // DASHBOARD OPERATIONS
  // ==============================================

  async getDashboardMetrics(organizationId: string) {
    const metrics = await db('dashboard_metrics')
      .where({ organization_id: organizationId })
      .first();

    if (!metrics) {
      // Return default metrics if no data exists
      return {
        releaseTrains: { active: 0, total: 0, change: 'No data' },
        projects: { total: 0, active: 0, completed: 0, change: 'No data' },
        risks: { critical: 0, high: 0, medium: 0, low: 0, change: 'No data' },
        teamHealth: { average: 0, range: '0 - 0', change: 'No data' },
        velocity: { average: 0, trend: 'stable', change: 'No data' },
        completion: { rate: 0, change: 'No data' }
      };
    }

    return {
      releaseTrains: {
        active: metrics.active_release_trains || 0,
        total: metrics.active_release_trains || 0,
        change: '+0 this month'
      },
      projects: {
        total: metrics.total_features || 0,
        active: Math.floor((metrics.total_features || 0) * 0.8),
        completed: Math.floor((metrics.total_features || 0) * 0.2),
        change: '+0 this month'
      },
      risks: {
        critical: metrics.critical_risks || 0,
        high: Math.floor((metrics.critical_risks || 0) * 2),
        medium: Math.floor((metrics.critical_risks || 0) * 4),
        low: Math.floor((metrics.critical_risks || 0) * 6),
        change: 'Needs attention'
      },
      teamHealth: {
        average: metrics.avg_team_health || 0,
        range: `${(metrics.avg_team_health || 0) - 1} - ${(metrics.avg_team_health || 0) + 1}`,
        change: '+0.0 this week'
      },
      velocity: {
        average: metrics.avg_velocity || 0,
        trend: 'up',
        change: '+0.0 this sprint'
      },
      completion: {
        rate: 85,
        change: '+0% this sprint'
      }
    };
  }

  async getReleaseTrainOverview(organizationId: string) {
    return await db('release_train_progress')
      .where({ organization_id: organizationId });
  }

  async getVelocityData(teamId: string, timeRange: number = 6) {
    return await db('velocity_metrics')
      .where({ team_id: teamId })
      .orderBy('measured_at', 'desc')
      .limit(timeRange);
  }

  async getTeamHealthData(releaseTrainId: string) {
    return await db('team_health_surveys')
      .join('teams', 'team_health_surveys.team_id', 'teams.id')
      .where('teams.release_train_id', releaseTrainId)
      .select('teams.name', 'team_health_surveys.overall_score as health')
      .orderBy('team_health_surveys.survey_date', 'desc');
  }

  async getRiskDistribution(organizationId: string) {
    const risks = await db('risks')
      .where({ organization_id: organizationId })
      .select('probability', 'impact');

    const distribution = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };

    risks.forEach(risk => {
      if (risk.probability === 'Critical' || risk.impact === 'Critical') {
        distribution.Critical++;
      } else if (risk.probability === 'High' || risk.impact === 'High') {
        distribution.High++;
      } else if (risk.probability === 'Medium' || risk.impact === 'Medium') {
        distribution.Medium++;
      } else {
        distribution.Low++;
      }
    });

    return [
      { name: 'Low', value: distribution.Low, color: '#10B981' },
      { name: 'Medium', value: distribution.Medium, color: '#F59E0B' },
      { name: 'High', value: distribution.High, color: '#EF4444' },
      { name: 'Critical', value: distribution.Critical, color: '#DC2626' }
    ];
  }

  async getActivities(organizationId: string, limit: number = 10, type?: string) {
    let query = db('activity_logs')
      .where({ organization_id: organizationId })
      .orderBy('created_at', 'desc')
      .limit(limit);

    if (type) {
      query = query.where('metadata->>type', type);
    }

    return await query;
  }

  // ==============================================
  // ACTIVITY LOGGING
  // ==============================================

  async logActivity(data: Partial<ActivityLog>): Promise<ActivityLog> {
    const [activity] = await db('activity_logs')
      .insert(data)
      .returning('*');
    return activity;
  }

  // ==============================================
  // UTILITY METHODS
  // ==============================================

  async healthCheck(): Promise<boolean> {
    try {
      await db.raw('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    await db.destroy();
  }
}

export const databaseService = new DatabaseService();
export default databaseService;
