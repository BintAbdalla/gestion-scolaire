import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import { env } from './config/environment';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet({
      contentSecurityPolicy: false, // Permet Swagger UI
    }));
    
    this.app.use(cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Maximum 100 requêtes par fenêtre par IP
      message: {
        success: false,
        error: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
      },
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Health check endpoint (avant les autres routes)
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Bienvenue sur l\'API Kaayjang - Système de Gestion Scolaire',
        version: '1.0.0',
        documentation: '/api-docs',
        health: '/api/health',
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api', routes);
  }

  private initializeSwagger(): void {
    // Configuration Swagger UI
    const swaggerOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Kaayjang - Documentation',
      customfavIcon: '/favicon.ico',
    };

    this.app.use('/api-docs', swaggerUi.serve);
    this.app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerOptions));

    // Endpoint pour récupérer le spec JSON
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(env.PORT, () => {
      console.log(`🚀 Serveur Kaayjang démarré sur le port ${env.PORT}`);
      console.log(`📚 Documentation API: http://localhost:${env.PORT}/api-docs`);
      console.log(`💚 Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`🌍 Environnement: ${env.NODE_ENV}`);
    });
  }
}

export default App; 