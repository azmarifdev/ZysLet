import * as fb from 'facebook-nodejs-business-sdk';

/**
 * Facebook Conversion API Helper
 *
 * This class helps send server-side events to Facebook's Conversion API.
 * It can track various user activities like page views, product views, add to cart, purchase, etc.
 *
 * @class FacebookConversionApi
 */
class FacebookConversionApi {
   // Properties to store the event data
   private contents: fb.Content[] = [];
   private userData: fb.UserData;
   private access_token: string;
   private pixel_id: string;
   private phones: string | null;
   private email: string | null;
   private clientIpAddress: string;
   private clientUserAgent: string;
   private fbp: string | null;
   private fbc: string | null;
   private debug: boolean;

   /**
    * Initialize the class with the access token and pixel id
    *
    * @param {Object} config - Configuration object
    * @param {string} config.access_token - Facebook API access token
    * @param {string} config.pixel_id - Facebook Pixel ID
    * @param {string|null} [config.phones=null] - User's phone number
    * @param {string|null} [config.email=null] - User's email
    * @param {string} config.clientIpAddress - Client's IP address
    * @param {string} [config.clientUserAgent="website"] - Client's user agent
    * @param {string|null} [config.fbp=null] - Facebook Browser ID
    * @param {string|null} [config.fbc=null] - Facebook Click ID
    * @param {boolean} [config.debug=false] - Enable debug mode
    */
   constructor({
      access_token,
      pixel_id,
      phones = null,
      email = null,
      clientIpAddress,
      clientUserAgent = 'website',
      fbp = null,
      fbc = null,
      debug = false,
   }: {
      access_token: string;
      pixel_id: string;
      phones?: string | null;
      email?: string | null;
      clientIpAddress: string;
      clientUserAgent?: string;
      fbp?: string | null;
      fbc?: string | null;
      debug?: boolean;
   }) {
      this.access_token = access_token;
      this.pixel_id = pixel_id;
      this.phones = phones;
      this.email = email;
      this.clientIpAddress = clientIpAddress;
      this.clientUserAgent = clientUserAgent;
      this.fbp = fbp;
      this.fbc = fbc;
      this.debug = debug;

      // Initialize user data
      this.userData = new fb.UserData()
         .setEmail(email)
         .setPhone(phones)
         .setClientIpAddress(clientIpAddress)
         .setClientUserAgent(clientUserAgent)
         .setFbp(fbp)
         .setFbc(fbc);

      this.contents = [];

      if (this.debug) {
         console.log(`userData ${JSON.stringify(this.userData)} \n`);
      }
   }

   /**
    * Add product to the contents array
    *
    * @param {string} sku - Product SKU or ID
    * @param {number} quantity - Product quantity
    */
   addProduct(sku: string, quantity: number): void {
      this.contents.push(new fb.Content().setId(sku).setQuantity(quantity));

      if (this.debug) {
         console.log(`Add To Cart: ${JSON.stringify(this.contents)}\n`);
      }
   }

