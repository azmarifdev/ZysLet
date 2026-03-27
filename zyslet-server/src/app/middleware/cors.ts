import { Request } from 'express';
import { CorsOptions } from 'cors';
import config from '../../config';

const defaultOrigins = [
   'http://localhost:3000',
   'http://localhost:3001',
   'http://localhost:4000',
   'http://localhost:5000',
   'https://admin.zyslet.com',
   'https://zyslet.com',
   'https://server.zyslet.com',
   'https://zyslet-server.onrender.com',
];

const envOrigins = [config.client_url, config.admin_url, config.api_url].filter(
   Boolean
) as string[];

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, '');

const allowedOrigins = new Set(
   [...defaultOrigins, ...envOrigins]
      .filter(Boolean)
      .map(origin => normalizeOrigin(origin))
);

const envCorsOrigins =
   process.env.CORS_ORIGIN?.split(',')
      .map(origin => normalizeOrigin(origin))
      .filter(Boolean) || [];

envCorsOrigins.forEach(origin => allowedOrigins.add(origin));

const isVercelPreviewOrigin = (origin: string) =>
   /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

export const corsOptionsDelegate = function (
   req: Request,
   callback: (err: Error | null, options?: CorsOptions) => void
) {
   const origin = req.header('Origin');
   let corsOptions: CorsOptions;

   // Allow requests without origin (like mobile apps, Postman, etc.)
   if (!origin) {
      corsOptions = {
         origin: true,
         credentials: true,
         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
         allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
         ],
         exposedHeaders: ['Content-Disposition'],
         maxAge: 86400,
      };
   } else if (
      allowedOrigins.has(normalizeOrigin(origin)) ||
      isVercelPreviewOrigin(origin)
   ) {
      corsOptions = {
         origin,
         credentials: true,
         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
         allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
         ],
         exposedHeaders: ['Content-Disposition'],
         maxAge: 86400,
      };
   } else {
      corsOptions = { origin: false, credentials: false };
   }

   callback(null, corsOptions);
};
