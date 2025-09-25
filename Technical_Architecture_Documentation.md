# Teknisk Arkitektur-dokumentation - SAFe Projektledningsapp

## 1. Systemöversikt

### 1.1 Arkitekturprinciper
- **Microservices**: Modulär arkitektur med separata tjänster
- **Event-driven**: Asynkron kommunikation via events
- **API-first**: RESTful APIs med OpenAPI-specifikation
- **Cloud-native**: Containeriserad med Kubernetes-stöd
- **Security by design**: Säkerhet integrerad i alla lager
- **Observability**: Omfattande logging, monitoring och tracing

### 1.2 Teknisk stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js 20 + Express.js + TypeScript
- **Database**: PostgreSQL 15 + Redis 7
- **Message Queue**: Apache Kafka
- **Containerization**: Docker + Kubernetes
- **Monitoring**: Prometheus + Grafana + ELK Stack

## 2. Mikroservicearkitektur

### 2.1 Service Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                    SAFe Project Manager                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │   Frontend  │ │   API       │ │   Auth      │ │   Events    │ │
│ │   Service   │ │   Gateway   │ │   Service   │ │   Service   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │   Project   │ │   User      │ │   Metrics   │ │   Reports   │ │
│ │   Service   │ │   Service   │ │   Service   │ │   Service   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │   Risk      │ │   Backlog   │ │   PI        │ │   Sprint    │ │
│ │   Service   │ │   Service   │ │   Service   │ │   Service   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Service Responsibilities

#### Frontend Service
- **Teknologi**: React 18 + TypeScript
- **Ansvar**: Användargränssnitt, state management, routing
- **Port**: 3015 (dev/prod)

#### API Gateway
- **Teknologi**: Node.js + Express.js
- **Ansvar**: Routing, rate limiting, authentication, load balancing
- **Port**: 3016 (dev/prod)

#### Auth Service
- **Teknologi**: Node.js + JWT + OAuth2
- **Ansvar**: Autentisering, auktorisering, session management
- **Port**: 3017

#### Project Service
- **Teknologi**: Node.js + PostgreSQL
- **Ansvar**: Release Train management, project lifecycle
- **Port**: 3018

#### User Service
- **Teknologi**: Node.js + PostgreSQL
- **Ansvar**: Användarhantering, roller, permissions
- **Port**: 3019

#### Metrics Service
- **Teknologi**: Node.js + Redis + InfluxDB
- **Ansvar**: Metrics collection, analytics, dashboards
- **Port**: 3020

#### Reports Service
- **Teknologi**: Node.js + PDF generation
- **Ansvar**: Report generation, scheduling, distribution
- **Port**: 3021

#### Risk Service
- **Teknologi**: Node.js + PostgreSQL
- **Ansvar**: Risk management, impediment tracking
- **Port**: 3022

#### Backlog Service
- **Teknologi**: Node.js + PostgreSQL
- **Ansvar**: Backlog management, WSJF calculation
- **Port**: 3023

#### PI Service
- **Teknologi**: Node.js + PostgreSQL
- **Ansvar**: PI Planning, capacity planning
- **Port**: 3024

#### Sprint Service
- **Teknologi**: Node.js + PostgreSQL
- **Ansvar**: Sprint management, burndown charts
- **Port**: 3025

#### Events Service
- **Teknologi**: Apache Kafka + Node.js
- **Ansvar**: Event streaming, real-time notifications
- **Port**: 3026

## 3. Datamodell och Databasdesign

### 3.1 Database Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                    Database Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ PostgreSQL  │ │    Redis    │ │  InfluxDB   │ │   MongoDB   │ │
│ │   Primary   │ │   Cache     │ │   Metrics   │ │   Logs      │ │
│ │   Database  │ │   Session   │ │   Analytics │ │   Events    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Core Entities

