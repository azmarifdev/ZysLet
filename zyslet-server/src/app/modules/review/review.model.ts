import { model, Schema } from 'mongoose';
import { IReview, IReviewModel } from './review.interface';

// Review Model
const reviewSchema = new Schema<IReview, IReviewModel>(
   {
      product_id: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
      phone: {
         type: String,
         required: true,
      },
      message: {
         type: String,
      },
      rating: {
         type: Number,
         required: true,
         min: 1,
         max: 5,
      },
      images: [
         {
            type: String,
         },
      ],
      is_published: {
         type: Boolean,
         default: false,
      },
      status: {
         type: String,
         enum: ['pending', 'approved', 'rejected'],
         default: 'pending',
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

// Optimizes published reviews lookup per product
reviewSchema.index({ product_id: 1, is_published: 1, createdAt: -1 });

export const Review = model<IReview, IReviewModel>('Review', reviewSchema);
