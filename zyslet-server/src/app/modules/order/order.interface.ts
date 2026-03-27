// order.interface.ts
import { Model, Schema, Types } from 'mongoose';

// address.interface.ts
export type IAddress = {
   orderId: Schema.Types.ObjectId;
   name: string;
   phone: string;
   address: string;
   createdAt: Date;
   updatedAt: Date;
};

export type AddressModel = Model<IAddress, Record<string, unknown>>;

// order-item.interface.ts
export type IOrderItem = {
   orderId: Schema.Types.ObjectId;
   productId: Schema.Types.ObjectId;
   quantity: number;
   attribute: {
      title: string;
      value: string;
   }[];
   price: number;
   discount_price?: number;
   selling_price: number;
   subtotal: number;

   createdAt: Date;
   updatedAt: Date;
};

export type OrderItemModel = Model<IOrderItem, Record<string, unknown>>;

export type IOrder = {
   orderNo: string;
   order_items: Types.ObjectId[];
   address: Types.ObjectId;

   delivery_charge: number;
   subtotal: number;
   total_price: number;

   status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'returned';
   createdAt: Date;
   updatedAt: Date;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;

// For filtering and pagination
export type IOrderFilters = {
   search?: string;
   phone?: string;
   status?: string;
};

export const orderFilterableFields = ['search', 'phone', 'status'];

export type ICreateOrderRequest = {
   delivery_charge: number;
   subtotal: number;
   total_price: number;
   address: {
      name: string;
      phone: string;
      address: string;
   };
   order_items: {
      productId: string;
      quantity: number;
      attribute: {
         title: string;
         value: string;
      }[];
      price: number;
      discount_price?: number;
      selling_price: number;
      subtotal: number;
      total_price: number;
   }[];
};
