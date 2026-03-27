import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import { paginationFields } from '../../../constant/paginationOptions';
import FacebookConversionApi from '../../../helpers/fbConversionApi';
import { catchAsync } from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { orderFilterableFields } from './order.interface';
import { OrderServices } from './order.services';

// Create a new order
const createOrder = catchAsync(async (req: Request, res: Response) => {
   const orderData = req.body;
   const result = await OrderServices.createOrder(orderData);

   // Track purchase event for Facebook Conversion API
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

      // Calculate total value in BDT (we'll convert to USD before sending)
      const totalValueBDT = orderData.total_price;
      // Convert BDT to USD (assuming approximate conversion rate, adjust as needed)
      const takaToUsd = totalValueBDT / 110; // Approximate conversion rate

      // Add each product to the event
      if (orderData.order_items && Array.isArray(orderData.order_items)) {
         orderData.order_items.forEach(
            (item: { productId: string; quantity: number }) => {
               conversionApi.addProduct(item.productId, item.quantity);
            }
         );
      }

      // Send the purchase event
      conversionApi.sendEvent(
         'Purchase',
         sourceUrl,
         { value: takaToUsd, currency: 'USD' },
         { eventId: result.orderNo }
      );
   } catch (error) {
      // Don't let tracking errors affect the API response
      console.error('Facebook Conversion API error:', error);
   }

   sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Order created successfully',
      data: result,
   });
});

// Get all orders
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
   const filters = pick(req.query, orderFilterableFields);
   const paginationOptions = pick(req.query, paginationFields);

   const result = await OrderServices.getAllOrders(filters, paginationOptions);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Orders retrieved successfully',
      meta: result.meta,
      data: result.data,
   });
});

// Get a single order by ID
const getOrderById = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await OrderServices.getOrderById(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order retrieved successfully',
      data: result,
   });
});

// Update order status
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const { status } = req.body;
   const result = await OrderServices.updateOrderStatus(id, status);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order status updated successfully',
      data: result,
   });
});

// Delete order
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await OrderServices.deleteOrder(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order deleted successfully',
      data: result,
   });
});

// Cancel order
const cancelOrder = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await OrderServices.cancelOrder(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order cancelled successfully',
      data: result,
   });
});

// Approve order
const approveOrder = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await OrderServices.approveOrder(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order approved successfully',
      data: result,
   });
});

// Complete order
const completeOrder = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await OrderServices.completeOrder(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order completed successfully',
      data: result,
   });
});

export const OrderController = {
   createOrder,
   getAllOrders,
   getOrderById,
   updateOrderStatus,
   deleteOrder,
   cancelOrder,
   approveOrder,
   completeOrder,
};
