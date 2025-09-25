# CI/CD Pipelines med GitHub Actions - SAFe Projektledningsapp

## 1. GitHub Actions Workflows Översikt

### 1.1 Workflow Structure
```
.github/workflows/
├── frontend-ci.yml          # Frontend CI pipeline
├── backend-ci.yml           # Backend CI pipeline
├── docker-build.yml         # Docker image build & push
├── security-scan.yml        # Security scanning
├── deploy-staging.yml       # Staging deployment
├── deploy-production.yml    # Production deployment
├── dependency-update.yml    # Dependency management
└── release.yml              # Release automation
```

### 1.2 Pipeline Triggers
- **Push to main**: Full CI/CD pipeline
- **Pull Request**: CI + Security scan
- **Release tag**: Production deployment
- **Schedule**: Dependency updates, security scans

## 2. Frontend CI Pipeline

### 2.1 Frontend CI Workflow
```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI

on:
  push:
    branches: [ main, develop ]
    paths: [ 'frontend/**' ]
  pull_request:
    branches: [ main, develop ]
    paths: [ 'frontend/**' ]

env:
  NODE_VERSION: '20.18.1'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/frontend

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
        
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
      
    - name: Run ESLint
      working-directory: ./frontend
      run: npm run lint
      
    - name: Run Prettier check
      working-directory: ./frontend
      run: npm run format:check
      
    - name: Run TypeScript check
      working-directory: ./frontend
      run: npm run type-check
      
    - name: Run unit tests
      working-directory: ./frontend
      run: npm run test:coverage
      
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./frontend/coverage/lcov.info
        flags: frontend
        name: frontend-coverage
        
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
        
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
      
    - name: Build application
      working-directory: ./frontend
      run: npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.STAGING_API_URL }}
        REACT_APP_VERSION: ${{ github.sha }}
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: frontend-build
        path: frontend/dist/
        retention-days: 7
        
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
        
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
      
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: frontend-build
        path: frontend/dist/
        
    - name: Start application
      working-directory: ./frontend
      run: |
        npm install -g serve
        serve -s dist -l 3000 &
        sleep 10
        
    - name: Run E2E tests
      working-directory: ./frontend
      run: npm run test:e2e
      env:
        CYPRESS_BASE_URL: http://localhost:3000
        
    - name: Upload E2E test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: e2e-test-results
        path: frontend/cypress/screenshots/
        retention-days: 7
```

## 3. Backend CI Pipeline

### 3.1 Backend CI Workflow
```yaml
# .github/workflows/backend-ci.yml
name: Backend CI

on:
  push:
    branches: [ main, develop ]
    paths: [ 'backend/**' ]
  pull_request:
    branches: [ main, develop ]
    paths: [ 'backend/**' ]

env:
  NODE_VERSION: '20.18.1'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/backend

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: safe_pm_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
          
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
        
    - name: Install dependencies
      working-directory: ./backend
      run: npm ci
      
    - name: Run ESLint
      working-directory: ./backend
      run: npm run lint
      
    - name: Run Prettier check
      working-directory: ./backend
      run: npm run format:check
      
    - name: Run TypeScript check
      working-directory: ./backend
      run: npm run type-check
      
    - name: Run database migrations
      working-directory: ./backend
      run: npm run migrate:test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/safe_pm_test
        REDIS_URL: redis://localhost:6379
        
    - name: Run unit tests
      working-directory: ./backend
      run: npm run test:coverage
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/safe_pm_test
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test-secret
        
    - name: Run integration tests
      working-directory: ./backend
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/safe_pm_test
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test-secret
        
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./backend/coverage/lcov.info
        flags: backend
        name: backend-coverage
        
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
        
    - name: Install dependencies
      working-directory: ./backend
      run: npm ci
      
    - name: Build application
      working-directory: ./backend
      run: npm run build
      
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: backend-build
        path: backend/dist/
        retention-days: 7
```

## 4. Docker Build & Push

### 4.1 Docker Build Workflow
```yaml
# .github/workflows/docker-build.yml
name: Docker Build & Push

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-frontend:
    name: Build Frontend Image
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha,prefix={{branch}}-
          
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: ./frontend
        file: ./frontend/Dockerfile
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        platforms: linux/amd64,linux/arm64
        
  build-backend:
    name: Build Backend Image
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha,prefix={{branch}}-
          
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: ./backend
        file: ./backend/Dockerfile
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        platforms: linux/amd64,linux/arm64
        
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: [build-frontend, build-backend]
    if: github.event_name == 'pull_request'
    
    steps:
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results-frontend.sarif'
        
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results-frontend.sarif'
        
    - name: Run Trivy vulnerability scanner for backend
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results-backend.sarif'
        
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results-backend.sarif'
```

## 5. Security Scanning

