import express from 'express';
import { Request, Response, NextFunction} from 'express'
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupSessionMiddleware } from './middlewares/session-middleware';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/error-middleware';

// load .env variabales
dotenv.config();
require('dotenv').config()

const PORT = process.env.PORT || 3500
const app = express();


async function startServer() {
    // Security Middleware
    app.use(helmet());

    // CORS Configration
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Session Middleware
    setupSessionMiddleware(app);

    // API loging middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);

        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.path} ${req.statusCode} - ${duration}ms`);
        });
        next();
    });

    // Health Check endpoint
    app.get('/health', (req: Request, res: Response) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
        });
    });

    // Register API Route
    await registerRoutes(app);

    // Error handling middleware
    app.use(errorHandler);

    // 404 Handler
    app.get('/*', (req: Request, res: Response) => {
        res.status(404).json({
            message: 'Route Not Found',
            path: req.originalUrl
        });
    });

    app.listen(PORT, () => {
        console.log(`Server Running On Port ${PORT}`);
        console.log(`Environment ${process.env.NODE_ENV}`);
        console.log(`Health Check http://localhost:${PORT}/health`)
    })
}

startServer()

export default app;