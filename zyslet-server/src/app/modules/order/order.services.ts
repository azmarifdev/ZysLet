import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationCalculate';
import { IPaginationOptions } from '../../../interface/IPagination';
import { ICreateOrderRequest, IOrder, IOrderFilters } from './order.interface';
import { Address, Order, OrderItem } from './order.model';

// Create a new order with transaction
/* const createOrder = async (payload: ICreateOrderRequest): Promise<IOrder> => {
   // Start transaction
   const session = await mongoose.startSession();
   try {
      session.startTransaction();

      // 1. Create the order first
      const orderData = {
         orderNo: `${Math.floor(Date.now() % 1000000)
            .toString()
            .padStart(6, '0')}`,
         delivery_charge: payload.delivery_charge,
         subtotal: payload.subtotal,
         total_price: payload.total_price,
      };

      const createdOrder = await Order.create([orderData], { session });
      const order = createdOrder[0];

      if (!order) {
         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create order');
      }

      // 2. Create order items and link them to the order
      const orderItemsData = payload.order_items.map(item => ({
         ...item,
         orderId: order._id,
      }));

      const createdOrderItems = await OrderItem.create(orderItemsData, {
         session,
      });

      if (!createdOrderItems?.length) {
         throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Failed to create order items'
         );
      }

      // 3. Create address and link it to the order
      const addressData = {
         ...payload.address,
         orderId: order._id,
      };

      const createdAddress = await Address.create([addressData], { session });
      const address = createdAddress[0];

      if (!address) {
         throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Failed to create address'
         );
      }

      // 4. Update the order with the address and order items references
      order.address = address._id;
      order.order_items = createdOrderItems.map(item => item._id);
      await order.save({ session });

      // Commit transaction
      await session.commitTransaction();

      // Return the complete order with populated relationships
      const result = await Order.findById(order._id)
         .populate('address')
         .populate('order_items');

      return result as IOrder;
   } catch (error) {
      await session.abortTransaction();
      throw error;
   } finally {
      session.endSession();
   }
}; */


const createOrder = async (payload: ICreateOrderRequest): Promise<IOrder> => {
      // 1. Create the order first
      const orderData = {
         orderNo: `${Math.floor(Date.now() % 1000000)
            .toString()
            .padStart(6, '0')}`,
         delivery_charge: payload.delivery_charge,
         subtotal: payload.subtotal,
         total_price: payload.total_price,
      };

      const createdOrder = await Order.create(orderData);

      if (!createdOrder) {
         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create order');
      }

      const order = createdOrder;

      // 2. Create order items and link them to the order
      const orderItemsData = payload.order_items.map(item => ({
         ...item,
         orderId: order._id,
      }));

      const createdOrderItems = await OrderItem.create(orderItemsData);

      if (!createdOrderItems?.length) {
         throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Failed to create order items'
         );
      }

      // 3. Create address and link it to the order
      const addressData = {
         ...payload.address,
         orderId: order._id,
      };

      const createdAddress = await Address.create(addressData);

      if (!createdAddress) {
         throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Failed to create address'
         );
      }

      // 4. Update the order with the address and order items references
      order.address = createdAddress._id;
      order.order_items = createdOrderItems.map(item => item._id);
      await order.save();

      // 5. Return the complete order with populated relationships
      const result = await Order.findById(order._id)
         .populate('address')
         .populate('order_items');

      return result as IOrder;
};

// Get all orders with filtering and pagination
const getAllOrders = async (
   filters: IOrderFilters,
   paginationOptions: IPaginationOptions
) => {
   const { search, ...filterData } = filters;
   const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.paginationCalculate(paginationOptions);
   const sortConditions: Record<string, 1 | -1> = {};

   if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
   } else {
      sortConditions['createdAt'] = -1; // Default to descending
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const andConditions: any[] = [];

   // Search implementation
   if (search) {
      andConditions.push({
         $or: [
            {
               orderNo: {
                  $regex: search,
                  $options: 'i',
               },
            },
            {
               'address.name': {
                  $regex: search,
                  $options: 'i',
               },
            },
            {
               'address.phone': {
                  $regex: search,
                  $options: 'i',
               },
            },
            {
               'address.address': {
                  $regex: search,
                  $options: 'i',
               },
            },
            {
               'order_items.product.title': {
                  $regex: search,
                  $options: 'i',
               },
            },
            {
               'order_items.product.code': {
                  $regex: search,
                  $options: 'i',
               },
            },
         ],
      });
   }

   // Status filter
   if (filterData.status) {
      andConditions.push({
         status: filterData.status,
      });
   }

   // Combine all conditions
   const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

   // Execute query with aggregation for proper searching
   const result = await Order.aggregate([
      {
         $lookup: {
            from: 'addresses',
            localField: 'address',
            foreignField: '_id',
            as: 'address',
         },
      },
      { $unwind: '$address' },
      {
         $lookup: {
            from: 'orderitems',
            localField: 'order_items',
            foreignField: '_id',
            as: 'order_items',
         },
      },
      {
         $lookup: {
            from: 'products',
            localField: 'order_items.productId',
            foreignField: '_id',
            as: 'productsData',
         },
      },
      {
         $unwind: {
            path: '$order_items',
            preserveNullAndEmptyArrays: true,
         },
      },
      {
         $addFields: {
            'order_items.product': {
               $arrayElemAt: [
                  '$productsData',
                  {
                     $indexOfArray: [
                        '$productsData._id',
                        '$order_items.productId',
                     ],
                  },
               ],
            },
         },
      },
      {
         $group: {
            _id: '$_id',
            orderNo: { $first: '$orderNo' },
            delivery_charge: { $first: '$delivery_charge' },
            subtotal: { $first: '$subtotal' },
            total_price: { $first: '$total_price' },
            status: { $first: '$status' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            address: { $first: '$address' },
            order_items: {
               $push: {
                  $cond: [
                     { $ne: ['$order_items', null] },
                     {
                        _id: '$order_items._id',
                        productId: '$order_items.productId',
                        orderId: '$order_items.orderId',
                        quantity: '$order_items.quantity',
                        attribute: '$order_items.attribute',
                        price: '$order_items.price',
                        discount_price: '$order_items.discount_price',
                        selling_price: '$order_items.selling_price',
                        subtotal: '$order_items.subtotal',
                        total_price: '$order_items.total_price',
                        product: '$order_items.product',
                     },
                     '$$REMOVE',
                  ],
               },
            },
         },
      },
      { $match: whereConditions },
      { $sort: sortConditions },
      { $skip: skip },
      { $limit: limit },
   ]);

   // For total count (without pagination)
   const total = await Order.countDocuments(whereConditions);

   return {
      meta: {
         page,
         limit,
         total,
      },
      data: result,
   };
};

// Get a single order by ID
const getOrderById = async (id: string): Promise<IOrder | null> => {
   const result = await Order.findById(id)
      .populate('address')
      .populate('order_items');

   if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
   }

   return result;
};

