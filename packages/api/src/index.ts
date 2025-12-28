import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { resolve } from 'path';
import swaggerUi from 'swagger-ui-express';
import { prisma } from '@repo/db';
import { authRouter } from './routes/auth.js';
import { coursesRouter } from './routes/courses.js';
import { usersRouter } from './routes/users.js';
import { enrollmentsRouter } from './routes/enrollments.js';
import { teachersRouter } from './routes/teachers.js';
import { instructorRouter } from './routes/instructor.js';
import { studentsRouter } from './routes/students.js';
import { webinarsRouter } from './routes/webinars.js';
import { publicRouter } from './routes/public.js';
import analyticsRouter from './routes/analytics.js';
import { categoryRouter } from './routes/categories.js';
import paymentRouter from './routes/payment.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { swaggerSpec } from './config/swagger.js';
import { bootstrapAdmins } from './config/bootstrap-admins.js';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4000', // Allow Swagger UI on same origin
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) return callback(null, true);

      // In development, allow all localhost origins
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

// Health check routes
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Skill Up API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'success',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

// Swagger API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'SkillUp API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

// API Routes
app.use('/api/public', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/students', studentsRouter);
app.use('/api/webinars', webinarsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/instructor', instructorRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/payment', paymentRouter);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Skill Up API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);

  await bootstrapAdmins();
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} signal received: closing HTTP server`);
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
    console.log('Database connection closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { app };
