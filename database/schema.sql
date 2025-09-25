-- SAFe Project Manager Database Schema
-- PostgreSQL 15+ with JSONB support

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================
-- CORE ENTITIES
-- ==============================================

-- Organizations (Companies/Portfolios)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true
);

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- User Roles (SAFe specific)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- Portfolio Manager, RTE, PO, SM, Developer
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Organization-Role relationships
CREATE TABLE user_organization_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    UNIQUE(user_id, organization_id, role_id)
);

-- ==============================================
-- SAFe SPECIFIC ENTITIES
-- ==============================================

-- Release Trains
CREATE TABLE release_trains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- RT-1 E-commerce, RT-2 Mobile App
    description TEXT,
    rte_id UUID REFERENCES users(id), -- Release Train Engineer
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'planning', -- planning, active, completed, on-hold
    budget DECIMAL(15,2),
    spent DECIMAL(15,2) DEFAULT 0,
    velocity_target INTEGER,
    current_velocity INTEGER,
    health_score DECIMAL(3,1) CHECK (health_score >= 0 AND health_score <= 10),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Teams within Release Trains
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    release_train_id UUID REFERENCES release_trains(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_lead_id UUID REFERENCES users(id),
    scrum_master_id UUID REFERENCES users(id),
    product_owner_id UUID REFERENCES users(id),
    capacity INTEGER DEFAULT 100, -- Team capacity percentage
    velocity INTEGER DEFAULT 0,
    health_score DECIMAL(3,1) CHECK (health_score >= 0 AND health_score <= 10),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100), -- Developer, Designer, Tester, etc.
    allocation DECIMAL(3,2) DEFAULT 1.0, -- 0.0 to 1.0
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(team_id, user_id)
);

-- Program Increments (PI)
CREATE TABLE program_increments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    release_train_id UUID REFERENCES release_trains(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- PI-1, PI-2, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'planning', -- planning, active, completed
    objectives TEXT[],
    risks TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Epics (Large initiatives spanning Release Trains)
CREATE TABLE epics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    business_value TEXT,
    acceptance_criteria TEXT,
    priority INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- draft, approved, in-progress, completed, cancelled
    effort_estimate VARCHAR(50), -- Small, Medium, Large, Extra Large
    business_owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Features (Large functionality spanning teams)
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    epic_id UUID REFERENCES epics(id) ON DELETE CASCADE,
    release_train_id UUID REFERENCES release_trains(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    acceptance_criteria TEXT,
    priority INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- draft, approved, in-progress, completed, cancelled
    effort_estimate VARCHAR(50),
    business_value INTEGER DEFAULT 0,
    time_criticality INTEGER DEFAULT 0,
    risk_reduction INTEGER DEFAULT 0,
    job_size INTEGER DEFAULT 0,
    wsjf_score DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN job_size = 0 THEN 0
            ELSE (business_value + time_criticality + risk_reduction)::DECIMAL / job_size
        END
    ) STORED,
    assigned_to_team_id UUID REFERENCES teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- User Stories
CREATE TABLE user_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    acceptance_criteria TEXT,
    story_points INTEGER,
    priority INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- draft, ready, in-progress, completed, accepted
    sprint_id UUID, -- Will reference sprints table
    assignee_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Sprints
CREATE TABLE sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    program_increment_id UUID REFERENCES program_increments(id),
    name VARCHAR(255) NOT NULL, -- Sprint 1, Sprint 2, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'planning', -- planning, active, completed
    goal TEXT,
    capacity INTEGER DEFAULT 0,
    committed_points INTEGER DEFAULT 0,
    completed_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- RISK & IMPEDIMENT MANAGEMENT
-- ==============================================

-- Risks
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    release_train_id UUID REFERENCES release_trains(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- Technical, Business, Resource, External
    probability VARCHAR(50), -- Low, Medium, High, Critical
    impact VARCHAR(50), -- Low, Medium, High, Critical
    risk_score INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN probability = 'Low' AND impact = 'Low' THEN 1
            WHEN probability = 'Low' AND impact = 'Medium' THEN 2
            WHEN probability = 'Low' AND impact = 'High' THEN 3
            WHEN probability = 'Low' AND impact = 'Critical' THEN 4
            WHEN probability = 'Medium' AND impact = 'Low' THEN 2
            WHEN probability = 'Medium' AND impact = 'Medium' THEN 4
            WHEN probability = 'Medium' AND impact = 'High' THEN 6
            WHEN probability = 'Medium' AND impact = 'Critical' THEN 8
            WHEN probability = 'High' AND impact = 'Low' THEN 3
            WHEN probability = 'High' AND impact = 'Medium' THEN 6
            WHEN probability = 'High' AND impact = 'High' THEN 9
            WHEN probability = 'High' AND impact = 'Critical' THEN 12
            WHEN probability = 'Critical' AND impact = 'Low' THEN 4
            WHEN probability = 'Critical' AND impact = 'Medium' THEN 8
            WHEN probability = 'Critical' AND impact = 'High' THEN 12
            WHEN probability = 'Critical' AND impact = 'Critical' THEN 16
            ELSE 0
        END
    ) STORED,
    status VARCHAR(50) DEFAULT 'identified', -- identified, assessed, mitigated, closed
    mitigation_plan TEXT,
    owner_id UUID REFERENCES users(id),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Impediments
CREATE TABLE impediments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) DEFAULT 'open', -- open, in-progress, resolved, closed
    resolution TEXT,
    assigned_to_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id)
);