#### Users & Organizations
```sql
-- Organizations (Multi-tenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    avatar_url VARCHAR(500),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER DEFAULT 0,
    velocity INTEGER DEFAULT 0,
    health_score DECIMAL(3,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Release Trains & Projects
```sql
-- Release Trains
CREATE TABLE release_trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status release_train_status DEFAULT 'planning',
    current_pi_id UUID,
    velocity INTEGER DEFAULT 0,
    health_score DECIMAL(3,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Program Increments
CREATE TABLE program_increments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_train_id UUID REFERENCES release_trains(id),
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status pi_status DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PI Objectives
CREATE TABLE pi_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pi_id UUID REFERENCES program_increments(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0,
    status objective_status DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Backlog Management
```sql
-- Epics
CREATE TABLE epics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    business_value INTEGER DEFAULT 0,
    status epic_status DEFAULT 'backlog',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Features
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    epic_id UUID REFERENCES epics(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    wsjf_score DECIMAL(5,2),
    size INTEGER DEFAULT 0,
    team_id UUID REFERENCES teams(id),
    status feature_status DEFAULT 'backlog',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Stories
CREATE TABLE user_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id UUID REFERENCES features(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    acceptance_criteria TEXT[],
    story_points INTEGER DEFAULT 0,
    assignee_id UUID REFERENCES users(id),
    status story_status DEFAULT 'backlog',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Risk & Impediment Management
```sql
-- Risks
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category risk_category NOT NULL,
    probability risk_level NOT NULL,
    impact risk_level NOT NULL,
    risk_score INTEGER GENERATED ALWAYS AS (probability::int * impact::int) STORED,
    owner_id UUID REFERENCES users(id),
    mitigation TEXT,
    status risk_status DEFAULT 'identified',
    due_date DATE,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Impediments
CREATE TABLE impediments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity impediment_severity NOT NULL,
    reporter_id UUID REFERENCES users(id),
    owner_id UUID REFERENCES users(id),
    status impediment_status DEFAULT 'reported',
    impact TEXT,
    resolution TEXT,
    reported_date TIMESTAMP DEFAULT NOW(),
    assigned_date TIMESTAMP,
    resolved_date TIMESTAMP,
    eta TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_teams_organization ON teams(organization_id);
CREATE INDEX idx_release_trains_organization ON release_trains(organization_id);
CREATE INDEX idx_features_epic ON features(epic_id);
CREATE INDEX idx_user_stories_feature ON user_stories(feature_id);
CREATE INDEX idx_risks_organization ON risks(organization_id);
CREATE INDEX idx_impediments_organization ON impediments(organization_id);

-- Composite indexes
CREATE INDEX idx_features_team_status ON features(team_id, status);
CREATE INDEX idx_user_stories_assignee_status ON user_stories(assignee_id, status);
CREATE INDEX idx_risks_owner_status ON risks(owner_id, status);
```

## 4. API-specifikationer

### 4.1 RESTful API Design

#### Base URL Structure
```
Production: https://api.safe-pm.com/v1
Development: http://localhost:3016/v1
```

#### Authentication
```typescript
// JWT Token Structure
interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: UserRole;     // User role
  org: string;        // Organization ID
  iat: number;        // Issued at
  exp: number;        // Expires at
}

// API Headers
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Organization-ID: <org_id>
```

#### Core API Endpoints

##### Users & Authentication
```typescript
// Authentication
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me

// User Management
GET    /users
POST   /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
GET    /users/:id/teams
```

##### Release Trains
```typescript
// Release Train Management
GET    /release-trains
POST   /release-trains
GET    /release-trains/:id
PUT    /release-trains/:id
DELETE /release-trains/:id
GET    /release-trains/:id/teams
GET    /release-trains/:id/metrics
```

##### Program Increments
```typescript
// PI Management
GET    /release-trains/:rtId/pis
POST   /release-trains/:rtId/pis
GET    /pis/:id
PUT    /pis/:id
DELETE /pis/:id
GET    /pis/:id/objectives
POST   /pis/:id/objectives
GET    /pis/:id/planning-board
```

##### Backlog Management
```typescript
// Epic Management
GET    /epics
POST   /epics
GET    /epics/:id
PUT    /epics/:id
DELETE /epics/:id
GET    /epics/:id/features

// Feature Management
GET    /features
POST   /features
GET    /features/:id
PUT    /features/:id
DELETE /features/:id
GET    /features/:id/user-stories
POST   /features/:id/wsjf-calculate

// User Story Management
GET    /user-stories
POST   /user-stories
GET    /user-stories/:id
PUT    /user-stories/:id
DELETE /user-stories/:id
```

##### Risk & Impediment Management
```typescript
// Risk Management
GET    /risks
POST   /risks
GET    /risks/:id
PUT    /risks/:id
DELETE /risks/:id
GET    /risks/matrix
POST   /risks/:id/mitigation

// Impediment Management
GET    /impediments
POST   /impediments
GET    /impediments/:id
PUT    /impediments/:id
DELETE /impediments/:id
POST   /impediments/:id/resolve
```

##### Metrics & Reporting
```typescript
// Metrics
GET    /metrics/velocity
GET    /metrics/cycle-time
GET    /metrics/lead-time
GET    /metrics/defect-rate
GET    /metrics/team-health

// Reports
GET    /reports/sprint-summary
GET    /reports/pi-summary
GET    /reports/risk-summary
POST   /reports/custom
GET    /reports/:id/download
```

### 4.2 WebSocket Events
```typescript
// Real-time Events
interface WebSocketEvents {
  // PI Planning Events
  'pi-planning:started': { piId: string; userId: string };
  'pi-planning:feature-moved': { featureId: string; fromTeam: string; toTeam: string };
  'pi-planning:capacity-updated': { teamId: string; capacity: number };
  
  // Sprint Events
  'sprint:started': { sprintId: string; teamId: string };
  'sprint:story-completed': { storyId: string; userId: string };
  'sprint:burndown-updated': { sprintId: string; remaining: number };
  
  // Risk Events
  'risk:created': { riskId: string; severity: string };
  'risk:escalated': { riskId: string; newSeverity: string };
  'impediment:reported': { impedimentId: string; severity: string };
  
  // General Events
  'notification:new': { userId: string; message: string; type: string };
  'system:maintenance': { message: string; scheduledTime: string };
}
```

## 5. Säkerhetsarkitektur

### 5.1 Authentication & Authorization
```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │   SSO       │ │   JWT       │ │   RBAC      │ │   API       │ │
│ │   SAML      │ │   Tokens    │ │   Permissions│ │   Gateway   │ │
│ │   OAuth2    │ │   Refresh   │ │   Policies  │ │   Security  │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Security Implementation

#### JWT Token Management
```typescript
// Token Configuration
const JWT_CONFIG = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  algorithm: 'RS256',
  issuer: 'safe-pm-api',
  audience: 'safe-pm-client'
};

// Token Validation Middleware
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

#### Role-Based Access Control (RBAC)
```typescript
// Permission Matrix
const PERMISSIONS = {
  PORTFOLIO_MANAGER: [
    'read:all', 'write:all', 'delete:all',
    'manage:organizations', 'manage:users',
    'view:all-metrics', 'export:all-reports'
  ],
  RELEASE_TRAIN_ENGINEER: [
    'read:release-train', 'write:release-train',
    'manage:pi-planning', 'view:team-metrics',
    'manage:risks', 'manage:impediments'
  ],
  PRODUCT_OWNER: [
    'read:backlog', 'write:backlog',
    'manage:features', 'manage:user-stories',
    'view:team-metrics'
  ],
  SCRUM_MASTER: [
    'read:team', 'write:team',
    'manage:sprints', 'view:team-metrics',
    'manage:impediments'
  ],
  TEAM_MEMBER: [
    'read:assigned', 'write:assigned',
    'view:team-metrics'
  ]
};

// Permission Middleware
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    const userPermissions = PERMISSIONS[userRole] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

### 5.3 Data Encryption
```typescript
// Encryption Configuration
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16
};

// Data Encryption Service
class EncryptionService {
  private key: Buffer;
  
  constructor() {
    this.key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  }
  
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', this.key);
    cipher.setAAD(Buffer.from('safe-pm'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  }
  
  decrypt(encryptedText: string): string {
    const [ivHex, tagHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const decipher = crypto.createDecipher('aes-256-gcm', this.key);
    decipher.setAAD(Buffer.from('safe-pm'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

## 6. Deployment och Infrastruktur

### 6.1 Container Orchestration
```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: safe-pm-frontend
  namespace: safe-pm
spec:
  replicas: 3
  selector:
    matchLabels:
      app: safe-pm-frontend
  template:
    metadata:
      labels:
        app: safe-pm-frontend
    spec:
      containers:
      - name: frontend
        image: safe-pm/frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_URL
          value: "https://api.safe-pm.com"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: safe-pm-frontend-service
  namespace: safe-pm
spec:
  selector:
    app: safe-pm-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### 6.2 Infrastructure as Code
```yaml
# terraform/main.tf
provider "aws" {
  region = "eu-north-1"
}

# VPC Configuration
resource "aws_vpc" "safe_pm_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "safe-pm-vpc"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "safe_pm_cluster" {
  name     = "safe-pm-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.28"
  
  vpc_config {
    subnet_ids = [
      aws_subnet.private_subnet_1.id,
      aws_subnet.private_subnet_2.id,
      aws_subnet.public_subnet_1.id,
      aws_subnet.public_subnet_2.id
    ]
    endpoint_private_access = true
    endpoint_public_access  = true
  }
  
  depends_on = [
    aws_cloudwatch_log_group.eks_cluster_logs,
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# RDS PostgreSQL
resource "aws_db_instance" "safe_pm_db" {
  identifier     = "safe-pm-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.medium"
  allocated_storage = 100
  storage_type   = "gp2"
  
  db_name  = "safe_pm"
  username = "safe_user"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.safe_pm_db_subnet_group.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "safe-pm-db-final-snapshot"
  
  tags = {
    Name = "safe-pm-database"
  }
}
```

## 7. Monitoring och Observability

### 7.1 Monitoring Stack
```
┌─────────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Prometheus  │ │   Grafana    │ │   ELK       │ │   Jaeger    │ │
│ │   Metrics   │ │   Dashboards │ │   Logging   │ │   Tracing   │ │
│ │   Collection│ │   Alerts     │ │   Analysis  │ │   APM       │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Application Metrics
```typescript
// Metrics Collection
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Business Metrics
const userRegistrations = new Counter({
  name: 'safe_pm_user_registrations_total',
  help: 'Total number of user registrations',
  labelNames: ['organization', 'role']
});

const activeUsers = new Gauge({
  name: 'safe_pm_active_users',
  help: 'Number of active users',
  labelNames: ['organization']
});

const sprintVelocity = new Gauge({
  name: 'safe_pm_sprint_velocity',
  help: 'Sprint velocity in story points',
  labelNames: ['team', 'sprint']
});

// Technical Metrics
const apiRequests = new Counter({
  name: 'safe_pm_api_requests_total',
  help: 'Total number of API requests',
  labelNames: ['method', 'endpoint', 'status_code']
});

const apiResponseTime = new Histogram({
  name: 'safe_pm_api_response_time_seconds',
  help: 'API response time in seconds',
  labelNames: ['method', 'endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const databaseConnections = new Gauge({
  name: 'safe_pm_database_connections_active',
  help: 'Number of active database connections'
});

// Custom Metrics Middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    apiRequests.inc({
      method: req.method,
      endpoint: req.route?.path || req.path,
      status_code: res.statusCode
    });
    
    apiResponseTime.observe({
      method: req.method,
      endpoint: req.route?.path || req.path
    }, duration);
  });
  
  next();
};
```

### 7.3 Health Checks
```typescript
// Health Check Endpoints
export const healthCheck = async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
    services: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      kafka: await checkKafkaHealth()
    }
  };
  
  const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json(health);
};