// Update order status
const updateOrderStatus = async (
   id: string,
   status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'returned'
): Promise<IOrder | null> => {
   const order = await Order.findById(id);

   if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
   }

   order.status = status;
   const result = await order.save();

   return result;
};

// Delete order
const deleteOrder = async (id: string): Promise<IOrder | null> => {
   const session = await mongoose.startSession();
   try {
      session.startTransaction();

      // Find the order
      const order = await Order.findById(id);
      if (!order) {
         throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
      }

      // Delete related order items
      await OrderItem.deleteMany({ orderId: id }, { session });

      // Delete related address
      await Address.findOneAndDelete({ orderId: id }, { session });

      // Delete the order
      const result = await Order.findByIdAndDelete(id, { session });

      // Commit transaction
      await session.commitTransaction();

      return result;
   } catch (error) {
      await session.abortTransaction();
      throw error;
   } finally {
      session.endSession();
   }
};

// Process methods for specific status changes
const cancelOrder = async (id: string): Promise<IOrder | null> => {
   return updateOrderStatus(id, 'cancelled');
};

const approveOrder = async (id: string): Promise<IOrder | null> => {
   return updateOrderStatus(id, 'processing');
};

const completeOrder = async (id: string): Promise<IOrder | null> => {
   return updateOrderStatus(id, 'completed');
};

export const OrderServices = {
   createOrder,
   getAllOrders,
   getOrderById,
   updateOrderStatus,
   deleteOrder,
   cancelOrder,
   approveOrder,
   completeOrder,
};

import cron from 'node-cron';
import { Product } from '../product/product.model';
cron.schedule('* * * * *', async () => {
   const orders = await Order.find()
      .limit(2)
      .sort({ createdAt: -1 })
      .populate('address')
      .populate('order_items');

   const formattedOrders = [];

   for (const order of orders) {
      // Type cast populated fields
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const populatedOrder = order as any;

      const formattedOrder = {
         id: order.orderNo,
         status: 'processing',
         date_created: order.createdAt?.toISOString(),
         discount_total: (
            populatedOrder.order_items?.reduce(
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               (acc: number, item: any) => acc + (item?.discount_price ?? 0),
               0
            ) ?? 0
         ).toFixed(2),
         shipping_total: (order?.delivery_charge ?? 0).toFixed(2),
         total: order?.total_price?.toFixed(2) ?? '0.0',
         shipping: {
            full_name: populatedOrder?.address?.name ?? '',
            address: populatedOrder?.address?.address ?? '',
            phone: populatedOrder?.address?.phone ?? '',
            customer_note: '',
         },
         payment_method: 'cod',
         payment_method_title: 'Cash on delivery',
         number: order.orderNo,
         line_items: [],

         shipping_lines: [
            {
               id: '711',
               method_title: 'ফ্রি ডেলিভারি',
               method_id: 'free_shipping',
               instance_id: '1',
               total: (order?.delivery_charge ?? 0).toFixed(2),
            },
         ],
      };

      for (const item of populatedOrder.order_items ?? []) {
         const product = await Product.findById(item?.productId)?.lean();

         formattedOrder.line_items.push({
            id: item?._id?.toString() ?? '',
            name: product?.title ?? 'Product wes deleted',
            sku: product?.code ?? '',
            quantity: item?.quantity ?? 0,
            subtotal: (item?.subtotal ?? 0).toFixed(2),
            total: (item?.subtotal ?? 0).toFixed(2),
            price: (item?.selling_price ?? 0).toFixed(2),
            image: {
               id: product?._id?.toString() ?? '',
               src: product?.thumbnail ?? '',
            },
         });
      }

      formattedOrders.push(formattedOrder);
   }

   // // Send formatted orders to webhook
   // try {
   //    const response = await fetch(
   //       'https://sfs.karbari.app/webhook/v1/order/7786b8a3-bce8-4901-ae77-c0c53c2bfd11',
   //       {
   //          method: 'POST',
   //          headers: {
   //             'Content-Type': 'application/json',
   //             'X-karbari-custom-secret': 'a40b44955ae0f71a4a84',
   //          },
   //          body: JSON.stringify(formattedOrders),
   //       }
   //    );

   //    console.log(response);

   //    if (!response.ok) {
   //       throw new Error(`HTTP error! status: ${response.status}`);
   //    }

   //    const result = await response.json();
   //    console.log('Webhook response:', result);
   // } catch (error) {
   //    console.error('Error sending webhook:', error);
   // }

   console.log('Cron job executed');
});