-- ==============================================
-- METRICS & REPORTING
-- ==============================================

-- Velocity Tracking
CREATE TABLE velocity_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
    planned_points INTEGER DEFAULT 0,
    completed_points INTEGER DEFAULT 0,
    committed_points INTEGER DEFAULT 0,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Health Surveys
CREATE TABLE team_health_surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    survey_date DATE NOT NULL,
    happiness_score DECIMAL(3,1) CHECK (happiness_score >= 0 AND happiness_score <= 10),
    communication_score DECIMAL(3,1) CHECK (communication_score >= 0 AND communication_score <= 10),
    collaboration_score DECIMAL(3,1) CHECK (collaboration_score >= 0 AND collaboration_score <= 10),
    technical_debt_score DECIMAL(3,1) CHECK (technical_debt_score >= 0 AND technical_debt_score <= 10),
    overall_score DECIMAL(3,1) GENERATED ALWAYS AS (
        (happiness_score + communication_score + collaboration_score + technical_debt_score) / 4
    ) STORED,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Burndown Data
CREATE TABLE burndown_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    remaining_points INTEGER NOT NULL,
    ideal_remaining_points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- ACTIVITY LOGGING
-- ==============================================

-- Activity Log
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(100), -- release_train, team, feature, story, risk, etc.
    entity_id UUID,
    action VARCHAR(100), -- created, updated, deleted, status_changed
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Primary indexes
CREATE INDEX idx_release_trains_organization ON release_trains(organization_id);
CREATE INDEX idx_teams_release_train ON teams(release_train_id);
CREATE INDEX idx_features_release_train ON features(release_train_id);
CREATE INDEX idx_user_stories_team ON user_stories(team_id);
CREATE INDEX idx_risks_organization ON risks(organization_id);
CREATE INDEX idx_impediments_team ON impediments(team_id);
CREATE INDEX idx_activity_logs_organization ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Composite indexes
CREATE INDEX idx_user_stories_sprint_status ON user_stories(sprint_id, status);
CREATE INDEX idx_risks_status_priority ON risks(status, risk_score DESC);
CREATE INDEX idx_velocity_metrics_team_date ON velocity_metrics(team_id, measured_at DESC);

-- JSONB indexes
CREATE INDEX idx_release_trains_settings ON release_trains USING GIN(settings);
CREATE INDEX idx_features_metadata ON features USING GIN(settings);

-- Full-text search indexes
CREATE INDEX idx_features_search ON features USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_user_stories_search ON user_stories USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_release_trains_updated_at BEFORE UPDATE ON release_trains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_program_increments_updated_at BEFORE UPDATE ON program_increments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_epics_updated_at BEFORE UPDATE ON epics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stories_updated_at BEFORE UPDATE ON user_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON sprints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_impediments_updated_at BEFORE UPDATE ON impediments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- VIEWS FOR COMMON QUERIES
-- ==============================================