### 5.1 Security Scan Workflow
```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  dependency-scan:
    name: Dependency Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Run npm audit for frontend
      working-directory: ./frontend
      run: |
        npm audit --audit-level=moderate --json > frontend-audit.json || true
        
    - name: Run npm audit for backend
      working-directory: ./backend
      run: |
        npm audit --audit-level=moderate --json > backend-audit.json || true
        
    - name: Upload audit results
      uses: actions/upload-artifact@v3
      with:
        name: security-audit-results
        path: |
          frontend-audit.json
          backend-audit.json
        retention-days: 30
        
  code-scan:
    name: Code Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: javascript,typescript
        
    - name: Autobuild
      uses: github/codeql-action/autobuild@v2
      
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
      
  container-scan:
    name: Container Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Build frontend image
      run: |
        cd frontend
        docker build -t safe-pm-frontend:scan .
        
    - name: Build backend image
      run: |
        cd backend
        docker build -t safe-pm-backend:scan .
        
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'safe-pm-frontend:scan'
        format: 'table'
        exit-code: '1'
        severity: 'CRITICAL,HIGH'
        
    - name: Run Trivy vulnerability scanner for backend
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'safe-pm-backend:scan'
        format: 'table'
        exit-code: '1'
        severity: 'CRITICAL,HIGH'
```

## 6. Deployment Workflows

### 6.1 Staging Deployment
```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]
  workflow_dispatch:

env:
  STAGING_NAMESPACE: safe-pm-staging
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  deploy:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: eu-north-1
        
    - name: Update kubeconfig
      run: |
        aws eks update-kubeconfig --region eu-north-1 --name safe-pm-staging-cluster
        
    - name: Deploy to Kubernetes
      run: |
        # Update image tags in deployment files
        sed -i "s|IMAGE_TAG|${{ github.sha }}|g" k8s/staging/*.yaml
        
        # Apply Kubernetes manifests
        kubectl apply -f k8s/staging/ -n ${{ env.STAGING_NAMESPACE }}
        
        # Wait for deployment to complete
        kubectl rollout status deployment/frontend -n ${{ env.STAGING_NAMESPACE }} --timeout=300s
        kubectl rollout status deployment/backend -n ${{ env.STAGING_NAMESPACE }} --timeout=300s
        
    - name: Run smoke tests
      run: |
        # Wait for services to be ready
        kubectl wait --for=condition=ready pod -l app=frontend -n ${{ env.STAGING_NAMESPACE }} --timeout=300s
        
        # Run basic health checks
        FRONTEND_URL=$(kubectl get service frontend-service -n ${{ env.STAGING_NAMESPACE }} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
        curl -f http://$FRONTEND_URL/health || exit 1
        
    - name: Notify deployment status
      uses: 8398a7/action-slack@v3
      if: always()
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        fields: repo,message,commit,author,action,eventName,ref,workflow
```

### 6.2 Production Deployment
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  release:
    types: [ published ]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true
        default: 'latest'

