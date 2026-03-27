import { NextFunction, Request, Response } from 'express';
import FacebookConversionApi from '../../helpers/fbConversionApi';
import config from '../../config';

/**
 * Middleware to track page views using Facebook Conversion API
 * This can be applied to specific routes or globally
 */
export const trackPageView = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   // Skip for non-GET requests or API endpoints that shouldn't be tracked as page views
   if (req.method !== 'GET' || req.originalUrl.startsWith('/api/') || req.xhr) {
      return next();
   }

   try {
      const sourceUrl = `${req.protocol}://${req.get('host')}${
         req.originalUrl
      }`;
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: req.ip || req.connection.remoteAddress || '',
         clientUserAgent: req.headers['user-agent'] || '',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: config.facebook.debug,
      });

      // Track page view asynchronously (don't wait for response)
      conversionApi
         .trackPageView(sourceUrl, { eventId: `pv_${Date.now()}` })
         .catch((error: Error) =>
            console.error('Facebook Conversion API error:', error)
         );
   } catch (error: unknown) {
      console.error('Error in pageView tracking middleware:', error);
   }

   // Always continue to the next middleware regardless of tracking success
   next();
};

/**
 * Create a middleware to track specific event types
 * @param eventType The type of event to track (e.g., 'AddToCart', 'ViewContent')
 * @returns Middleware function
 */
export const trackEvent = (eventType: string) => {
   return (req: Request, res: Response, next: NextFunction) => {
      try {
         const sourceUrl =
            req.get('Referer') ||
            `${req.protocol}://${req.get('host')}${req.originalUrl}`;
         const conversionApi = new FacebookConversionApi({
            access_token: config.facebook.access_token,
            pixel_id: config.facebook.pixel_id,
            clientIpAddress: req.ip || req.connection.remoteAddress || '',
            clientUserAgent: req.headers['user-agent'] || '',
            fbp: req.cookies?._fbp || null,
            fbc: req.cookies?._fbc || null,
            debug: config.facebook.debug,
         });

         // Track the event asynchronously
         conversionApi
            .sendEvent(eventType, sourceUrl, null, {
               eventId: `${eventType.toLowerCase()}_${Date.now()}`,
            })
            .catch((error: Error) =>
               console.error('Facebook Conversion API error:', error)
            );
      } catch (error: unknown) {
         console.error(`Error in ${eventType} tracking middleware:`, error);
      }

      // Always continue to the next middleware
      next();
   };
};