-- Dashboard Metrics View
CREATE VIEW dashboard_metrics AS
SELECT 
    o.id as organization_id,
    COUNT(DISTINCT rt.id) as active_release_trains,
    COUNT(DISTINCT t.id) as total_teams,
    COUNT(DISTINCT f.id) as total_features,
    COUNT(DISTINCT us.id) as total_user_stories,
    COUNT(DISTINCT CASE WHEN r.status = 'identified' THEN r.id END) as critical_risks,
    AVG(th.overall_score) as avg_team_health,
    AVG(vm.completed_points) as avg_velocity
FROM organizations o
LEFT JOIN release_trains rt ON o.id = rt.organization_id AND rt.status = 'active'
LEFT JOIN teams t ON rt.id = t.release_train_id
LEFT JOIN features f ON rt.id = f.release_train_id
LEFT JOIN user_stories us ON t.id = us.team_id
LEFT JOIN risks r ON o.id = r.organization_id AND r.status = 'identified'
LEFT JOIN team_health_surveys th ON t.id = th.team_id
LEFT JOIN velocity_metrics vm ON t.id = vm.team_id
GROUP BY o.id;

-- Release Train Progress View
CREATE VIEW release_train_progress AS
SELECT 
    rt.id,
    rt.name,
    rt.status,
    rt.budget,
    rt.spent,
    CASE 
        WHEN rt.budget > 0 THEN (rt.spent / rt.budget) * 100 
        ELSE 0 
    END as budget_utilization_percent,
    COUNT(DISTINCT t.id) as team_count,
    AVG(t.velocity) as avg_velocity,
    AVG(t.health_score) as avg_health_score,
    COUNT(DISTINCT f.id) as total_features,
    COUNT(DISTINCT CASE WHEN f.status = 'completed' THEN f.id END) as completed_features,
    COUNT(DISTINCT r.id) as total_risks,
    COUNT(DISTINCT CASE WHEN r.status = 'identified' THEN r.id END) as active_risks
FROM release_trains rt
LEFT JOIN teams t ON rt.id = t.release_train_id
LEFT JOIN features f ON rt.id = f.release_train_id
LEFT JOIN risks r ON rt.id = r.release_train_id
GROUP BY rt.id, rt.name, rt.status, rt.budget, rt.spent;

-- ==============================================
-- SAMPLE DATA FOR TESTING
-- ==============================================

-- Insert sample roles
INSERT INTO roles (name, description, permissions) VALUES
('Portfolio Manager', 'Portföljansvarig - Övergripande ansvar för portföljen', '["portfolio:read", "portfolio:write", "reports:read"]'),
('Release Train Engineer', 'RTE - Ansvarig för Release Train', '["rt:read", "rt:write", "pi-planning:manage"]'),
('Product Owner', 'PO - Ansvarig för produktbacklog', '["backlog:read", "backlog:write", "features:manage"]'),
('Scrum Master', 'SM - Facilitator för team', '["team:read", "team:write", "sprints:manage"]'),
('Developer', 'Utvecklare', '["stories:read", "stories:write"]');

-- Insert sample organization
INSERT INTO organizations (name, description, settings) VALUES
('TechCorp AB', 'Teknologiföretag med fokus på e-handel och mobilappar', '{"timezone": "Europe/Stockholm", "currency": "SEK"}');

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('david@techcorp.se', '$2b$10$example_hash', 'David', 'Andersson'),
('anna@techcorp.se', '$2b$10$example_hash', 'Anna', 'Johansson'),
('marcus@techcorp.se', '$2b$10$example_hash', 'Marcus', 'Svensson'),
('lisa@techcorp.se', '$2b$10$example_hash', 'Lisa', 'Eriksson');

-- Assign roles
INSERT INTO user_organization_roles (user_id, organization_id, role_id)
SELECT u.id, o.id, r.id
FROM users u, organizations o, roles r
WHERE u.email = 'david@techcorp.se' AND o.name = 'TechCorp AB' AND r.name = 'Portfolio Manager';

INSERT INTO user_organization_roles (user_id, organization_id, role_id)
SELECT u.id, o.id, r.id
FROM users u, organizations o, roles r
WHERE u.email = 'anna@techcorp.se' AND o.name = 'TechCorp AB' AND r.name = 'Release Train Engineer';
