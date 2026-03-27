import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import FacebookConversionApi from '../../../helpers/fbConversionApi';
import config from '../../../config';

/**
 * Controller for handling tracking events
 */
const trackEvent = catchAsync(async (req: Request, res: Response) => {
   const { eventName, products, value, eventData, searchTerm, filterData } =
      req.body;

   // Validate required Facebook API credentials
   if (!config.facebook.access_token || !config.facebook.pixel_id) {
      console.error('Facebook API credentials missing');
      return sendResponse(res, {
         statusCode: StatusCodes.OK,
         success: true,
         message: 'Event received (tracking disabled)',
      });
   }

   const sourceUrl =
      req.body.sourceUrl ||
      req.get('Referer') ||
      `${req.protocol}://${req.get('host')}${req.originalUrl}`;

   try {
      // Get client IP address properly through nginx proxy
      const clientIpAddress =
         req.headers['x-forwarded-for']?.toString().split(',')[0] ||
         req.headers['x-real-ip']?.toString() ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip ||
         '';

      // Initialize Facebook Conversion API
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: clientIpAddress.trim(),
         clientUserAgent: req.headers['user-agent'] || '',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: config.facebook.debug,
      });

      // Handle different event types
      switch (eventName) {
         case 'AddToCart':
            if (products && Array.isArray(products) && products.length > 0) {
               products.forEach(product => {
                  conversionApi.addProduct(product.id, product.quantity);
               });
               const totalValue =
                  value ||
                  products.reduce((sum, p) => sum + p.price * p.quantity, 0);
               await conversionApi.sendEvent(
                  'AddToCart',
                  sourceUrl,
                  { value: totalValue, currency: 'USD' },
                  eventData
               );
            }
            break;

         case 'ViewContent':
            if (products && Array.isArray(products) && products.length > 0) {
               products.forEach(product => {
                  conversionApi.addProduct(product.id, 1);
               });
               await conversionApi.sendEvent(
                  'ViewContent',
                  sourceUrl,
                  { value: value, currency: 'USD' },
                  eventData
               );
            }
            break;

         case 'Search':
            if (searchTerm) {
               await conversionApi.trackSearch(
                  searchTerm,
                  sourceUrl,
                  eventData
               );
            }
            break;

         case 'InitiateCheckout':
            if (products && Array.isArray(products) && products.length > 0) {
               products.forEach(product => {
                  conversionApi.addProduct(product.id, product.quantity);
               });
               await conversionApi.sendEvent(
                  'InitiateCheckout',
                  sourceUrl,
                  { value: value, currency: 'USD' },
                  eventData
               );
            }
            break;

         case 'Filter':
            if (filterData) {
               await conversionApi.trackFilter(
                  filterData,
                  sourceUrl,
                  eventData
               );
            }
            break;

         case 'Bundle':
            if (products && Array.isArray(products) && products.length > 0) {
               products.forEach(product => {
                  conversionApi.addProduct(product.id, product.quantity);
               });
               await conversionApi.sendEvent(
                  'CustomizeProduct',
                  sourceUrl,
                  { value: value, currency: 'USD' },
                  eventData
               );
            }
            break;

         case 'ProductClick':
            if (products && Array.isArray(products) && products.length > 0) {
               const product = products[0]; // Usually only one product is clicked
               conversionApi.addProduct(product.id, 1);
               await conversionApi.sendEvent(
                  'ViewContent',
                  sourceUrl,
                  null,
                  eventData
               );
            }
            break;

         case 'PageView':
            await conversionApi.trackPageView(sourceUrl, eventData);
            break;

         default:
            // For custom events
            if (products && Array.isArray(products) && products.length > 0) {
               products.forEach(product => {
                  conversionApi.addProduct(product.id, product.quantity);
               });
            }
            await conversionApi.sendEvent(
               eventName,
               sourceUrl,
               value ? { value, currency: 'USD' } : null,
               eventData
            );
            break;
      }

      sendResponse(res, {
         statusCode: StatusCodes.OK,
         success: true,
         message: 'Event tracked successfully',
      });
   } catch (error) {
      console.error('Facebook Conversion API error:', error);

      // Still return success to client even if tracking fails
      // This prevents tracking issues from disrupting user experience
      sendResponse(res, {
         statusCode: StatusCodes.OK,
         success: true,
         message: 'Event received',
      });
   }
});

export const TrackingController = {
   trackEvent,
};
