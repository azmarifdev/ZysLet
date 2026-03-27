import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { paginationFields } from '../../../constant/paginationOptions';
import { catchAsync } from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { reviewFilterableFields } from './review.interface';
import { ReviewServices } from './review.services';

// Create a new review
const createReview = catchAsync(async (req: Request, res: Response) => {
   const files = req.files as { [fieldname: string]: Express.Multer.File[] };

   const images = files['images'] || [];

   const result = await ReviewServices.createReview(req.body, images);

   sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Review submitted successfully',
      data: result,
   });
});

// Get all reviews with pagination and filtering
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
   const filters = pick(req.query, reviewFilterableFields);
   const paginationOptions = pick(req.query, paginationFields);

   const result = await ReviewServices.getAllReviews(
      filters,
      paginationOptions
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Reviews retrieved successfully',
      meta: result.meta,
      data: result.data,
   });
});

// Get a single review by ID
const getReviewById = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await ReviewServices.getReviewById(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Review retrieved successfully',
      data: result,
   });
});

// Update review status
const updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const { status } = req.body;
   const result = await ReviewServices.updateReviewStatus(id, status);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Review status updated to ${status} successfully`,
      data: result,
   });
});

// Toggle publish review
const togglePublishReview = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await ReviewServices.togglePublishReview(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Review publish status toggled successfully',
      data: result,
   });
});

// Delete review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await ReviewServices.deleteReview(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Review deleted successfully',
      data: result,
   });
});

export const ReviewController = {
   createReview,
   getAllReviews,
   getReviewById,
   updateReviewStatus,
   togglePublishReview,
   deleteReview,
};
