# GitHub Actions Configuration for SAFe Project Manager

## Required Secrets

The following secrets need to be configured in your GitHub repository settings:

### Database Secrets
- `STAGING_DB_HOST` - Staging database host
- `STAGING_DB_PORT` - Staging database port
- `STAGING_DB_NAME` - Staging database name
- `STAGING_DB_USER` - Staging database user
- `STAGING_DB_PASSWORD` - Staging database password
- `PRODUCTION_DB_HOST` - Production database host
- `PRODUCTION_DB_PORT` - Production database port
- `PRODUCTION_DB_NAME` - Production database name
- `PRODUCTION_DB_USER` - Production database user
- `PRODUCTION_DB_PASSWORD` - Production database password

### Notification Secrets
- `SLACK_WEBHOOK` - Slack webhook URL for notifications

### Optional Secrets
- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for deployment
- `MONITORING_TOKEN` - Token for monitoring services

## Workflow Files

### 1. Frontend CI/CD (`frontend-ci.yml`)
- **Triggers**: Push/PR to main/develop branches affecting frontend
- **Jobs**:
  - Test: ESLint, TypeScript, Jest tests
  - Build: Production build
  - Docker Build: Multi-arch Docker images
  - Security Scan: Trivy vulnerability scanning
  - Deploy: Staging/Production deployment
  - Notify: Slack notifications

### 2. Backend CI/CD (`backend-ci.yml`)
- **Triggers**: Push/PR to main/develop branches affecting backend
- **Jobs**:
  - Test: ESLint, TypeScript, Jest tests with PostgreSQL/Redis
  - Build: TypeScript compilation
  - Docker Build: Multi-arch Docker images
  - Security Scan: Trivy vulnerability scanning
  - Deploy: Staging/Production deployment
  - Notify: Slack notifications

### 3. CodeQL Security Analysis (`codeql-analysis.yml`)
- **Triggers**: Push/PR to main/develop, weekly schedule
- **Jobs**:
  - Analyze: JavaScript/TypeScript security analysis
  - Upload: SARIF results to GitHub Security tab

### 4. Dependency Updates (`dependency-updates.yml`)
- **Triggers**: Weekly schedule (Mondays), manual dispatch
- **Jobs**:
  - Update: npm update for frontend/backend
  - Create PR: Automated dependency update PRs

### 5. Release (`release.yml`)
- **Triggers**: Git tags (v*)
- **Jobs**:
  - Release: Create GitHub release
  - Build: Release Docker images
  - Notify: Release notifications

### 6. Full Test Suite (`full-test-suite.yml`)
- **Triggers**: Push/PR to main/develop, manual dispatch
- **Jobs**:
  - Frontend Tests: Complete frontend test suite
  - Backend Tests: Complete backend test suite with services
  - Integration Tests: End-to-end API testing
  - Test Summary: Consolidated test results

### 7. Database Migrations (`database-migrations.yml`)
- **Triggers**: Push affecting migrations/seeds, manual dispatch
- **Jobs**:
  - Validate: Migration file validation
  - Deploy Staging: Staging database migrations
  - Deploy Production: Production database migrations
  - Notify: Migration status notifications

## Environment Protection Rules

### Staging Environment
- Required reviewers: 1
- Wait timer: 0 minutes
- Restrict to branches: develop

### Production Environment
- Required reviewers: 2
- Wait timer: 5 minutes
- Restrict to branches: main

## Branch Protection Rules

### Main Branch
- Require pull request reviews: 2 reviewers
- Require status checks: All workflows must pass
- Require branches to be up to date: Yes
- Restrict pushes: Yes

### Develop Branch
- Require pull request reviews: 1 reviewer
- Require status checks: Test workflows must pass
- Require branches to be up to date: Yes
- Restrict pushes: Yes

## Docker Registry

All Docker images are pushed to GitHub Container Registry:
- Registry: `ghcr.io`
- Images: `ghcr.io/HarlinD/safe-project-manager/frontend`
- Images: `ghcr.io/HarlinD/safe-project-manager/backend`

## Monitoring and Notifications

- **Slack Integration**: All workflows send notifications to `#safe-project-manager`
- **Security Scanning**: Trivy and CodeQL results uploaded to GitHub Security tab
- **Coverage Reports**: Codecov integration for test coverage tracking
- **Status Checks**: Required for all pull requests

## Manual Triggers

Several workflows support manual triggering:
- `dependency-updates.yml`: Update dependencies
- `full-test-suite.yml`: Run complete test suite
- `database-migrations.yml`: Run migrations on specific environment
