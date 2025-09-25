# React Applikationsstruktur och Docker Setup

## 1. Projektstruktur

### 1.1 Mappstruktur
```
safe-project-manager/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── PortfolioDashboard.tsx
│   │   │   │   ├── ReleaseTrainDashboard.tsx
│   │   │   │   └── MetricsWidget.tsx
│   │   │   ├── pi-planning/
│   │   │   │   ├── PIPlanningBoard.tsx
│   │   │   │   ├── TeamCapacity.tsx
│   │   │   │   └── PIObjectives.tsx
│   │   │   ├── backlog/
│   │   │   │   ├── BacklogHierarchy.tsx
│   │   │   │   ├── WSJFCalculator.tsx
│   │   │   │   └── DependencyMap.tsx
│   │   │   ├── risks/
│   │   │   │   ├── RiskRegister.tsx
│   │   │   │   ├── ImpedimentTracker.tsx
│   │   │   │   └── RiskMatrix.tsx
│   │   │   └── reports/
│   │   │       ├── ReportBuilder.tsx
│   │   │       ├── MetricsChart.tsx
│   │   │       └── TeamHealth.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PIPlanning.tsx
│   │   │   ├── Backlog.tsx
│   │   │   ├── Risks.tsx
│   │   │   └── Reports.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useData.ts
│   │   │   └── useWebSocket.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── websocket.ts
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── project.ts
│   │   │   └── safe.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── validators.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── components.css
│   │   │   └── themes.css
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── setupTests.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

## 2. Docker Konfiguration

### 2.1 Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:20.18.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2.2 Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:20.18.1-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3016

# Start the application
CMD ["npm", "start"]
```

### 2.3 Docker Compose (Production)
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3015:80"
    environment:
      - REACT_APP_API_URL=http://backend:3016
      - REACT_APP_WS_URL=ws://backend:3016
    depends_on:
      - backend
    networks:
      - safe-network

  backend:
    build: ./backend
    ports:
      - "3016:3016"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://safe_user:safe_password@db:5447/safe_pm
      - REDIS_URL=redis://redis:6380
      - JWT_SECRET=your-jwt-secret-here
    depends_on:
      - db
      - redis
    networks:
      - safe-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=safe_pm
      - POSTGRES_USER=safe_user
      - POSTGRES_PASSWORD=safe_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5447:5432"
    networks:
      - safe-network

  redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"
    volumes:
      - redis_data:/data
    networks:
      - safe-network

volumes:
  postgres_data:
  redis_data:

networks:
  safe-network:
    driver: bridge
```

### 2.4 Docker Compose (Development)
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend-dev:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3015:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://backend-dev:3016
      - REACT_APP_WS_URL=ws://backend-dev:3016
    depends_on:
      - backend-dev
    networks:
      - safe-dev-network

  backend-dev:
    image: node:20.18.1-alpine
    working_dir: /app
    ports:
      - "3016:3016"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://safe_user:safe_password@db-dev:5448/safe_pm_dev
      - REDIS_URL=redis://redis-dev:6381
    depends_on:
      - db-dev
      - redis-dev
    networks:
      - safe-dev-network

  db-dev:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=safe_pm_dev
      - POSTGRES_USER=safe_user
      - POSTGRES_PASSWORD=safe_password
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5448:5432"
    networks:
      - safe-dev-network

  redis-dev:
    image: redis:7-alpine
    ports:
      - "6381:6379"
    volumes:
      - redis_dev_data:/data
    networks:
      - safe-dev-network

volumes:
  postgres_dev_data:
  redis_dev_data:

networks:
  safe-dev-network:
    driver: bridge
```

## 3. React Komponenter

### 3.1 Huvudapplikation (App.tsx)
```tsx
// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { WebSocketProvider } from './hooks/useWebSocket';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import PIPlanning from './pages/PIPlanning';
import Backlog from './pages/Backlog';
import Risks from './pages/Risks';
import Reports from './pages/Reports';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pi-planning" element={<PIPlanning />} />
              <Route path="/backlog" element={<Backlog />} />
              <Route path="/risks" element={<Risks />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Layout>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
```

### 3.2 Layout Komponent
```tsx
// frontend/src/components/common/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
```