   /**
    * Send event to Facebook Conversion API and clear contents array after event is fired.
    *
    * @param {string} eventName - Name of the event (Purchase, ViewContent, AddToCart, etc.)
    * @param {string} sourceUrl - URL where the event occurred
    * @param {Object|null} [purchaseData=null] - Purchase data with value and currency
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   sendEvent(
      eventName: string,
      sourceUrl: string,
      purchaseData: { value: number; currency: string } | null = null,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      const eventRequest = new fb.EventRequest(
         this.access_token,
         this.pixel_id
      ).setEvents([
         this.#getEventData(eventName, sourceUrl, purchaseData, eventData),
      ]);

      // Clear the contents array after sending the event
      const result = eventRequest.execute().then(
         (response: fb.EventResponse) => {
            if (this.debug) {
               console.log('Facebook Conversion API Success:', response);
            }
            return response;
         },
         (error: Error) => {
            console.error('Facebook Conversion API Error:', {
               error: error.message,
               eventName,
               sourceUrl,
               pixel_id: this.pixel_id,
               access_token: this.access_token ? 'Set' : 'Missing',
            });
            throw error;
         }
      );
      this.contents = [];

      if (this.debug) {
         console.log(`Event Request: ${JSON.stringify(eventRequest)}\n`);
      }

      return result;
   }

   /**
    * Get event data for Facebook Conversion API
    *
    * @param {string} eventName - Name of the event
    * @param {string} sourceUrl - URL where the event occurred
    * @param {Object|null} [purchaseData=null] - Purchase data with value and currency
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Object} - ServerEvent object for Facebook API
    * @private
    */
   #getEventData(
      eventName: string,
      sourceUrl: string,
      purchaseData: { value: number; currency: string } | null = null,
      eventData: Record<string, unknown> | null = null
   ): fb.ServerEvent {
      const currentTimestamp = Math.floor(new Date().getTime() / 1000);

      return new fb.ServerEvent()
         .setEventName(eventName)
         .setEventTime(currentTimestamp)
         .setEventId(eventData?.eventId as string | undefined)
         .setUserData(this.userData)
         .setCustomData(
            new fb.CustomData()
               .setContents(this.contents)
               .setCurrency(purchaseData?.currency)
               .setValue(purchaseData?.value)
         )
         .setEventSourceUrl(sourceUrl)
         .setActionSource('website');
   }

   /**
    * Track Page View event
    *
    * @param {string} sourceUrl - URL of the page
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackPageView(
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      return this.sendEvent('PageView', sourceUrl, null, eventData);
   }

   /**
    * Track Product View event
    *
    * @param {string} productId - Product ID or SKU
    * @param {number} value - Product value/price
    * @param {string} sourceUrl - URL of the product page
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackProductView(
      productId: string,
      value: number,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      this.addProduct(productId, 1);
      return this.sendEvent(
         'ViewContent',
         sourceUrl,
         { value, currency: 'USD' },
         eventData
      );
   }

   /**
    * Track Add to Cart event
    *
    * @param {string} productId - Product ID or SKU
    * @param {number} quantity - Product quantity
    * @param {number} value - Total value of added items
    * @param {string} sourceUrl - URL where Add to Cart happened
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackAddToCart(
      productId: string,
      quantity: number,
      value: number,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      this.addProduct(productId, quantity);
      return this.sendEvent(
         'AddToCart',
         sourceUrl,
         { value, currency: 'USD' },
         eventData
      );
   }

   /**
    * Track Initiate Checkout event
    *
    * @param {Array} products - Array of products with id and quantity
    * @param {number} value - Total checkout value
    * @param {string} sourceUrl - URL of the checkout page
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackInitiateCheckout(
      products: Array<{ id: string; quantity: number }>,
      value: number,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      products.forEach(product => {
         this.addProduct(product.id, product.quantity);
      });
      return this.sendEvent(
         'InitiateCheckout',
         sourceUrl,
         { value, currency: 'USD' },
         eventData
      );
   }

   /**
    * Track Purchase event
    *
    * @param {Array} products - Array of products with id and quantity
    * @param {number} value - Total purchase value
    * @param {string} sourceUrl - URL where purchase completed
    * @param {Object|null} [eventData=null] - Additional event data with orderId
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackPurchase(
      products: Array<{ id: string; quantity: number }>,
      value: number,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      products.forEach(product => {
         this.addProduct(product.id, product.quantity);
      });
      return this.sendEvent(
         'Purchase',
         sourceUrl,
         { value, currency: 'USD' },
         eventData
      );
   }

   /**
    * Track Search event
    *
    * @param {string} searchTerm - Search query
    * @param {string} sourceUrl - URL of the search page
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackSearch(
      searchTerm: string,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      const customData = eventData
         ? { ...eventData, searchString: searchTerm }
         : { searchString: searchTerm };
      return this.sendEvent('Search', sourceUrl, null, customData);
   }

   /**
    * Track product filter usage
    *
    * @param {Object} filterData - Filter criteria used
    * @param {string} sourceUrl - URL where filtering occurred
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackFilter(
      filterData: Record<string, unknown>,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      const customData = eventData
         ? { ...eventData, filterData }
         : { filterData };
      return this.sendEvent('CustomizeProduct', sourceUrl, null, customData);
   }

   /**
    * Track bundle selection event
    *
    * @param {Array} bundleProducts - Products in the bundle
    * @param {number} value - Total bundle value
    * @param {string} sourceUrl - URL where bundle was selected
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackBundleSelection(
      bundleProducts: Array<{ id: string; quantity: number }>,
      value: number,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      bundleProducts.forEach(product => {
         this.addProduct(product.id, product.quantity);
      });
      return this.sendEvent(
         'CustomizeProduct',
         sourceUrl,
         { value, currency: 'USD' },
         eventData
      );
   }

   /**
    * Track product clicks from listing to product page
    *
    * @param {string} productId - Product ID that was clicked
    * @param {string} sourceUrl - URL where click occurred
    * @param {Object|null} [eventData=null] - Additional event data
    * @returns {Promise} - Promise with the response from Facebook API
    */
   trackProductClick(
      productId: string,
      sourceUrl: string,
      eventData: Record<string, unknown> | null = null
   ): Promise<fb.EventResponse> {
      this.addProduct(productId, 1);
      return this.sendEvent('ViewContent', sourceUrl, null, eventData);
   }
}

export default FacebookConversionApi;
