import { StatusCodes } from 'http-status-codes';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationCalculate';
import { IPaginationOptions } from '../../../interface/IPagination';
import { ImageUploadService } from '../../../shared/fileUpload';
import { Product } from '../product/product.model';
import { IReview, IReviewFilters } from './review.interface';
import { Review } from './review.model';

// Create a new review
const createReview = async (
   payload: IReview,
   images: Express.Multer.File[]
): Promise<IReview> => {
   if (images.length > 0) {
      // Map the images to their URLs
      const imageUrls = await ImageUploadService.uploadManyFile(
         images,
         'review'
      );
      payload.images = imageUrls;
   }
   payload.rating = Number(payload.rating);

   const result = await Review.create(payload);
   return result;
};
const getAllReviews = async (
   filters: IReviewFilters,
   paginationOptions: IPaginationOptions
) => {
   const { search, ...filterData } = filters;
   const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.paginationCalculate(paginationOptions);

   const sortConditions: { [key: string]: SortOrder } = {};
   if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
   } else {
      sortConditions['createdAt'] = 'desc';
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const andConditions: any[] = [];

   // First find products that match the search term
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   let productIds: any[] = [];
   if (search) {
      const matchingProducts = await Product.find({
         title: { $regex: search, $options: 'i' },
      }).select('_id');

      productIds = matchingProducts.map(p => p._id);
   }

   // Search implementation
   if (search) {
      andConditions.push({
         $or: [
            {
               name: {
                  $regex: search,
                  $options: 'i',
               },
            },
            {
               message: {
                  $regex: search,
                  $options: 'i',
               },
            },
            // Add product ID search
            {
               product_id: { $in: productIds },
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

   const result = await Review.find(whereConditions)
      .populate({
         path: 'product_id',
         select: 'title thumbnail code',
      })
      .populate({
         path: 'images',
         select: 'url',
      })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

   const total = await Review.countDocuments(whereConditions);

   return {
      meta: {
         page,
         limit,
         total,
      },
      data: result,
   };
};
// Get a single review by ID
const getReviewById = async (id: string): Promise<IReview | null> => {
   const result = await Review.findById(id)
      .populate({
         path: 'product_id',
         select: 'title thumbnail code',
      })
      .populate({
         path: 'images',
         select: 'url',
      });

   if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
   }

   return result;
};

// Update review status (approve or reject)
const updateReviewStatus = async (
   id: string,
   status: 'pending' | 'approved' | 'rejected'
): Promise<IReview | null> => {
   const review = await Review.findById(id);

   if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
   }

   // Update status and also update is_published flag based on status
   review.status = status;
   review.is_published = status === 'approved';

   await review.save();
   return review;
};

// Toggle publish review
const togglePublishReview = async (id: string): Promise<IReview | null> => {
   const review = await Review.findById(id);
   if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
   }
   review.is_published = !review.is_published;
   await review.save();
   return review;
};

// Delete review
const deleteReview = async (id: string): Promise<IReview | null> => {
   const result = await Review.findByIdAndDelete(id);

   if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
   }

   return result;
};

export const ReviewServices = {
   createReview,
   getAllReviews,
   getReviewById,
   updateReviewStatus,
   togglePublishReview,
   deleteReview,
};