### 3.3 Header Komponent
```tsx
// frontend/src/components/common/Header.tsx
import React from 'react';
import { Bell, Mail, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">
              🏢 SAFe Project Manager
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Mail className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                David (Portföljansvarig)
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 3.4 Sidebar Navigation
```tsx
// frontend/src/components/common/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Train, 
  ClipboardList, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Settings 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigationItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/release-train', icon: Train, label: 'Release Train' },
    { path: '/pi-planning', icon: ClipboardList, label: 'PI Planning' },
    { path: '/backlog', icon: FileText, label: 'Backlog' },
    { path: '/sprint-planning', icon: FileText, label: 'Sprint Planning' },
    { path: '/risks', icon: AlertTriangle, label: 'Risks' },
    { path: '/metrics', icon: TrendingUp, label: 'Metrics' },
    { path: '/stakeholders', icon: Users, label: 'Stakeholders' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
```

### 3.5 Portfolio Dashboard
```tsx
// frontend/src/components/dashboard/PortfolioDashboard.tsx
import React from 'react';
import { TrendingUp, AlertTriangle, Users, Activity } from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

const PortfolioDashboard: React.FC = () => {
  const metrics: DashboardMetric[] = [
    {
      title: 'Active Release Trains',
      value: 5,
      change: '+2 this month',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Total Projects',
      value: 23,
      change: '+3 this month',
      trend: 'up',
      icon: Activity,
    },
    {
      title: 'Critical Risks',
      value: 3,
      change: 'Needs attention',
      trend: 'neutral',
      icon: AlertTriangle,
    },
    {
      title: 'Team Health Score',
      value: '8.2/10',
      change: '+0.3 this week',
      trend: 'up',
      icon: Users,
    },
  ];

  const releaseTrains = [
    { name: 'RT-1 E-commerce', status: 'on-track', progress: 85, velocity: 42 },
    { name: 'RT-2 Mobile App', status: 'at-risk', progress: 72, velocity: 38 },
    { name: 'RT-3 Data Platform', status: 'on-track', progress: 91, velocity: 45 },
    { name: 'RT-4 Analytics', status: 'delayed', progress: 45, velocity: 28 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-50';
      case 'at-risk': return 'text-yellow-600 bg-yellow-50';
      case 'delayed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
        <span className="text-sm text-gray-500">Last updated: 14:32</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </p>
              </div>
              <metric.icon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Release Train Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Release Train Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {releaseTrains.map((train) => (
              <div key={train.name} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">{train.name}</h3>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(train.status)}`}>
                    {train.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{train.progress}%</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${train.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Velocity: {train.velocity} SP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity & Alerts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">14:15 - RT-4: Critical risk identified - Resource shortage</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">13:45 - RT-2: Sprint 3 completed with 2 story points remaining</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">13:20 - RT-1: PI Planning session scheduled for next Monday</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">12:30 - RT-3: Feature "User Authentication" completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
```

### 3.6 PI Planning Board
```tsx
// frontend/src/components/pi-planning/PIPlanningBoard.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Feature {
  id: string;
  name: string;
  wsjf: number;
  size: number;
  team?: string;
}

interface Team {
  id: string;
  name: string;
  capacity: number;
  features: Feature[];
}

const PIPlanningBoard: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([
    { id: '1', name: 'Enhanced Search', wsjf: 8.5, size: 13 },
    { id: '2', name: 'Mobile Optimization', wsjf: 7.2, size: 21 },
    { id: '3', name: 'Database Optimization', wsjf: 9.1, size: 8 },
    { id: '4', name: 'Caching Implementation', wsjf: 6.8, size: 5 },
  ]);

  const [teams, setTeams] = useState<Team[]>([
    { id: 'frontend', name: 'Frontend Team', capacity: 44, features: [] },
    { id: 'backend', name: 'Backend Team', capacity: 36, features: [] },
    { id: 'devops', name: 'DevOps Team', capacity: 27, features: [] },
    { id: 'qa', name: 'QA Team', capacity: 36, features: [] },
  ]);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === 'features' && destination.droppableId !== 'features') {
      // Moving from features to team
      const feature = features.find(f => f.id === draggableId);
      if (!feature) return;

      const newTeams = teams.map(team => {
        if (team.id === destination.droppableId) {
          const newFeatures = [...team.features, { ...feature, team: team.id }];
          return { ...team, features: newFeatures };
        }
        return team;
      });

      setTeams(newTeams);
      setFeatures(features.filter(f => f.id !== draggableId));
    }
  };

  const getRemainingCapacity = (team: Team) => {
    const usedCapacity = team.features.reduce((sum, feature) => sum + feature.size, 0);
    return team.capacity - usedCapacity;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">PI Planning Board</h1>
        <span className="text-sm text-gray-500">Drag & Drop Features to Teams</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Features Backlog */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Features Backlog</h2>
          </div>
          <div className="p-6">
            <Droppable droppableId="features" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex space-x-4"
                >
                  {features.map((feature, index) => (
                    <Draggable key={feature.id} draggableId={feature.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-w-[200px] cursor-move"
                        >
                          <h3 className="font-medium text-blue-900">{feature.name}</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <div>WSJF: {feature.wsjf}</div>
                            <div>Size: {feature.size} SP</div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        {/* Team Allocation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Team Allocation</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map((team) => (
                <Droppable key={team.id} droppableId={team.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px]"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">{team.name}</h3>
                      <div className="text-sm text-gray-600 mb-4">
                        Capacity: {team.capacity} SP
                      </div>
                      
                      <div className="space-y-2">
                        {team.features.map((feature, index) => (
                          <div key={feature.id} className="bg-white border border-gray-200 rounded p-2">
                            <div className="font-medium text-gray-900">{feature.name}</div>
                            <div className="text-sm text-gray-600">{feature.size} SP</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-600">
                        Remaining: {getRemainingCapacity(team)} SP
                      </div>
                      
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default PIPlanningBoard;
```

## 4. Package.json och Dependencies

### 4.1 Frontend Package.json
```json
{
  "name": "safe-project-manager-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-beautiful-dnd": "^13.1.1",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.2.7",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.21",
    "axios": "^1.3.4",
    "socket.io-client": "^4.6.1",
    "recharts": "^2.5.0",
    "react-hook-form": "^7.43.5",
    "react-query": "^3.39.3",
    "date-fns": "^2.29.3",
    "clsx": "^1.2.1"
  },
  "devDependencies": {
    "@types/react-beautiful-dnd": "^13.1.4",
    "typescript": "^5.0.0",
    "react-scripts": "5.0.1",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "eslint": "^8.35.0",
    "prettier": "^2.8.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css}"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### 4.2 Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safe: {
          blue: '#0066CC',
          green: '#28A745',
          orange: '#FFC107',
          red: '#DC3545',
          cyan: '#17A2B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

## 5. TypeScript Types

### 5.1 User Types
```typescript
// frontend/src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: Date;
}

export enum UserRole {
  PORTFOLIO_MANAGER = 'portfolio_manager',
  RELEASE_TRAIN_ENGINEER = 'release_train_engineer',
  PRODUCT_OWNER = 'product_owner',
  SCRUM_MASTER = 'scrum_master',
  PROJECT_MANAGER = 'project_manager',
  TEAM_MEMBER = 'team_member',
}

export interface Team {
  id: string;
  name: string;
  members: User[];
  capacity: number;
  velocity: number;
  healthScore: number;
}
```

### 5.2 SAFe Types
```typescript
// frontend/src/types/safe.ts
export interface ReleaseTrain {
  id: string;
  name: string;
  description: string;
  teams: Team[];
  currentPI: ProgramIncrement;
  status: ReleaseTrainStatus;
  velocity: number;
  healthScore: number;
}

export interface ProgramIncrement {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  objectives: PIObjective[];
  features: Feature[];
  risks: Risk[];
  status: PIStatus;
}

export interface PIObjective {
  id: string;
  title: string;
  description: string;
  features: Feature[];
  progress: number;
  status: ObjectiveStatus;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  epic: Epic;
  userStories: UserStory[];
  wsjf: number;
  size: number;
  team?: Team;
  status: FeatureStatus;
  dependencies: Feature[];
}

export interface Epic {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  businessValue: number;
  status: EpicStatus;
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  feature: Feature;
  status: StoryStatus;
  assignee?: User;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
  owner: User;
  mitigation: string;
  status: RiskStatus;
  dueDate: Date;
  progress: number;
}

export interface Impediment {
  id: string;
  title: string;
  description: string;
  severity: ImpedimentSeverity;
  reporter: User;
  owner: User;
  status: ImpedimentStatus;
  impact: string;
  resolution: string;
  reportedDate: Date;
  assignedDate: Date;
  resolvedDate?: Date;
  eta?: Date;
}

export enum ReleaseTrainStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
}

export enum PIStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum FeatureStatus {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RiskCategory {
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  EXTERNAL = 'external',
  RESOURCE = 'resource',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ImpedimentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
```

## 6. Utvecklingskommandon

### 6.1 Starta utvecklingsmiljö
```bash
# Klona repository
git clone <repository-url>
cd safe-project-manager

# Starta utvecklingsmiljö med Docker Compose
docker-compose -f docker-compose.dev.yml up --build

# Eller starta lokalt
cd frontend
npm install
npm start

cd ../backend
npm install
npm run dev
```

### 6.2 Bygga för produktion
```bash
# Bygga och starta produktionsmiljö
docker-compose up --build

# Eller bygga lokalt
cd frontend
npm run build

cd ../backend
npm run build
```

### 6.3 Testning
```bash
# Frontend tester
cd frontend
npm test

# Backend tester
cd backend
npm test

# E2E tester
npm run test:e2e
```

---

**Dokumentversion:** 1.0  
**Senast uppdaterad:** 2024-12-19  
**Författare:** Development Team  
**Godkänd av:** Tech Lead
