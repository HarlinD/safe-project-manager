import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3015",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3016;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    uptime: process.uptime()
  });
});

// Import routes
import dashboardRoutes from './routes/dashboard';

// API routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SAFe Project Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Join organization room
  socket.on('join-organization', (orgId) => {
    socket.join(`org-${orgId}`);
    console.log(`Client ${socket.id} joined organization ${orgId}`);
  });
  
  // Leave organization room
  socket.on('leave-organization', (orgId) => {
    socket.leave(`org-${orgId}`);
    console.log(`Client ${socket.id} left organization ${orgId}`);
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 SAFe Project Manager API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket server ready`);
});

export { app, io };
