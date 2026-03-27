import { Schema, model } from 'mongoose';
import {
   AddressModel,
   IAddress,
   IOrder,
   IOrderItem,
   OrderItemModel,
   OrderModel,
} from './order.interface';

const addressSchema = new Schema<IAddress, AddressModel>(
   {
      orderId: {
         type: Schema.Types.ObjectId,
         ref: 'Order',
         required: true,
      },
      name: {
         type: String,
         required: true,
         trim: true,
      },
      phone: {
         type: String,
         required: true,
         trim: true,
      },
      address: {
         type: String,
         required: true,
         trim: true,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

export const Address = model<IAddress, AddressModel>('Address', addressSchema);

const orderItemSchema = new Schema<IOrderItem, OrderItemModel>(
   {
      orderId: {
         type: Schema.Types.ObjectId,
         ref: 'Order',
         required: true,
      },
      productId: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         required: true,
         trim: true,
      },
      quantity: {
         type: Number,
         required: true,
         min: 1,
      },
      attribute: [
         {
            title: {
               type: String,
            },
            value: {
               type: String,
            },
         },
      ],
      price: {
         type: Number,
         required: true,
         min: 0,
      },
      discount_price: {
         type: Number,
         min: 0,
      },
      selling_price: {
         type: Number,
         required: true,
         min: 0,
      },
      subtotal: {
         type: Number,
         required: true,
         min: 0,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

export const OrderItem = model<IOrderItem, OrderItemModel>(
   'OrderItem',
   orderItemSchema
);

const orderSchema = new Schema<IOrder, OrderModel>(
   {
      orderNo: {
         type: String,
         required: true,
      },
      delivery_charge: {
         type: Number,
         required: true,
         default: 0,
         min: 0,
      },
      subtotal: {
         type: Number,
         required: true,
         min: 0,
      },
      total_price: {
         type: Number,
         required: true,
         min: 0,
      },
      status: {
         type: String,
         required: true,
         enum: ['pending', 'processing', 'completed', 'cancelled', 'returned'],
         default: 'pending',
      },
      address: {
         type: Schema.Types.ObjectId,
         ref: 'Address',
      },
      order_items: [
         {
            type: Schema.Types.ObjectId,
            ref: 'OrderItem',
         },
      ],
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

// Create indexes for frequently queried fields
orderSchema.index({ phone: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
