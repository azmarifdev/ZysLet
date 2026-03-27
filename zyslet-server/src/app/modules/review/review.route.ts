/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { upload } from '../../../helpers/upload';
import { validateRequest } from '../../middleware/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

// Create review (public route)
router.post(
   '/create',
   upload.fields([{ name: 'images', maxCount: 10 }]) as any,
   validateRequest(ReviewValidation.createReviewZodSchema),
   ReviewController.createReview
);

// Get all reviews with pagination and filtering (admin only)
router.get(
   '/lists',
   //  auth(USER_ROLE.ADMIN),
   ReviewController.getAllReviews
);

// Get a single review by ID
router.get(
   '/:id',
   //  auth(USER_ROLE.ADMIN),
   ReviewController.getReviewById
);

// Update review status
router.patch(
   '/status/:id',

   // auth(USER_ROLE.ADMIN),

   validateRequest(ReviewValidation.updateReviewStatusZodSchema),
   ReviewController.updateReviewStatus
);

router.patch('/toggle-publish/:id', ReviewController.togglePublishReview);

// Delete review
router.delete(
   '/:id',
   //  auth(USER_ROLE.ADMIN),
   ReviewController.deleteReview
);

export const ReviewRoutes = router;
