import * as fb from 'facebook-nodejs-business-sdk';
import config from '../../../config';
import crypto from 'crypto';

/**
 * Direct Facebook Conversion API Service
 *
 * This service sends events directly to Facebook's Conversion API using the
 * exact payload structure from Meta Business documentation
 */

/**
 * Hash user data using SHA256 as required by Facebook
 */
const hashData = (data: string): string => {
   return crypto
      .createHash('sha256')
      .update(data.toLowerCase().trim())
      .digest('hex');
};

/**
 * Send events to Facebook Conversion API with the official payload structure
 */
export const sendDirectEvent = async (payload: {
   event_name: string;
   event_time: number;
   action_source: string;
   user_data: {
      em?: string[];
      ph?: (string | null)[];
      fbp?: string;
      fbc?: string;
      client_ip_address?: string;
      client_user_agent?: string;
   };
   custom_data?: {
      currency?: string;
      value?: string | number;
      contents?: Array<{
         id: string;
         quantity: number;
         item_price?: number;
      }>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
   };
   event_source_url?: string;
   event_id?: string;
}) => {
   try {
      // Initialize Facebook API
      fb.FacebookAdsApi.init(config.facebook.access_token);

      // Create user data
      const userData = new fb.UserData();

      if (payload.user_data.em && payload.user_data.em[0]) {
         userData.setEmail(payload.user_data.em[0]);
      }

      if (payload.user_data.ph && payload.user_data.ph[0]) {
         userData.setPhone(payload.user_data.ph[0]);
      }

      if (payload.user_data.client_ip_address) {
         userData.setClientIpAddress(payload.user_data.client_ip_address);
      }

      if (payload.user_data.client_user_agent) {
         userData.setClientUserAgent(payload.user_data.client_user_agent);
      }

      if (payload.user_data.fbp) {
         userData.setFbp(payload.user_data.fbp);
      }

      if (payload.user_data.fbc) {
         userData.setFbc(payload.user_data.fbc);
      }

      // Create custom data
      const customData = new fb.CustomData();

      if (payload.custom_data?.currency) {
         customData.setCurrency(payload.custom_data.currency);
      }

      if (payload.custom_data?.value) {
         customData.setValue(parseFloat(payload.custom_data.value.toString()));
      }

      // Add contents if present
      if (
         payload.custom_data?.contents &&
         Array.isArray(payload.custom_data.contents)
      ) {
         const contents = payload.custom_data.contents.map(content => {
            return new fb.Content()
               .setId(content.id)
               .setQuantity(content.quantity)
               .setItemPrice(content.item_price || 0);
         });
         customData.setContents(contents);
      }

      // Create server event
      const serverEvent = new fb.ServerEvent()
         .setEventName(payload.event_name)
         .setEventTime(payload.event_time)
         .setUserData(userData)
         .setCustomData(customData)
         .setEventSourceUrl(payload.event_source_url || '')
         .setActionSource(payload.action_source);

      if (payload.event_id) {
         serverEvent.setEventId(payload.event_id);
      }

      // Create event request
      const eventRequest = new fb.EventRequest(
         config.facebook.access_token,
         config.facebook.pixel_id
      ).setEvents([serverEvent]);

      // Send the event
      const response = await eventRequest.execute();

      return response;
   } catch (error) {
      console.error('Direct Facebook Conversion API Error:', error);
      throw error;
   }
};

/**
 * Create a test Purchase event payload exactly as shown in Meta documentation
 */
export const createTestPurchasePayload = (
   clientIpAddress: string,
   clientUserAgent: string,
   eventSourceUrl: string
) => {
   return {
      data: [
         {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
               em: [
                  '7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068',
               ],
               ph: [null],
               client_ip_address: clientIpAddress,
               client_user_agent: clientUserAgent,
            },
            attribution_data: {
               attribution_share: '0.3',
            },
            custom_data: {
               currency: 'USD',
               value: '142.52',
               contents: [
                  {
                     id: 'TEST_PRODUCT_123',
                     quantity: 1,
                     item_price: 142.52,
                  },
               ],
            },
            original_event_data: {
               event_name: 'Purchase',
               event_time: Math.floor(Date.now() / 1000),
            },
            event_source_url: eventSourceUrl,
            event_id: `test_purchase_${Date.now()}`,
         },
      ],
   };
};

/**
 * Send event using Facebook's direct API endpoint
 * This makes a direct POST request to Facebook's Conversion API
 */
export const sendEventToFacebookAPI = async (
   payload: Record<string, unknown>,
   testMode: boolean = false
) => {
   try {
      const apiVersion = 'v18.0'; // Use appropriate API version
      const url = `https://graph.facebook.com/${apiVersion}/${config.facebook.pixel_id}/events`;

      const body = {
         data: Array.isArray(payload.data) ? payload.data : [payload],
         access_token: config.facebook.access_token,
         ...(testMode && { test_event_code: 'TEST12345' }), // Add test code for testing
      };

      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (!response.ok) {
         throw new Error(`Facebook API Error: ${JSON.stringify(responseData)}`);
      }

      return responseData;
   } catch (error) {
      console.error('Facebook API Request Error:', error);
      throw error;
   }
};

export const FacebookConversionService = {
   sendDirectEvent,
   createTestPurchasePayload,
   sendEventToFacebookAPI,
   hashData,
};
