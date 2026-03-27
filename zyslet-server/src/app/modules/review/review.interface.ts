import mongoose, { Model } from 'mongoose';

// Review Interface
export type IReview = {
   _id?: mongoose.Types.ObjectId;
   product_id: mongoose.Types.ObjectId;
   name: string;
   message?: string;
   phone:string;
   rating: number;
   images?: string[];
   is_published: boolean;
   status: 'pending' | 'approved' | 'rejected';
   createdAt?: Date;
   updatedAt?: Date;
};

export type IReviewModel = Model<IReview, Record<string, unknown>>;

export type IReviewFilters = {
   search?: string;
   status?: 'pending' | 'approved' | 'rejected';
   product_id?: string;
   rating?: number;
};

export const reviewFilterableFields = ['search', 'status', 'product_id'];
