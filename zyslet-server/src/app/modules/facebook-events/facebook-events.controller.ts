import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { FacebookConversionService } from './facebook-events.service';

/**
 * Controller for sending Facebook Conversion API events with the exact payload structure
 * as specified in Meta Business documentation
 */

/**
 * Send events directly to Facebook Conversion API using the official payload structure
 */
const sendEventsToFacebook = catchAsync(async (req: Request, res: Response) => {
   try {
      const payload = req.body;

      // Add client information if not provided
      if (!payload.user_data) {
         payload.user_data = {};
      }

      if (!payload.user_data.client_ip_address) {
         payload.user_data.client_ip_address =
            req.ip || req.connection.remoteAddress || '';
      }

      if (!payload.user_data.client_user_agent) {
         payload.user_data.client_user_agent = req.headers['user-agent'] || '';
      }

      // Add event source URL if not provided
      if (!payload.event_source_url) {
         payload.event_source_url =
            req.get('Referer') ||
            `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      }

      // Add event time if not provided
      if (!payload.event_time) {
         payload.event_time = Math.floor(Date.now() / 1000);
      }

      // Add action source if not provided
      if (!payload.action_source) {
         payload.action_source = 'website';
      }

      // Send event using Facebook SDK
      const response = await FacebookConversionService.sendDirectEvent(payload);

      sendResponse(res, {
         statusCode: StatusCodes.OK,
         success: true,
         message: 'Event sent to Facebook Conversion API successfully',
         data: {
            event_name: payload.event_name,
            event_id: payload.event_id,
            response: response,
         },
      });
   } catch (error) {
      console.error('Facebook Conversion API error:', error);

      sendResponse(res, {
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
         success: false,
         message: `Failed to send event to Facebook Conversion API: ${
            error instanceof Error ? error.message : 'Unknown error'
         }`,
      });
   }
});

/**
 * Send events using direct Facebook API endpoint
 */
const sendEventsDirectAPI = catchAsync(async (req: Request, res: Response) => {
   try {
      const payload = req.body;
      const testMode = req.query.test === 'true';

      // Ensure payload has the correct structure
      if (!payload.data && !Array.isArray(payload)) {
         // Wrap single event in data array
         const eventData = {
            ...payload,
            event_time: payload.event_time || Math.floor(Date.now() / 1000),
            action_source: payload.action_source || 'website',
            user_data: {
               ...payload.user_data,
               client_ip_address:
                  payload.user_data?.client_ip_address ||
                  req.ip ||
                  req.connection.remoteAddress ||
                  '',
               client_user_agent:
                  payload.user_data?.client_user_agent ||
                  req.headers['user-agent'] ||
                  '',
            },
            event_source_url:
               payload.event_source_url ||
               req.get('Referer') ||
               `${req.protocol}://${req.get('host')}${req.originalUrl}`,
         };

         payload.data = [eventData];
      }

      const response = await FacebookConversionService.sendEventToFacebookAPI(
         payload,
         testMode
      );

      sendResponse(res, {
         statusCode: StatusCodes.OK,
         success: true,
         message: 'Event sent to Facebook API successfully',
         data: response,
      });
   } catch (error) {
      console.error('Facebook API error:', error);

      sendResponse(res, {
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
         success: false,
         message: `Failed to send event to Facebook API: ${
            error instanceof Error ? error.message : 'Unknown error'
         }`,
      });
   }
});

/**
 * Send a test Purchase event with the exact payload structure from Meta documentation
 */
const sendTestPurchaseEvent = catchAsync(
   async (req: Request, res: Response) => {
      try {
         const clientIpAddress =
            req.ip || req.connection.remoteAddress || '127.0.0.1';
         const clientUserAgent = req.headers['user-agent'] || 'test-agent';
         const eventSourceUrl =
            req.get('Referer') ||
            `${req.protocol}://${req.get('host')}${req.originalUrl}`;

         const testPayload =
            FacebookConversionService.createTestPurchasePayload(
               clientIpAddress,
               clientUserAgent,
               eventSourceUrl
            );

         // Send using direct API
         const response =
            await FacebookConversionService.sendEventToFacebookAPI(
               testPayload,
               true
            );

         sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Test Purchase event sent successfully',
            data: {
               payload: testPayload,
               response: response,
            },
         });
      } catch (error) {
         console.error('Test Purchase event error:', error);

         sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: `Test Purchase event failed: ${
               error instanceof Error ? error.message : 'Unknown error'
            }`,
         });
      }
   }
);

/**
 * Helper endpoint to hash user data (email, phone) for Facebook
 */
const hashUserData = catchAsync(async (req: Request, res: Response) => {
   const { email, phone } = req.body;

   const hashedData: Record<string, string> = {};

   if (email) {
      hashedData.em = FacebookConversionService.hashData(email);
   }

   if (phone) {
      // Remove all non-digits and add country code if needed
      const cleanPhone = phone.replace(/\D/g, '');
      hashedData.ph = FacebookConversionService.hashData(cleanPhone);
   }

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User data hashed successfully',
      data: hashedData,
   });
});

export const FacebookEventsController = {
   sendEventsToFacebook,
   sendEventsDirectAPI,
   sendTestPurchaseEvent,
   hashUserData,
};
