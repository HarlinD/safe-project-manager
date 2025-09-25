# SAFe Project Manager

En omfattande projektledningsapplikation som stödjer portföljansvariga, projektledare, Release Train Engineers (RTE), Product Owners och Scrum Masters i deras dagliga arbete enligt SAFe-ramverkets principer och metoder.

## 🚀 Snabb Start

### Med Docker Compose (Rekommenderat)

```bash
# Klona repository
git clone <repository-url>
cd safe-project-manager

# Starta utvecklingsmiljö
docker-compose -f docker-compose.dev.yml up --build

# Eller starta produktionsmiljö
docker-compose up --build
```

### Lokal utveckling

```bash
# Frontend
cd frontend
npm install
npm start

# Backend (i ny terminal)
cd backend
npm install
npm run dev
```

## 📱 Applikation

- **Frontend**: http://localhost:3015
- **Backend API**: http://localhost:3016
- **Health Check**: http://localhost:3016/health

## 🏗️ Arkitektur

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js 20 + Express.js + TypeScript
- **Database**: PostgreSQL 15 + Redis 7
- **Containerization**: Docker + Docker Compose

## 📋 Funktioner

- ✅ Portfolio Dashboard
- ✅ Release Train Management
- ✅ PI Planning (kommer snart)
- ✅ Backlog Management (kommer snart)
- ✅ Risk & Impediment Management (kommer snart)
- ✅ Metrics & Reporting (kommer snart)

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
npm run dev        # Starta utvecklingsserver
npm run build      # Bygg TypeScript
npm start          # Starta produktionsserver
npm test           # Kör tester
npm run lint       # Kör ESLint
```

## 📚 Dokumentation

- [Produktkravsdokument (PRD)](./PRD_Projektledningsapp_SAFe.md)
- [Wireframes och Mockups](./Wireframes_SAFe_ProjectManager.md)
- [Teknisk Arkitektur](./Technical_Architecture_Documentation.md)
- [React App Struktur](./React_App_Structure_Docker.md)
- [CI/CD Pipelines](./GitHub_Actions_CI_CD.md)

## 🛠️ Teknisk Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide React (ikoner)
- React Beautiful DnD

### Backend
- Node.js 20
- Express.js
- TypeScript
- PostgreSQL
- Redis
- Socket.io
- JWT Authentication

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Kubernetes (kommande)

## 📊 Portar

| Tjänst | Port | Beskrivning |
|--------|------|-------------|
| Frontend | 3015 | React utvecklingsserver |
| Backend | 3016 | Express.js API |
| PostgreSQL | 5447/5448 | Databas (prod/dev) |
| Redis | 6380/6381 | Cache (prod/dev) |

## 🔒 Säkerhet

- JWT Token Authentication
- CORS konfiguration
- Helmet.js säkerhetsheaders
- Input validation
- SQL injection protection

## 📈 Monitoring

- Health check endpoints
- Request logging med Morgan
- Error handling middleware
- WebSocket real-time communication

## 🤝 Bidrag

1. Fork repository
2. Skapa feature branch (`git checkout -b feature/amazing-feature`)
3. Commit ändringar (`git commit -m 'Add amazing feature'`)
4. Push till branch (`git push origin feature/amazing-feature`)
5. Öppna Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 👥 Team

- **Produktchef**: David (Portföljansvarig)
- **Tech Lead**: Development Team
- **UX/UI Team**: Wireframes och Design
- **DevOps Team**: CI/CD och Infrastructure

---

**Version**: 1.0.0  
**Senast uppdaterad**: 2024-12-19
