import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { corsOptionsDelegate } from './app/middleware/cors';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { trackPageView } from './app/middleware/fbConversionTracker';
import routes from './app/routes';

const app: Application = express();
const bodyLimit = process.env.REQUEST_BODY_LIMIT || '10mb';
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 600);

// Trust proxy for getting real IP addresses through nginx
app.set('trust proxy', true);

// Basic security hardening headers
app.use(
   helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
   })
);

// Gzip/deflate response compression for faster API responses
app.use(compression());

// Enable CORS
app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate));

// Global API rate limiter (protects against abuse and spikes)
const apiLimiter = rateLimit({
   windowMs: rateLimitWindowMs,
   max: rateLimitMax,
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      success: false,
      message: 'Too many requests. Please try again after a few minutes.',
   },
});
app.use('/api', apiLimiter);

// Parse cookies and JSON body
app.use(cookieParser());
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit, parameterLimit: 5000 }));

// Track page views with Facebook Conversion API
app.use(trackPageView);

// Serve uploaded files from /tmp via /server-tmp
app.use(
   '/server-tmp',
   express.static(path.join('/tmp'), {
      setHeaders: res => {
         res.setHeader('Access-Control-Allow-Origin', '*');
         res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      },
   })
);

// application routes
app.get('/', (req: Request, res: Response) => {
   res.send('Server is running');
});

// Health check endpoint for nginx
app.get('/health', (req: Request, res: Response) => {
   res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
   });
});

// use routes
app.use('/api/v1', routes);

// globalErrorHandler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Not Found',
      errorMessages: [
         {
            path: req.originalUrl,
            message: 'API Not Found',
         },
      ],
   });
   next();
});

export default app;
