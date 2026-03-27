import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
   {
      title: {
         type: String,
         required: true,
         unique: true,
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

export const Category = model<ICategory, CategoryModel>(
   'Category',
   categorySchema
);
