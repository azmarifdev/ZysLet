import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import FacebookConversionApi from './helpers/fbConversionApi';
import config from './config';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple middleware to add cookies for testing
app.use((req, res, next) => {
   if (!req.cookies) {
      req.cookies = {};
   }
   next();
});

// Test route to verify the Facebook Conversion API implementation
app.get('/test-fb-conversion', (req, res) => {
   try {
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: req.ip || '127.0.0.1',
         clientUserAgent: req.headers['user-agent'] || 'test-agent',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: true,
      });

      // Test a page view event
      conversionApi
         .trackPageView('https://example.com/test-page', {
            eventId: `test_${Date.now()}`,
         })
         .then(response => {
            console.log('Facebook Conversion API Response:', response);

            res.json({
               success: true,
               message: 'Facebook Conversion API test successful',
               response,
            });
         })
         .catch(error => {
            console.error('Facebook Conversion API Error:', error);

            res.status(500).json({
               success: false,
               message: 'Facebook Conversion API test failed',
               error: error instanceof Error ? error.message : 'Unknown error',
            });
         });
   } catch (error) {
      console.error('Error initializing Facebook Conversion API:', error);

      res.status(500).json({
         success: false,
         message: 'Error initializing Facebook Conversion API',
         error: error instanceof Error ? error.message : 'Unknown error',
      });
   }
});

// Start the server on a different port for testing
const PORT = 3001;
app.listen(PORT, () => {
   console.log(`Test server running on port ${PORT}`);
   console.log(
      `Access the test endpoint at: http://localhost:${PORT}/test-fb-conversion`
   );
   console.log(`Product view test: http://localhost:${PORT}/test-product-view`);
   console.log(`Add to cart test: http://localhost:${PORT}/test-add-to-cart`);
   console.log(`Purchase test: http://localhost:${PORT}/test-purchase`);
});

// Additional test routes
app.get('/test-product-view', (req, res) => {
   try {
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: req.ip || '127.0.0.1',
         clientUserAgent: req.headers['user-agent'] || 'test-agent',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: true,
      });

      // Test a product view event
      conversionApi
         .trackProductView(
            'TEST123',
            999.99,
            'https://example.com/product/test123',
            { eventId: `pv_test_${Date.now()}` }
         )
         .then(response => {
            res.json({
               success: true,
               message: 'Product view event tracked successfully',
               response,
            });
         })
         .catch(error => {
            console.error('Facebook Conversion API Error:', error);
            res.status(500).json({
               success: false,
               message: 'Product view event tracking failed',
               error: error instanceof Error ? error.message : 'Unknown error',
            });
         });
   } catch (error) {
      console.error('Error initializing Facebook Conversion API:', error);
      res.status(500).json({
         success: false,
         message: 'Error initializing Facebook Conversion API',
         error: error instanceof Error ? error.message : 'Unknown error',
      });
   }
});

app.get('/test-add-to-cart', (req, res) => {
   try {
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: req.ip || '127.0.0.1',
         clientUserAgent: req.headers['user-agent'] || 'test-agent',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: true,
      });

      // Test an add to cart event
      conversionApi
         .trackAddToCart('TEST123', 2, 1999.98, 'https://example.com/cart', {
            eventId: `atc_test_${Date.now()}`,
         })
         .then(response => {
            res.json({
               success: true,
               message: 'Add to cart event tracked successfully',
               response,
            });
         })
         .catch(error => {
            console.error('Facebook Conversion API Error:', error);
            res.status(500).json({
               success: false,
               message: 'Add to cart event tracking failed',
               error: error instanceof Error ? error.message : 'Unknown error',
            });
         });
   } catch (error) {
      console.error('Error initializing Facebook Conversion API:', error);
      res.status(500).json({
         success: false,
         message: 'Error initializing Facebook Conversion API',
         error: error instanceof Error ? error.message : 'Unknown error',
      });
   }
});

app.get('/test-purchase', (req, res) => {
   try {
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: req.ip || '127.0.0.1',
         clientUserAgent: req.headers['user-agent'] || 'test-agent',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: true,
      });

      // Test products for purchase event
      const products = [
         { id: 'TEST123', quantity: 2 },
         { id: 'TEST456', quantity: 1 },
      ];

      // Test a purchase event
      conversionApi
         .trackPurchase(
            products,
            2999.97,
            'https://example.com/checkout/success',
            { eventId: `purchase_test_${Date.now()}`, orderId: 'ORDER123' }
         )
         .then(response => {
            res.json({
               success: true,
               message: 'Purchase event tracked successfully',
               response,
            });
         })
         .catch(error => {
            console.error('Facebook Conversion API Error:', error);
            res.status(500).json({
               success: false,
               message: 'Purchase event tracking failed',
               error: error instanceof Error ? error.message : 'Unknown error',
            });
         });
   } catch (error) {
      console.error('Error initializing Facebook Conversion API:', error);
      res.status(500).json({
         success: false,
         message: 'Error initializing Facebook Conversion API',
         error: error instanceof Error ? error.message : 'Unknown error',
      });
   }
});
