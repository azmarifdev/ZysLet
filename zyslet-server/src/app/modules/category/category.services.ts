import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './category.interface';
import { Category } from './category.model';

// Create a new category
const createCategory = async (payload: ICategory): Promise<ICategory> => {
   const result = await Category.create(payload);
   return result;
};

// Get all categories
const getAllCategories = async (): Promise<ICategory[]> => {
   const result = await Category.find().sort({ createdAt: -1 });
   return result;
};

// Get a single category by ID
const getCategoryById = async (id: string): Promise<ICategory | null> => {
   const result = await Category.findById(id);
   return result;
};

// Update a category
const updateCategory = async (
   id: string,
   payload: Partial<ICategory>
): Promise<ICategory | null> => {
   const result = await Category.findByIdAndUpdate(id, payload, {
      new: true,
   });
   return result;
};

// Delete a category
const deleteCategory = async (id: string): Promise<ICategory | null> => {
   const result = await Category.findByIdAndDelete(id);
   if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
   }
   return result;
};

export const CategoryServices = {
   createCategory,
   getAllCategories,
   getCategoryById,
   updateCategory,
   deleteCategory,
};