const checkDatabaseHealth = async () => {
  try {
    await db.query('SELECT 1');
    return { status: 'healthy', responseTime: Date.now() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

const checkRedisHealth = async () => {
  try {
    await redis.ping();
    return { status: 'healthy', responseTime: Date.now() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

## 8. Disaster Recovery och Backup

### 8.1 Backup Strategy
```yaml
# backup-strategy.yaml
backup_policies:
  database:
    frequency: "daily"
    retention: "30 days"
    encryption: true
    compression: true
    destinations:
      - "s3://safe-pm-backups/database"
      - "s3://safe-pm-backups-secondary/database"
  
  application_data:
    frequency: "hourly"
    retention: "7 days"
    encryption: true
    destinations:
      - "s3://safe-pm-backups/app-data"
  
  configuration:
    frequency: "on-change"
    retention: "90 days"
    encryption: true
    destinations:
      - "s3://safe-pm-backups/config"
```

### 8.2 Disaster Recovery Plan
```typescript
// Disaster Recovery Procedures
export class DisasterRecoveryService {
  async initiateFailover(region: string) {
    // 1. Activate backup region
    await this.activateBackupRegion(region);
    
    // 2. Update DNS records
    await this.updateDNSRecords(region);
    
    // 3. Restore database from backup
    await this.restoreDatabase(region);
    
    // 4. Verify application health
    await this.verifyApplicationHealth(region);
    
    // 5. Notify stakeholders
    await this.notifyStakeholders(region);
  }
  
  async restoreFromBackup(backupId: string) {
    // 1. Stop all services
    await this.stopAllServices();
    
    // 2. Restore database
    await this.restoreDatabaseFromBackup(backupId);
    
    // 3. Restore application data
    await this.restoreApplicationData(backupId);
    
    // 4. Restart services
    await this.restartAllServices();
    
    // 5. Verify data integrity
    await this.verifyDataIntegrity();
  }
}
```

---

**Dokumentversion:** 1.0  
**Senast uppdaterad:** 2024-12-19  
**Författare:** Architecture Team  
**Godkänd av:** Tech Lead
