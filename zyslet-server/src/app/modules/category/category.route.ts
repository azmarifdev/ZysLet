// filepath: /home/rsr/My Computer/Devlopement/Client/zyslet-server/src/app/modules/category/category.route.ts
import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = express.Router();

// Create category (protected, admin only)
router.post(
   '/create',
   // auth(USER_ROLE.ADMIN),
   validateRequest(CategoryValidation.createCategoryZodSchema),
   CategoryController.createCategory
);

// Get all categories (public)
router.get('/', CategoryController.getAllCategories);

// Get category by ID
router.get('/:id', CategoryController.getCategoryById);

// Update category (protected, admin only)
router.patch(
   '/:id',
   // auth(USER_ROLE.ADMIN),
   validateRequest(CategoryValidation.updateCategoryZodSchema),
   CategoryController.updateCategory
);

// Delete category (protected, admin only)
router.delete(
   '/:id',
   //  auth(USER_ROLE.ADMIN),
   CategoryController.deleteCategory
);

export const CategoryRoutes = router;