env:
  PRODUCTION_NAMESPACE: safe-pm-production
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: eu-north-1
        
    - name: Update kubeconfig
      run: |
        aws eks update-kubeconfig --region eu-north-1 --name safe-pm-production-cluster
        
    - name: Create database backup
      run: |
        # Create pre-deployment backup
        kubectl exec -n ${{ env.PRODUCTION_NAMESPACE }} deployment/postgres -- pg_dump -U safe_user safe_pm > backup-$(date +%Y%m%d-%H%M%S).sql
        
    - name: Deploy to Kubernetes
      run: |
        # Update image tags in deployment files
        VERSION=${{ github.event.inputs.version || github.event.release.tag_name }}
        sed -i "s|IMAGE_TAG|$VERSION|g" k8s/production/*.yaml
        
        # Apply Kubernetes manifests
        kubectl apply -f k8s/production/ -n ${{ env.PRODUCTION_NAMESPACE }}
        
        # Wait for deployment to complete
        kubectl rollout status deployment/frontend -n ${{ env.PRODUCTION_NAMESPACE }} --timeout=600s
        kubectl rollout status deployment/backend -n ${{ env.PRODUCTION_NAMESPACE }} --timeout=600s
        
    - name: Run health checks
      run: |
        # Wait for services to be ready
        kubectl wait --for=condition=ready pod -l app=frontend -n ${{ env.PRODUCTION_NAMESPACE }} --timeout=300s
        
        # Run comprehensive health checks
        FRONTEND_URL=$(kubectl get service frontend-service -n ${{ env.PRODUCTION_NAMESPACE }} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
        
        # Health check endpoint
        curl -f http://$FRONTEND_URL/health || exit 1
        
        # API health check
        curl -f http://$FRONTEND_URL/api/health || exit 1
        
    - name: Run post-deployment tests
      run: |
        # Run critical path tests
        npm run test:critical-path -- --base-url=http://$FRONTEND_URL
        
    - name: Notify deployment status
      uses: 8398a7/action-slack@v3
      if: always()
      with:
        status: ${{ job.status }}
        channel: '#production-deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        fields: repo,message,commit,author,action,eventName,ref,workflow
        
    - name: Create deployment record
      run: |
        # Record deployment in monitoring system
        curl -X POST https://monitoring.safe-pm.com/api/deployments \
          -H "Authorization: Bearer ${{ secrets.MONITORING_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{
            "version": "${{ github.event.inputs.version || github.event.release.tag_name }}",
            "environment": "production",
            "commit": "${{ github.sha }}",
            "deployed_by": "${{ github.actor }}",
            "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
          }'
```

## 7. Dependency Management

### 7.1 Dependency Update Workflow
```yaml
# .github/workflows/dependency-update.yml
name: Dependency Updates

on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly on Monday at 9 AM
  workflow_dispatch:

jobs:
  update-dependencies:
    name: Update Dependencies
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.18.1'
        
    - name: Update frontend dependencies
      working-directory: ./frontend
      run: |
        npm update
        npm audit fix --audit-level=moderate
        
    - name: Update backend dependencies
      working-directory: ./backend
      run: |
        npm update
        npm audit fix --audit-level=moderate
        
    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v5
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        commit-message: 'chore: update dependencies'
        title: 'Automated dependency updates'
        body: |
          This PR contains automated dependency updates.
          
          ## Changes
          - Updated frontend dependencies
          - Updated backend dependencies
          - Applied security fixes
          
          ## Testing
          Please review and test the changes before merging.
        branch: dependency-updates
        delete-branch: true
```

## 8. Release Automation

### 8.1 Release Workflow
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  create-release:
    name: Create Release
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Generate changelog
      id: changelog
      run: |
        # Generate changelog from git commits
        git log --pretty=format:"- %s" $(git describe --tags --abbrev=0 HEAD^)..HEAD > CHANGELOG.md
        
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        body_path: CHANGELOG.md
        draft: false
        prerelease: false
        
  deploy-release:
    name: Deploy Release
    runs-on: ubuntu-latest
    needs: create-release
    
    steps:
    - name: Trigger production deployment
      uses: actions/github-script@v6
      with:
        script: |
          github.rest.actions.createWorkflowDispatch({
            owner: context.repo.owner,
            repo: context.repo.repo,
            workflow_id: 'deploy-production.yml',
            ref: 'main',
            inputs: {
              version: '${{ github.ref_name }}'
            }
          })
```

## 9. Notification System

### 9.1 Slack Integration
```yaml
# .github/workflows/notifications.yml
name: Notifications

on:
  workflow_run:
    workflows: ["Frontend CI", "Backend CI", "Deploy to Production"]
    types: [completed]

jobs:
  notify:
    name: Notify Status
    runs-on: ubuntu-latest
    if: always()
    
    steps:
    - name: Notify Slack
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ github.event.workflow_run.conclusion }}
        channel: '#ci-cd'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        fields: repo,message,commit,author,action,eventName,ref,workflow
        custom_payload: |
          {
            "text": "Workflow ${{ github.event.workflow_run.name }} ${{ github.event.workflow_run.conclusion }}",
            "attachments": [
              {
                "color": "${{ github.event.workflow_run.conclusion == 'success' && 'good' || 'danger' }}",
                "fields": [
                  {
                    "title": "Repository",
                    "value": "${{ github.repository }}",
                    "short": true
                  },
                  {
                    "title": "Branch",
                    "value": "${{ github.ref }}",
                    "short": true
                  },
                  {
                    "title": "Commit",
                    "value": "${{ github.sha }}",
                    "short": true
                  },
                  {
                    "title": "Author",
                    "value": "${{ github.actor }}",
                    "short": true
                  }
                ]
              }
            ]
          }
```

## 10. Workflow Configuration

### 10.1 GitHub Repository Settings
```yaml
# .github/settings.yml
name: Repository Settings

on:
  repository_dispatch:
    types: [update-settings]

jobs:
  update-settings:
    name: Update Repository Settings
    runs-on: ubuntu-latest
    
    steps:
    - name: Update branch protection
      uses: actions/github-script@v6
      with:
        script: |
          github.rest.repos.updateBranchProtection({
            owner: context.repo.owner,
            repo: context.repo.repo,
            branch: 'main',
            required_status_checks: {
              strict: true,
              contexts: [
                'Frontend CI',
                'Backend CI',
                'Security Scan',
                'Docker Build & Push'
              ]
            },
            enforce_admins: true,
            required_pull_request_reviews: {
              required_approving_review_count: 2,
              dismiss_stale_reviews: true,
              require_code_owner_reviews: true
            },
            restrictions: null
          })
```

## 11. Environment Variables

### 11.1 Required Secrets
```bash
# GitHub Secrets Configuration
GITHUB_TOKEN=your-github-token-here
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SLACK_WEBHOOK=your-slack-webhook-url
MONITORING_TOKEN=your-monitoring-token
STAGING_API_URL=https://api-staging.safe-pm.com
PRODUCTION_API_URL=https://api.safe-pm.com
```

## 12. Performance Optimization

### 12.1 Caching Strategy
```yaml
# Cache configuration for all workflows
- name: Cache Node modules
  uses: actions/cache@v3
  with:
    path: |
      frontend/node_modules
      backend/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Cache Docker layers
  uses: actions/cache@v3
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
```

---

**Dokumentversion:** 1.0  
**Senast uppdaterad:** 2024-12-19  
**Författare:** DevOps Team  
**Godkänd av:** Tech Lead
