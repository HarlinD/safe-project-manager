# SAFe Project Manager

En omfattande projektledningsapplikation som stödjer portföljansvariga, projektledare, Release Train Engineers (RTE), Product Owners och Scrum Masters i deras dagliga arbete enligt SAFe-ramverkets principer och metoder.

[![GitHub Actions](https://github.com/HarlinD/safe-project-manager/workflows/CI/badge.svg)](https://github.com/HarlinD/safe-project-manager/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)

## 🚀 Snabb Start

### Förutsättningar

- **Node.js** 20.18.1 eller senare
- **npm** 9.0.0 eller senare
- **Docker** och **Docker Compose** (för databas)
- **Git**

### Med Docker Compose (Rekommenderat)

```bash
# Klona repository
git clone https://github.com/HarlinD/safe-project-manager.git
cd safe-project-manager

# Starta databas och cache
docker-compose -f docker-compose.dev.yml up -d db-dev redis-dev

# Vänta 10 sekunder för att databasen ska starta
sleep 10

# Kör databas-setup
chmod +x scripts/database-setup.sh
./scripts/database-setup.sh

# Starta utvecklingsmiljö
docker-compose -f docker-compose.dev.yml up --build
```

### Lokal utveckling

```bash
# 1. Starta databas och cache
docker-compose -f docker-compose.dev.yml up -d db-dev redis-dev

# 2. Vänta och kör databas-setup
sleep 10
cd backend
npx knex migrate:latest
npx knex seed:run

# 3. Starta backend (i en terminal)
cd backend
npm install
npm run dev

# 4. Starta frontend (i en annan terminal)
cd frontend
npm install
npm start
```

## 📱 Applikation

- **Frontend**: http://localhost:3000 (utveckling) / http://localhost:3015 (Docker)
- **Backend API**: http://localhost:3016
- **Health Check**: http://localhost:3016/health
- **Database**: PostgreSQL på port 5448 (utveckling) / 5447 (produktion)
- **Cache**: Redis på port 6381 (utveckling) / 6380 (produktion)

## 🏗️ Arkitektur

### Frontend
- **React 18** med TypeScript
- **Tailwind CSS** för styling
- **React Router** för navigation
- **Lucide React** för ikoner
- **Recharts** för datavisualisering
- **Socket.io Client** för real-time updates

### Backend
- **Node.js 20.18.1** med TypeScript
- **Express.js** för API
- **PostgreSQL 15** för datalagring
- **Redis 7** för caching
- **Socket.io** för WebSocket-kommunikation
- **Knex.js** för databas-migrationer

### DevOps
- **Docker** och **Docker Compose** för containerisering
- **GitHub Actions** för CI/CD
- **Multi-arch builds** för olika plattformar

## 📋 Funktioner

### ✅ Implementerade Funktioner
- **Portfolio Dashboard** - Översikt över alla Release Trains
- **Release Train Management** - Hantera RT:er och deras status
- **Real-time Metrics** - Live dashboard med auto-refresh
- **Risk Management** - Riskregistrering och spårning
- **Team Health Tracking** - Team-mätningar och hälsa
- **Database Schema** - Komplett SAFe-datamodell
- **API Endpoints** - RESTful API för alla funktioner

### 🚧 Kommande Funktioner
- **PI Planning** - Program Increment-planering
- **Backlog Management** - Feature och User Story-hantering
- **Authentication** - Användarautentisering och behörigheter
- **Advanced Reporting** - Detaljerade rapporter och export
- **Mobile App** - React Native-applikation
- **Integration APIs** - Anslutning till externa system

## 🗄️ Databas

### Schema
Applikationen använder en omfattande PostgreSQL-databas med följande huvudtabeller:

- **organizations** - Företag och portföljer
- **users** - Användare med roller
- **release_trains** - Release Trains med status och budget
- **teams** - Scrum Teams inom Release Trains
- **features** - Features med WSJF-prioritering
- **risks** - Risker med automatisk risk-score
- **activity_logs** - Aktivitetsloggar för spårning

### Migrationer och Seeds
```bash
# Kör migrationer
npx knex migrate:latest

# Lägg till testdata
npx knex seed:run

# Återställ databas
npx knex migrate:rollback --all
npx knex migrate:latest
npx knex seed:run
```

## 🔧 Utveckling

### Frontend Scripts
```bash
npm start          # Starta utvecklingsserver
npm run build      # Bygg för produktion
npm test           # Kör tester
npm run lint       # Kör ESLint
npm run format     # Formatera kod med Prettier
```

### Backend Scripts
```bash
npm run dev        # Starta utvecklingsserver med nodemon
npm run build      # Bygg TypeScript
npm start          # Starta produktionsserver
npm test           # Kör tester
npm run lint       # Kör ESLint
```

## 🔌 API Dokumentation

### Dashboard Endpoints

```bash
# Hämta dashboard metrics
GET /api/dashboard/metrics?organizationId={uuid}&timeRange=7d

# Hämta Release Trains
GET /api/dashboard/release-trains

# Hämta aktiviteter
GET /api/dashboard/activities

# Hämta velocity chart data
GET /api/dashboard/charts/velocity?timeRange=7d

# Hämta team health data
GET /api/dashboard/charts/team-health

# Hämta risk distribution
GET /api/dashboard/charts/risk-distribution

# Uppdatera dashboard
POST /api/dashboard/refresh
```

### Exempel API-anrop

```bash
# Testa health check
curl http://localhost:3016/health

# Hämta metrics för standard-organisation
curl "http://localhost:3016/api/dashboard/metrics?organizationId=550e8400-e29b-41d4-a716-446655440020"

# Hämta Release Trains
curl http://localhost:3016/api/dashboard/release-trains
```

## 🐛 Troubleshooting

### Vanliga Problem

#### Port redan används
```bash
# Hitta process som använder port 3016
lsof -ti:3016

# Döda processen
kill $(lsof -ti:3016)

# Eller för port 3000
kill $(lsof -ti:3000)
```

#### Databas-anslutning misslyckas
```bash
# Kontrollera att PostgreSQL körs
docker-compose -f docker-compose.dev.yml ps db-dev

# Starta om databasen
docker-compose -f docker-compose.dev.yml restart db-dev

# Kontrollera loggar
docker-compose -f docker-compose.dev.yml logs db-dev
```

#### Frontend kan inte ansluta till backend
```bash
# Kontrollera att backend körs
curl http://localhost:3016/health

# Kontrollera miljövariabler
echo $REACT_APP_API_URL

# Starta om frontend
cd frontend && npm start
```

#### Migrationer misslyckas
```bash
# Återställ alla migrationer
cd backend
npx knex migrate:rollback --all

# Kör migrationer igen
npx knex migrate:latest

# Lägg till seeds
npx knex seed:run
```

### Loggar och Debugging

```bash
# Backend loggar
cd backend && npm run dev

# Frontend loggar
cd frontend && npm start

# Docker loggar
docker-compose -f docker-compose.dev.yml logs -f

# Specifika tjänster
docker-compose -f docker-compose.dev.yml logs -f backend-dev
docker-compose -f docker-compose.dev.yml logs -f db-dev
```

## 📚 Dokumentation

- [Produktkravsdokument (PRD)](./PRD_Projektledningsapp_SAFe.md) - Detaljerade krav och användarscenarier
- [Wireframes och Mockups](./Wireframes_SAFe_ProjectManager.md) - UI/UX design och layout
- [Teknisk Arkitektur](./Technical_Architecture_Documentation.md) - Systemarkitektur och design
- [React App Struktur](./React_App_Structure_Docker.md) - Frontend struktur och Docker-konfiguration
- [CI/CD Pipelines](./GitHub_Actions_CI_CD.md) - Automatiserad utveckling och deployment
- [Backup & Disaster Recovery](./Backup_Disaster_Recovery.md) - Säkerhetskopiering och återställning

## 🛠️ Teknisk Stack

### Frontend
- **React 18.2.0** - Moderna React hooks och funktioner
- **TypeScript 4.9.5** - Typ-säker utveckling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Klient-side routing
- **Lucide React** - Moderna ikoner
- **Recharts** - Datavisualisering och grafer
- **Socket.io Client** - Real-time kommunikation

### Backend
- **Node.js 20.18.1** - Senaste LTS-version
- **Express.js** - Web framework
- **TypeScript** - Typ-säker backend-utveckling
- **PostgreSQL 15** - Relationsdatabas
- **Redis 7** - In-memory cache och session store
- **Socket.io** - WebSocket-server
- **Knex.js** - SQL query builder och migrationer

### DevOps & Infrastructure
- **Docker** - Containerisering
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipelines
- **Multi-arch builds** - Support för ARM64 och AMD64
- **Kubernetes** - Container orchestration (planerat)

## 📊 Portar och Miljöer

| Tjänst | Utveckling | Produktion | Beskrivning |
|--------|------------|------------|-------------|
| Frontend | 3000 | 3015 | React utvecklingsserver |
| Backend | 3016 | 3016 | Express.js API |
| PostgreSQL | 5448 | 5447 | Databas |
| Redis | 6381 | 6380 | Cache och sessioner |

## 🔒 Säkerhet

- **JWT Authentication** - Token-baserad autentisering (planerat)
- **CORS Configuration** - Cross-origin resource sharing
- **Helmet.js** - Säkerhetsheaders
- **Input Validation** - Datavalidering och sanitering
- **SQL Injection Protection** - Parameteriserade queries med Knex.js
- **Rate Limiting** - API rate limiting (planerat)

## 📈 Monitoring & Observability

- **Health Check Endpoints** - `/health` för alla tjänster
- **Request Logging** - Morgan middleware för HTTP-loggar
- **Error Handling** - Centraliserad felhantering
- **WebSocket Monitoring** - Real-time anslutningsstatus
- **Database Metrics** - Knex.js query logging
- **Redis Monitoring** - Cache-hit rates och prestanda

## 🚀 Deployment

### Utveckling
```bash
# Lokal utveckling med Docker
docker-compose -f docker-compose.dev.yml up --build

# Lokal utveckling utan Docker
npm run dev  # Backend
npm start    # Frontend
```

### Produktion
```bash
# Docker Compose deployment
docker-compose up --build -d

# Kubernetes deployment (kommande)
kubectl apply -f k8s/
```

## 🤝 Bidrag

1. **Fork** repository
2. **Skapa feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit ändringar**: `git commit -m 'Add amazing feature'`
4. **Push till branch**: `git push origin feature/amazing-feature`
5. **Öppna Pull Request**

### Utvecklingsregler
- Använd TypeScript för all ny kod
- Följ ESLint och Prettier-konfigurationer
- Skriv tester för nya funktioner
- Uppdatera dokumentation vid behov
- Följ conventional commits för commit-meddelanden

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 👥 Team & Roller

- **Portföljansvarig**: David (50 år) - Strategisk övergripande ansvar
- **Release Train Engineer**: Projektledare för Release Trains
- **Product Owner**: Produktansvarig för features och user stories
- **Scrum Master**: Team-coach och processansvarig
- **Development Team**: Fullstack-utvecklare

## 📞 Support

- **GitHub Issues** - Buggar och feature requests
- **Discussions** - Allmänna frågor och diskussioner
- **Wiki** - Detaljerad dokumentation (kommande)

---

**Version**: 1.0.0  
**Senast uppdaterad**: 2025-01-25  
**Node.js**: 20.18.1  
**React**: 18.2.0  
**TypeScript**: 4.9.5
