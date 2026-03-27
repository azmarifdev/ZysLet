import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { ICategory } from './category.interface';
import { CategoryServices } from './category.services';
// Create a new category

const createCategory = catchAsync(async (req: Request, res: Response) => {
   const result = await CategoryServices.createCategory(req.body);

   sendResponse<ICategory>(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Category created successfully',
      data: result,
   });
});

// Get all categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
   const result = await CategoryServices.getAllCategories();
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Categories retrieved successfully',
      data: result,
   });
});

// Get a single category by ID
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await CategoryServices.getCategoryById(id);

   sendResponse<ICategory>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Category retrieved successfully',
      data: result,
   });
});

// Update a category
const updateCategory = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await CategoryServices.updateCategory(id, req.body);

   sendResponse<ICategory>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Category updated successfully',
      data: result,
   });
});

// Delete a category
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await CategoryServices.deleteCategory(id);

   sendResponse<ICategory>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Category deleted successfully',
      data: result,
   });
});

export const CategoryController = {
   createCategory,
   getAllCategories,
   getCategoryById,
   updateCategory,
   deleteCategory,
};
